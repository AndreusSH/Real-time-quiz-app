import express from 'express'
import http from 'http'
import { Server } from 'socket.io'
import cors from 'cors'
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser'
import connectDB from './config/db.js'
import userRoutes from './routes/userRoutes.js'
import quizRoutes from './routes/quizRoutes.js'
import Score from './models/scoreModels.js'

dotenv.config()
const port = process.env.PORT || 5000

connectDB()

const app = express()
const server = http.createServer(app)
const io = new Server(server) // Initialize Socket.IO Server

// Enable CORS for all requests
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use(cookieParser())
app.use('/api/users', userRoutes)
app.use('/api/quizzes', quizRoutes)

app.get('/', (req, res) => res.send('Server is ready'))

// Socket.IO connection handling
io.on('connection', socket => {
  console.log(`User connected Socket ID_": ${socket.id}`)

  // Broadcast a message to all clients when a new player joins
  socket.broadcast.emit('message', 'A new player has joined the game')

  socket.on('participants', () => {
    let participants = io.engine.clientsCount
    // Emit the count back to the client that requested it
    io.emit('p', participants)
   })
  // Handle selectedQuiz event
  socket.on('selectedQuiz', quiz => {
    console.log(`Received selected quiz: ${JSON.stringify(quiz)}`)
    console.log(socket.connected)

    // Emit quizData event to all clients
    io.emit('quizData', quiz)

    // Handle the received quiz data here, such as broadcasting it to other clients
  })

socket.on('pauseNotification', message => {
  console.log('did I even receive pause notification?', message.message);
  // Send the 'hello' event to all other clients except the one that sent the 'pauseNotification' event
  socket.broadcast.emit('hello', message);
});

  socket.on('scoreUpdate', async scoreInfo => {
    console.log('timestamp', scoreInfo.timestamp)
    console.log('connected clients', io.engine.clientsCount)
    console.log(
      `${socket.id} Received score update: ${JSON.stringify(scoreInfo)}`
    )
    try {
      const playerExists = await Score.findOne({ playerId: socket.id })
       if (playerExists) {
        if (playerExists.score === 1) {
          console.log('and the winner is: ', socket.id)
          //socket.broadcast.emit('winner', socket.id)
          socket.emit('winner', socket.id)

           //io.close()
         }
         playerExists.score += scoreInfo.score
        await playerExists.save()
      } else {
        // Save the score in the database
        const newScore = new Score({
          playerId: socket.id,
          score: scoreInfo.score
          // Add additional fields if needed
        })
        // Save the score document to the database
        await newScore.save()
        console.log('Score saved to database:', newScore)
      }
    } catch (error) {
      console.error('Error saving score to database:', error)
    }

    
  })

  // Handle disconnection
  socket.on('disconnect', () => {
    console.log('user disconnected:', socket.id)
  })
})

// Error handling for the server
server.on('error', error => {
  console.error('Server error:', error)
})

// Start the server
server.listen(port, () => {
  console.log(`Server started on port ${port}`)
})

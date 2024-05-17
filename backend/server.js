import express from 'express'
import http from 'http'
import { Server } from 'socket.io'
import cors from 'cors'
import dotenv from 'dotenv'
import path from 'path';
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
const allowedOrigins = ['https://graceful-crumble-1f87ec.netlify.app'];
app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true // If you want to expose cookies to the frontend
}));

app.use((req, res, next) =&gt; {
  // Allow requests from all origins
  res.setHeader('Access-Control-Allow-Origin', '*');
  // Allow specific HTTP methods
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  // Allow specific HTTP headers
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  // Allow credentials (if needed)
  res.setHeader('Access-Control-Allow-Credentials', true);
  // Continue to next middleware
  next();
});

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use(cookieParser())
app.use('/api/users', userRoutes)
app.use('/api/quizzes', quizRoutes)

//app.all('/', (req, res) => res.send('Server is ready'))
// Serve static files from the 'public' directory
if (process.env.NODE_ENV === 'production') {
  //*Set static folder up in production
  app.use(express.static('frontend/dist'));

  app.get('*', (req,res) => res.sendFile(path.resolve(__dirname, '../frontend/dist', 'build','index.html')));
}

// Socket.IO connection handling
io.on('connection', socket => {
  console.log(`User connected Socket ID_": ${socket.id}`)

  // Broadcast a message to all clients when a new player joins
  socket.broadcast.emit('message', 'A new player has joined the game')

  /*
  socket.on('participants', () => {
    let participants = io.engine.clientsCount
    // Emit the count back to the client that requested it
    io.emit('p', participants)
   })
   */
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
      let player = await Score.findOne({ playerId: socket.id });
  
      if (!player) {
        // Player doesn't exist, create a new score document
        player = new Score({
          playerId: socket.id,
          score: 1
        });
      } else {
        // Player exists, increment their score
        player.score += scoreInfo.score;
      }
  
      await player.save();
      
      // Check if the player's score is now 5, if so, emit the winner event
      if (player.score === 5) {
        console.log('and the winner is: ', socket.id)
        socket.emit('winner', socket.id);
      }
      console.log('Score saved to database:', player);
    } catch (error) {
      console.error('Error saving score to database:', error);
    }
  });

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

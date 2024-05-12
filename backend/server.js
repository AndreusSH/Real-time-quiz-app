//Entry point for our server
import express from 'express' //in json I set type: module to use this syntax
import cors from 'cors'

import dotenv from 'dotenv'
dotenv.config()
import cookieParser from 'cookie-parser'
const port = process.env.port || 5000
import userRoutes from './routes/userRoutes.js'
import quizRoutes from './routes/quizRoutes.js'
import connectDB from './config/db.js'

connectDB()

const app = express()
// Enable CORS for all requests
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use(cookieParser())
app.use('/api/users', userRoutes)
app.use('/api/quizzes', quizRoutes)

app.get('/', (req, res) => res.send('Server is ready'))
app.listen(port, () => console.log(`Server started on route ${port}`))

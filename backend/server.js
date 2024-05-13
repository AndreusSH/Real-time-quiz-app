import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import connectDB from './config/db.js';
import userRoutes from './routes/userRoutes.js';
import quizRoutes from './routes/quizRoutes.js';

dotenv.config();
const port = process.env.PORT || 5000;

connectDB();

const app = express();
const server = http.createServer(app);
const io = new Server(server); // Initialize Socket.IO Server
//console.log('io server is initialized', io)

// Enable CORS for all requests
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());
app.use('/api/users', userRoutes);
app.use('/api/quizzes', quizRoutes);

app.get('/', (req, res) => res.send('Server is ready'));

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log(`User connected Socket ID: ${socket.id}`);
  console.log(socket.connected)  
  socket.on('disconnect', () => {
    console.log('user disconnected:', socket.id);
  });
});


server.listen(port, () => {
  console.log(`Server started on port ${port}`);
});

import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/db';
import authRoutes from './routes/authRoutes';
import Message from './models/Message';

// Load environment variables
dotenv.config();

// Connect to Database
connectDB();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*', // For development. Update in production
    methods: ['GET', 'POST']
  }
});

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);

app.get('/api/status', (req, res) => {
  res.json({ status: 'API is running' });
});

// Socket.io Connection
io.on('connection', (socket) => {
  console.log('New client connected:', socket.id);

  socket.on('join_chat', (userId) => {
    socket.join(userId);
    console.log(`User ${userId} joined room`);
  });

  socket.on('send_message', async (data) => {
    try {
      const { sender, receiver, content } = data;
      
      // Solo guardar en BD si la BD está conectada (para desarrollo)
      let savedMessage = data;
      if (require('mongoose').connection.readyState === 1) {
        savedMessage = await Message.create({ sender, receiver, content });
      }

      // Emit to receiver's room
      io.to(receiver).emit('receive_message', savedMessage);
      // Emit back to sender
      socket.emit('receive_message', savedMessage);
    } catch (error) {
      console.error('Error saving message:', error);
    }
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

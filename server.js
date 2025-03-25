const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');

// Create Express app
const app = express();

// Enable CORS for all routes
app.use(cors());

// Create HTTP server
const server = http.createServer(app);

// Initialize Socket.io with CORS configuration
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:3000", // Your React app's URL
    methods: ["GET", "POST"]
  }
});

// Serve static files in production (if you're serving your React build)
if (process.env.NODE_ENV === 'production') {
  app.use(express.static('client/build'));
}

// Socket.io connection handler
io.on('connection', (socket) => {
  console.log('New user connected:', socket.id);

  // Handle incoming messages
  socket.on('sendMessage', (msgData) => {
    console.log('Message received:', msgData);
    
    // Broadcast the message to all connected clients
    io.emit('receiveMessage', msgData);
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// Start the server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});





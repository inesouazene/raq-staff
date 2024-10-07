// server.js

const express = require('express');
const cors = require('cors');
require('dotenv').config();

// Initializing the express app
const app = express();

// Setting up environment variables
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(express.json());

// Import routes
const homeRoutes = require('./routes/homeRoutes');
const employeeRoutes = require('./routes/employeeRoutes');
const userRoutes = require('./routes/userRoutes');

// Use routes
app.use('/', homeRoutes);
app.use('/employees', employeeRoutes);
app.use('/users', userRoutes);

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// Error handling for uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  process.exit(1);
});

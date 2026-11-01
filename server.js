const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables from .env file
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/jobsync_db';

// ==========================================
// Middleware
// ==========================================
// Enable CORS for cross-origin client requests
app.use(cors());

// Parse incoming JSON payloads
app.use(express.json());

// Parse incoming URL-encoded form data
app.use(express.urlencoded({ extended: true }));

const jobRoutes = require('./routes/jobRoutes');

// ==========================================
// Routes
// ==========================================
// Mount Job Applications CRUD API
app.use('/api/jobs', jobRoutes);

// Health check / welcome endpoint
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Welcome to JobSync Career Dashboard API',
    version: '1.0.0',
    status: 'Running'
  });
});

app.get('/api/health', (req, res) => {
  const dbStatus = mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected';
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    database: dbStatus
  });
});

// 404 Handler for undefined routes
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Cannot ${req.method} ${req.originalUrl}`
  });
});

// ==========================================
// Database Connection & Server Initialization
// ==========================================
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(MONGO_URI);
    console.log(`[Database] MongoDB Connected successfully: ${conn.connection.host}`);
  } catch (error) {
    console.error(`[Database Error] Connection failed: ${error.message}`);
    // Exit process with failure code if initial DB connection is essential
    process.exit(1);
  }
};

// Monitor MongoDB connection events
mongoose.connection.on('disconnected', () => {
  console.warn('[Database Warning] MongoDB disconnected.');
});

mongoose.connection.on('error', (err) => {
  console.error(`[Database Error] Runtime connection error: ${err.message}`);
});

// Start Express server after attempting DB connection
const startServer = async () => {
  await connectDB();

  const server = app.listen(PORT, () => {
    console.log(`[Server] JobSync Backend is running on http://localhost:${PORT}`);
  });

  // Graceful shutdown handling
  const shutdown = async (signal) => {
    console.log(`\n[Server] Received ${signal}. Gracefully shutting down...`);
    server.close(async () => {
      console.log('[Server] HTTP server closed.');
      await mongoose.connection.close();
      console.log('[Database] MongoDB connection closed.');
      process.exit(0);
    });
  };

  process.on('SIGINT', () => shutdown('SIGINT'));
  process.on('SIGTERM', () => shutdown('SIGTERM'));
};

startServer();

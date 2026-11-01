const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/jobsync_db';

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(MONGO_URI);
    console.log(`[Database] MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`[Database Error] Connection failed: ${error.message}`);
    process.exit(1);
  }
};

mongoose.connection.on('disconnected', () => {
  console.warn('[Database Warning] MongoDB disconnected.');
});

mongoose.connection.on('error', (err) => {
  console.error(`[Database Error] Runtime error: ${err.message}`);
});

const startServer = async () => {
  await connectDB();
  const server = app.listen(PORT, () => {
    console.log(`[Server] JobSync Backend is running on http://localhost:${PORT}`);
  });

  const shutdown = async (signal) => {
    console.log(`\n[Server] Received ${signal}. Shutting down...`);
    server.close(async () => {
      await mongoose.connection.close();
      process.exit(0);
    });
  };

  process.on('SIGINT', () => shutdown('SIGINT'));
  process.on('SIGTERM', () => shutdown('SIGTERM'));
};

startServer();

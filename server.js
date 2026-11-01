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

module.exports = { app, connectDB };

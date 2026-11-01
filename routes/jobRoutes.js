const express = require('express');
const mongoose = require('mongoose');
const JobApplication = require('../models/JobApplication');

const router = express.Router();

const validateObjectId = (req, res, next) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({
      success: false,
      message: `Invalid application ID: '${id}'`
    });
  }
  next();
};

module.exports = router;

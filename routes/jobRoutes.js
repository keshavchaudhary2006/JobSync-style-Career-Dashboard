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

router.get('/', async (req, res) => {
  try {
    const { status, search, sortBy = 'createdAt', order = 'desc' } = req.query;
    const filter = {};

    if (status) filter.status = status;
    if (search) {
      filter.$or = [
        { companyName: { $regex: search, $options: 'i' } },
        { jobTitle: { $regex: search, $options: 'i' } }
      ];
    }

    const sortOrder = order === 'asc' ? 1 : -1;
    const applications = await JobApplication.find(filter).sort({ [sortBy]: sortOrder });

    res.status(200).json({
      success: true,
      count: applications.length,
      data: applications
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error retrieving job applications',
      error: error.message
    });
  }
});

module.exports = router;

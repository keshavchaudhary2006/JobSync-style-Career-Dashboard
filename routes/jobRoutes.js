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

router.get('/:id', validateObjectId, async (req, res) => {
  try {
    const application = await JobApplication.findById(req.params.id);
    if (!application) {
      return res.status(404).json({
        success: false,
        message: `Job application not found with ID: ${req.params.id}`
      });
    }
    res.status(200).json({ success: true, data: application });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const { companyName, jobTitle, status, dateApplied, jobUrl, notes } = req.body;
    const newApplication = await JobApplication.create({
      companyName,
      jobTitle,
      status,
      dateApplied,
      jobUrl,
      notes
    });
    res.status(201).json({
      success: true,
      message: 'Job application created successfully',
      data: newApplication
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((val) => val.message);
      return res.status(400).json({ success: false, message: 'Validation failed', errors: messages });
    }
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
});

module.exports = router;

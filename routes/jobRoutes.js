const express = require('express');
const mongoose = require('mongoose');
const JobApplication = require('../models/JobApplication');

const router = express.Router();

// Helper middleware to validate MongoDB ObjectId
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

// ==========================================
// 1. GET ALL Job Applications
// Route: GET /api/jobs
// Supports optional filtering: ?status=Interview&search=Google
// ==========================================
router.get('/', async (req, res) => {
  try {
    const { status, search, sortBy = 'createdAt', order = 'desc' } = req.query;
    const filter = {};

    // Filter by status if provided
    if (status) {
      filter.status = status;
    }

    // Search by companyName or jobTitle (case-insensitive regex)
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
    console.error(`[Error] GET /api/jobs: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Server error retrieving job applications',
      error: error.message
    });
  }
});

// ==========================================
// 2. GET SINGLE Job Application by ID
// Route: GET /api/jobs/:id
// ==========================================
router.get('/:id', validateObjectId, async (req, res) => {
  try {
    const application = await JobApplication.findById(req.params.id);

    if (!application) {
      return res.status(404).json({
        success: false,
        message: `Job application not found with ID: ${req.params.id}`
      });
    }

    res.status(200).json({
      success: true,
      data: application
    });
  } catch (error) {
    console.error(`[Error] GET /api/jobs/:id: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Server error retrieving job application',
      error: error.message
    });
  }
});

// ==========================================
// 3. CREATE New Job Application
// Route: POST /api/jobs
// ==========================================
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
    console.error(`[Error] POST /api/jobs: ${error.message}`);

    // Handle Mongoose schema validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((val) => val.message);
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: messages
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error creating job application',
      error: error.message
    });
  }
});

// ==========================================
// 4. UPDATE Job Application by ID
// Route: PUT /api/jobs/:id
// ==========================================
router.put('/:id', validateObjectId, async (req, res) => {
  try {
    const updatedApplication = await JobApplication.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true, // Return modified document
        runValidators: true // Re-run schema validators on update
      }
    );

    if (!updatedApplication) {
      return res.status(404).json({
        success: false,
        message: `Job application not found with ID: ${req.params.id}`
      });
    }

    res.status(200).json({
      success: true,
      message: 'Job application updated successfully',
      data: updatedApplication
    });
  } catch (error) {
    console.error(`[Error] PUT /api/jobs/:id: ${error.message}`);

    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((val) => val.message);
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: messages
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error updating job application',
      error: error.message
    });
  }
});

// ==========================================
// 5. DELETE Job Application by ID
// Route: DELETE /api/jobs/:id
// ==========================================
router.delete('/:id', validateObjectId, async (req, res) => {
  try {
    const deletedApplication = await JobApplication.findByIdAndDelete(req.params.id);

    if (!deletedApplication) {
      return res.status(404).json({
        success: false,
        message: `Job application not found with ID: ${req.params.id}`
      });
    }

    res.status(200).json({
      success: true,
      message: 'Job application deleted successfully',
      data: { id: req.params.id }
    });
  } catch (error) {
    console.error(`[Error] DELETE /api/jobs/:id: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Server error deleting job application',
      error: error.message
    });
  }
});

module.exports = router;

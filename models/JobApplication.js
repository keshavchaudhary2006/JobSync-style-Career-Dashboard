const mongoose = require('mongoose');

const jobApplicationSchema = new mongoose.Schema(
  {
    companyName: {
      type: String,
      required: [true, 'Company name is required'],
      trim: true,
      maxlength: [100, 'Company name cannot exceed 100 characters']
    },
    jobTitle: {
      type: String,
      required: [true, 'Job title is required'],
      trim: true,
      maxlength: [100, 'Job title cannot exceed 100 characters']
    },
    status: {
      type: String,
      required: [true, 'Application status is required'],
      enum: {
        values: ['Wishlist', 'Applied', 'Interview', 'Offer', 'Rejected'],
        message: '{VALUE} is not a valid application status'
      },
      default: 'Applied'
    },
    dateApplied: {
      type: Date,
      default: Date.now
    },
    jobUrl: {
      type: String,
      trim: true
    },
    notes: {
      type: String,
      trim: true,
      maxlength: [2000, 'Notes cannot exceed 2000 characters']
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('JobApplication', jobApplicationSchema);

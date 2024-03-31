const mongoose = require('mongoose');

const certificateSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  certificateId: {
    type: String,
    required: true,
    unique: true // Set certificateId as unique
  },
  certificateName: {
    type: String,
    required: true
  },
  description: String,
  issuingAuthority: String,
  issueDate: {
    type: Date,
    required: true
  },
  validityPeriodMonths: Number,
  supportedDocumentLink: String,
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

certificateSchema.pre("save", function (next) {
  this.updatedAt = new Date();
  next();
});

const Certificate = mongoose.model('Certificate', certificateSchema);

module.exports = Certificate;

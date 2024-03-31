const mongoose = require('mongoose');

const projectExperienceSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  projectName: {
    type: String,
    required: true
  },
  description: String,
  startDate: Date,
  endDate: Date,
  supportedDocumentLink: String, // Adding supportedDocumentLink field
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

projectExperienceSchema.pre("save", function (next) {
  this.updatedAt = new Date();
  next();
});

const ProjectExperience = mongoose.model('ProjectExperience', projectExperienceSchema);

module.exports = ProjectExperience;

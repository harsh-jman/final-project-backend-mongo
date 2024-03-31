const mongoose = require('mongoose');

const skillSchema = new mongoose.Schema({
  skillName: {
    type: String,
    required: true,
    unique:true
  },
  description: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

skillSchema.pre("save", function (next) {
  this.updatedAt = new Date();
  next();
});

const Skill = mongoose.model('Skill', skillSchema);

module.exports = Skill;

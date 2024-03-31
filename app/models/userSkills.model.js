const mongoose = require('mongoose');

const userSkillSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  skillId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Skill',
    required: true
  },
  proficiency: {
    type: String,
    enum: ["beginner", "intermediate", "advanced"],
    required: true
  },
  certificateId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Certificate'
  },
  projectExperienceId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ProjectExperience'
  },
  approverDetailId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ApproverDetail'
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

userSkillSchema.pre("save", function (next) {
  this.updatedAt = new Date();
  next();
});

const UserSkill = mongoose.model('UserSkill', userSkillSchema);

module.exports = UserSkill;

const mongoose = require('mongoose');

const approverDetailSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  approverUserId: { // Add approverUserId field
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  userSkillId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'UserSkill',
    required: true
  },
  status: {
    type: String,
    enum: ["Alocating Approver","Pending", "Approved", "Rejected"],
    default: "Alocating Approver",
    required:true
  },
  comments: String,
  rating: {
    type: Number,
    min: 1,
    max: 5
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

approverDetailSchema.pre("save", function (next) {
  this.updatedAt = new Date();
  next();
});

const ApproverDetail = mongoose.model('ApproverDetail', approverDetailSchema);

module.exports = ApproverDetail;

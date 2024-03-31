const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ["admin", "user"],
    default: "user"
  },
  forcePasswordReset: {
    type: Boolean,
    default: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  designation: {
    type: String,
    enum: ["Software Engineer", "Sr. Software Engineer", "Solution Enabler", "Consultant", "Architect", "Principal Architect"],
    required : true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: null
  },
  skills: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'UserSkill'
    }
  ]
});

userSchema.pre("save", function (next) {
  this.updatedAt = new Date();
  next();
});

const User = mongoose.model("User", userSchema);

module.exports = User;

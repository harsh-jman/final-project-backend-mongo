// log.model.js

const mongoose = require('mongoose');

const logSchema = new mongoose.Schema({
  level: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  task: {
    type: String,
    enum: ['Data Ingestion', 'ML Training', 'EDA Report','DBT Docs','DBT Run'], // Add your task options here
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Log = mongoose.model('Log', logSchema);

module.exports = Log;

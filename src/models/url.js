const mongoose = require('mongoose');

const clickDetailSchema = new mongoose.Schema({
  timestamp: {
    type: Date,
    default: Date.now,
  },
  ipAddress: String,
  userAgent: String,
}, { _id: false }); // To disable auto _id generation for this sub-document

const urlSchema = new mongoose.Schema({
  originalUrl: {
    type: String,
    required: true,
  },
  urlCode: {
    type: String,
    required: true,
  },
  userId: {
    type: String,
    required: false, 
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  clicks: {
    type: Number,
    default: 0,
  },
  clickDetails: {
    type: [clickDetailSchema], // Array of click details.
    default: [],
  },
});

module.exports = mongoose.model('Url', urlSchema);

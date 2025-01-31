const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  uid: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  nickname: {
    type: String
  },
  phone: {
    type: String
  },
  photoURL: {
    type: String
  },
  language: String,
  courses: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course'
  }],
  firstLogin: {
    type: Boolean,
    default: true
  },
  lastLogin: {
    type: Date,
    default: Date.now
  },
  courseProgress: {
    type: Map,
    of: {
      completedReadings: [String],
      progress: Number
    },
    default: new Map()
  }
});

module.exports = mongoose.model('Student', studentSchema);

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
  name: String,
  nickname: String,
  photoURL: String,
  phone: String,
  language: String,
  courses: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course'
  }],
  firstLogin: {
    type: Boolean,
    default: true
  },
  lastLogin: Date
});

module.exports = mongoose.model('Student', studentSchema);

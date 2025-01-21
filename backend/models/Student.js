const mongoose = require('mongoose');
const StudentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  courses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Course' }],
  language: { type: String, required: true },
  progress: {
    completedLessons: { type: Number, default: 0 },
    totalLessons: { type: Number, default: 0 },
  },
});

module.exports = mongoose.model('Student', StudentSchema);

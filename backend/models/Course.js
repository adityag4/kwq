const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  subject: { type: String, required: true },
  duration: { type: Number, required: true }, // Duration in minutes
  progress: {
    type: Number,
    default: 0
  },
  lessons: [{
    title: String,
    duration: Number,
    completed: {
      type: Boolean,
      default: false
    }
  }]
});

module.exports = mongoose.model("Course", courseSchema);

const mongoose = require("mongoose");

const readingSchema = new mongoose.Schema({
  title: String,
  content: String,
  completed: {
    type: Map,
    of: Boolean,
    default: new Map()
  }
});

const lessonSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  duration: { type: Number, required: true },
  completed: {
    type: Map,
    of: Boolean,
    default: new Map()
  }
});

const courseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  subject: {
    type: String,
    required: true
  },
  duration: {
    type: Number,
    required: true
  },
  readings: [readingSchema],
  lessons: [lessonSchema],
  progress: {
    type: Map,
    of: Number,
    default: () => new Map()
  }
});

// Add a method to safely update progress
courseSchema.methods.updateProgress = function(userId, newProgress) {
  if (!this.progress) {
    this.progress = new Map();
  }
  this.progress.set(userId, newProgress);
};

module.exports = mongoose.model("Course", courseSchema);

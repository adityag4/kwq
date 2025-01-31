const express = require("express");
const Course = require("../models/Course");

const router = express.Router();

// Get all courses
router.get("/", async (req, res) => {
  try {
    const courses = await Course.find();
    res.json(courses);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add a new course
router.post("/", async (req, res) => {
  const { name, description, duration } = req.body;
  try {
    const newCourse = new Course({ name, description, duration });
    const savedCourse = await newCourse.save();
    res.status(201).json(savedCourse);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get course progress
router.get('/:courseId/progress/:userId', async (req, res) => {
  try {
    const { courseId, userId } = req.params;
    const course = await Course.findById(courseId);
    
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // Calculate completed items
    const completedReadings = course.readings.filter(r => r.completed?.get(userId)).length;
    const completedLessons = course.lessons.filter(l => l.completed?.get(userId)).length;
    const totalReadings = course.readings.length;
    const totalLessons = course.lessons.length;
    
    // Calculate total progress
    const totalItems = totalReadings + totalLessons;
    const totalCompleted = completedReadings + completedLessons;
    const progress = totalItems > 0 ? Math.round((totalCompleted / totalItems) * 100) : 0;

    res.json({
      _id: course._id,
      title: course.title,
      subject: course.subject,
      duration: course.duration,
      progress,
      readings: course.readings.map(r => ({
        _id: r._id,
        title: r.title,
        content: r.content,
        completed: r.completed?.get(userId) || false
      })),
      lessons: course.lessons.map(l => ({
        _id: l._id,
        title: l.title,
        content: l.content,
        completed: l.completed?.get(userId) || false
      })),
      totalCompleted,
      totalItems,
      completedReadings,
      totalReadings,
      completedLessons,
      totalLessons
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Mark reading as complete
router.post('/:courseId/readings/:readingId/complete', async (req, res) => {
  try {
    const { courseId, readingId } = req.params;
    const { userId } = req.body;

    let course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // Initialize progress if it doesn't exist
    if (!course.progress) {
      course.progress = new Map();
    }

    const reading = course.readings.find(r => r._id.toString() === readingId);
    if (!reading) {
      return res.status(404).json({ message: 'Reading not found' });
    }

    // Initialize completed Map if needed
    if (!reading.completed) {
      reading.completed = new Map();
    }

    // Mark as completed
    reading.completed.set(userId, true);
    
    // Calculate new progress
    const totalReadings = course.readings.length;
    const completedReadings = course.readings.filter(r => 
      r.completed && r.completed.get(userId)
    ).length;
    const progress = Math.round((completedReadings / totalReadings) * 100);
    
    // Set progress
    course.progress.set(userId, progress);

    // Mark as modified
    course.markModified('readings');
    course.markModified('progress');
    
    await course.save();

    res.json({ 
      progress,
      message: 'Reading marked as complete'
    });
  } catch (error) {
    console.error('Error marking reading as complete:', error);
    res.status(500).json({ 
      error: 'Failed to mark reading as complete',
      details: error.message 
    });
  }
});

// Mark lesson as complete
router.post('/:courseId/lessons/:lessonId/complete', async (req, res) => {
  try {
    const { courseId, lessonId } = req.params;
    const { userId } = req.body;

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    const lesson = course.lessons.id(lessonId);
    if (!lesson) {
      return res.status(404).json({ message: 'Lesson not found' });
    }

    lesson.completed.set(userId, true);
    
    // Calculate new progress
    const totalLessons = course.lessons.length;
    const completedLessons = course.lessons.filter(l => l.completed.get(userId)).length;
    const progress = (completedLessons / totalLessons) * 100;
    
    course.progress.set(userId, progress);
    await course.save();

    res.json({ progress });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update lesson content
router.put('/:courseId/lessons/:lessonId/content', async (req, res) => {
  try {
    const { courseId, lessonId } = req.params;
    const { content } = req.body;

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    const lesson = course.lessons.id(lessonId);
    if (!lesson) {
      return res.status(404).json({ message: 'Lesson not found' });
    }

    lesson.content = content;
    await course.save();

    res.json({ message: 'Lesson content updated successfully' });
  } catch (error) {
    console.error('Error updating lesson content:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get a single course
router.get('/:courseId', async (req, res) => {
  try {
    const { courseId } = req.params;
    const course = await Course.findById(courseId);
    
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    res.json(course);
  } catch (error) {
    console.error('Error fetching course:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get a single reading
router.get('/:courseId/readings/:readingId', async (req, res) => {
  try {
    const { courseId, readingId } = req.params;
    console.log('Fetching reading:', { courseId, readingId });
    
    const course = await Course.findById(courseId);
    if (!course) {
      console.log('Course not found:', courseId);
      return res.status(404).json({ message: 'Course not found' });
    }

    const reading = course.readings.id(readingId);
    if (!reading) {
      console.log('Reading not found:', readingId);
      return res.status(404).json({ message: 'Reading not found' });
    }

    console.log('Found reading:', reading);
    res.json(reading);
  } catch (error) {
    console.error('Error fetching reading:', error);
    res.status(500).json({ error: error.message });
  }
});

// Save reading content
router.put('/:courseId/readings/:readingId/content', async (req, res) => {
  try {
    const { courseId, readingId } = req.params;
    const { content } = req.body;

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    const reading = course.readings.id(readingId);
    if (!reading) {
      return res.status(404).json({ message: 'Reading not found' });
    }

    reading.content = content;
    await course.save();

    res.json({ message: 'Content saved successfully' });
  } catch (error) {
    console.error('Error saving content:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;

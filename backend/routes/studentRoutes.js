const express = require('express');
const Student = require('../models/Student');
const mongoose = require('mongoose');

const router = express.Router();

// Get all students
router.get('/', async (req, res) => {
  try {
    const students = await Student.find();
    res.json(students);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get a single student by ID
router.get('/:id', async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) return res.status(404).json({ error: 'Student not found' });
    res.json(student);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
// Add a helper function to validate ObjectId
const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

router.post('/', async (req, res) => {
  try {
    const { name, email, phone, courses, language } = req.body;

    // Create a new student
    const newStudent = new Student({
      name,
      email,
      phone,
      courses,
      language,
      progress: {
        completedLessons: 0, // Default value
        totalLessons: 0, // Default value
      },
    });

    const savedStudent = await newStudent.save();
    res.status(201).json(savedStudent);
  } catch (error) {
    console.error('Error in POST /api/students:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// Add this route for authentication
router.post('/auth', async (req, res) => {
  try {
    const { uid, email, name, photoURL } = req.body;
    
    let student = await Student.findOne({ uid });
    const isFirstLogin = !student;
    
    if (!student) {
      student = new Student({
        uid,
        email,
        name,
        photoURL,
        firstLogin: true,
        courses: []
      });
    } else {
      student.lastLogin = new Date();
    }
    
    await student.save();
    res.status(200).json({ student, isFirstLogin });
  } catch (error) {
    console.error('Error in auth:', error);
    res.status(500).json({ error: error.message });
  }
});

router.get('/profile/:uid', async (req, res) => {
  try {
    const student = await Student.findOne({ uid: req.params.uid });
    
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }
    
    res.json(student);
  } catch (error) {
    console.error('Error fetching student profile:', error);
    res.status(500).json({ error: error.message });
  }
});

router.post('/update-courses/:uid', async (req, res) => {
  try {
    const { courses } = req.body;
    const student = await Student.findOne({ uid: req.params.uid });
    
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }
    
    student.courses = courses;
    student.firstLogin = false;
    await student.save();
    
    res.json(student);
  } catch (error) {
    console.error('Error updating courses:', error);
    res.status(500).json({ error: error.message });
  }
});

router.post('/update-nickname/:uid', async (req, res) => {
  try {
    const { nickname } = req.body;
    const student = await Student.findOne({ uid: req.params.uid });
    
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }
    
    student.nickname = nickname;
    await student.save();
    
    res.json(student);
  } catch (error) {
    console.error('Error updating nickname:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;

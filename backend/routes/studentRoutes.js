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

router.post('/complete-onboarding/:uid', async (req, res) => {
  try {
    const { nickname, phone, selectedCourses } = req.body;
    const student = await Student.findOne({ uid: req.params.uid });
    
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }
    
    student.nickname = nickname;
    student.phone = phone;
    student.courses = selectedCourses;
    student.firstLogin = false;
    
    await student.save();
    res.json(student);
  } catch (error) {
    console.error('Error completing onboarding:', error);
    res.status(500).json({ error: error.message });
  }
});

router.post('/check-token', async (req, res) => {
  try {
    const { token } = req.body;
    const existingStudent = await Student.findOne({ phone: token });
    
    if (existingStudent) {
      return res.status(400).json({ 
        error: 'This access token is already in use. Please choose a different one.' 
      });
    }
    
    res.status(200).json({ available: true });
  } catch (error) {
    console.error('Error checking access token:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/auth-token', async (req, res) => {
  try {
    const { email, token } = req.body;
    
    const student = await Student.findOne({ 
      email: email.toLowerCase(),
      phone: token 
    });
    
    if (!student) {
      return res.status(401).json({ 
        error: 'Invalid email or access token' 
      });
    }

    // Create a temporary uid if not present
    if (!student.uid) {
      student.uid = student._id.toString();
    }

    // Set a default name if not present
    if (!student.name) {
      student.name = email.split('@')[0];
    }
    
    student.lastLogin = new Date();
    await student.save();
    
    res.status(200).json({ 
      student: {
        uid: student.uid,
        email: student.email,
        name: student.name,
        photoURL: student.photoURL || null,
        firstLogin: student.firstLogin
      }, 
      isFirstLogin: student.firstLogin 
    });
  } catch (error) {
    console.error('Error in token auth:', error);
    res.status(500).json({ error: 'Authentication failed' });
  }
});

module.exports = router;

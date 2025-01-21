const express = require('express');
const Student = require('../models/Student');

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
module.exports = router;

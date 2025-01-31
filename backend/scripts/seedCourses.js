const mongoose = require('mongoose');
const Course = require('../models/Course');

const seedCourses = async () => {
  try {
    await mongoose.connect('mongodb://localhost:27017/learning-platform');
    
    // Clear existing courses
    await Course.deleteMany({});

    const courses = [
      {
        title: 'Introduction to Programming',
        subject: 'Computer Science',
        duration: 120,
        readings: [
          { title: 'Getting Started', content: 'Basic introduction to programming concepts' },
          { title: 'Variables and Types', content: 'Understanding data types and variables' },
          { title: 'Control Flow', content: 'Learning about if statements and loops' },
          { title: 'Functions', content: 'Introduction to functions and modularity' },
          { title: 'Review', content: 'Review of basic programming concepts' }
        ]
      },
      // Add more courses as needed
    ];

    await Course.insertMany(courses);
    console.log('Courses seeded successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding courses:', error);
    process.exit(1);
  }
};

seedCourses();
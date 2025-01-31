const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const Student = require("./models/Student");
const Donor = require("./models/Donor");
const Institution = require("./models/Institution");
const Course = require('./models/Course');

const seedData = [
  {
    title: 'Introduction to Algebra',
    subject: 'Mathematics',
    duration: 30,
    readings: [
      { title: 'Basic Operations', content: 'Learn about addition, subtraction, multiplication, and division.' },
      { title: 'Variables', content: 'Understanding variables in algebra.' }
    ]
  },
  {
    title: 'Basic Chemistry',
    subject: 'Science',
    duration: 45,
    readings: [
      { title: 'Atoms and Molecules', content: 'Introduction to atomic structure.' },
      { title: 'Chemical Bonds', content: 'Understanding chemical bonding.' }
    ]
  },
  {
    title: 'World History',
    subject: 'Social Studies',
    duration: 40,
    readings: [
      { title: 'Ancient Civilizations', content: 'Study of early human civilizations.' },
      { title: 'Middle Ages', content: 'Medieval period and its significance.' }
    ]
  },
  {
    title: 'English Literature',
    subject: 'Language Arts',
    duration: 35,
    readings: [
      { title: 'Shakespeare', content: 'Introduction to Shakespearean works.' },
      { title: 'Poetry Analysis', content: 'Understanding poetic devices.' }
    ]
  }
];

const seedDatabase = async () => {
  try {
    if (!process.env.MONGODB_URI) {
      console.log('Current directory:', __dirname);
      console.log('Attempted env path:', path.join(__dirname, '.env'));
      throw new Error('MONGODB_URI is not defined in environment variables');
    }

    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    await Course.deleteMany({});
    console.log('Cleared existing courses');

    const result = await Course.insertMany(seedData);
    console.log(`Seeded ${result.length} courses successfully`);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1); // Exit with error code
  } finally {
    if (mongoose.connection.readyState === 1) {
      await mongoose.connection.close();
      console.log('MongoDB connection closed');
    }
  }
};

seedDatabase();
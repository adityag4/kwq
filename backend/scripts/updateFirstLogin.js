const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const Student = require('../models/Student');

const updateFirstLoginFlag = async () => {
  try {
    // Check for either MONGO_URI or MONGODB_URI
    const mongoUri = process.env.MONGO_URI || process.env.MONGODB_URI;
    
    if (!mongoUri) {
      throw new Error('Neither MONGO_URI nor MONGODB_URI is defined in environment variables');
    }

    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB successfully');

    const result = await Student.updateMany(
      {}, // Update all students
      { $set: { firstLogin: false } }
    );

    console.log(`Updated ${result.modifiedCount} students`);
    console.log('Migration completed successfully');
  } catch (error) {
    console.error('Error during migration:', error);
  } finally {
    if (mongoose.connection.readyState === 1) {
      await mongoose.connection.close();
      console.log('MongoDB connection closed');
    }
  }
};

updateFirstLoginFlag();
require("dotenv").config();
const mongoose = require("mongoose");
const Student = require("./models/Student");
const Donor = require("./models/Donor");
const Institution = require("./models/Institution");
const Course = require("./models/Course");

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const seedData = async () => {
  try {
    // Clear existing data
    await Student.deleteMany();
    await Donor.deleteMany();
    await Institution.deleteMany();
    await Course.deleteMany();

    console.log("Existing data cleared!");

    // Create Courses
    const courses = await Course.insertMany([
      { title: "Introduction to Algebra", subject: "Mathematics", duration: 30 },
      { title: "Basic Chemistry", subject: "Science", duration: 45 },
      { title: "World History", subject: "Social Studies", duration: 40 },
      { title: "English Literature", subject: "Language Arts", duration: 50 },
    ]);

    console.log("Courses seeded!");

    // Create Students
    const students = await Student.insertMany([
      {
        name: "John Doe",
        email: "john.doe@example.com",
        phone: "1234567890",
        courses: [courses[0]._id, courses[1]._id],
        progress: { completedLessons: 5, totalLessons: 10 },
      },
      {
        name: "Jane Smith",
        email: "jane.smith@example.com",
        phone: "9876543210",
        courses: [courses[2]._id, courses[3]._id],
        progress: { completedLessons: 3, totalLessons: 8 },
      },
    ]);

    console.log("Students seeded!");

    // Create Donors
    const donors = await Donor.insertMany([
      { name: "Alice Brown", email: "alice@example.com", phone: "5551234567", donationAmount: 500 },
      { name: "Bob Green", email: "bob@example.com", phone: "5559876543", donationAmount: 1000 },
    ]);

    console.log("Donors seeded!");

    // Create Institutions
    const institutions = await Institution.insertMany([
      {
        name: "Sunshine Academy",
        location: "123 Sunshine Lane",
        country: "USA",
        contactEmail: "contact@sunshineacademy.com",
      },
      {
        name: "Greenfield Institute",
        location: "456 Greenfield Road",
        country: "Canada",
        contactEmail: "info@greenfieldinstitute.ca",
      },
    ]);

    console.log("Institutions seeded!");

    console.log("Database seeding completed!");
    process.exit();
  } catch (error) {
    console.error("Error seeding database:", error);
    process.exit(1);
  }
};

seedData();
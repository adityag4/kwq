import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Bell, Globe, Menu, Clock, Book, Award, Download, Play } from "lucide-react";
import Header from "./Header";

const StudentDashboard = () => {
  const [courses, setCourses] = useState([]);
  const [progressData, setProgressData] = useState({
    completedLessons: 0,
    totalLessons: 0,
    achievements: 0,
    downloadedContent: 0,
    studyTime: 0,
  });

  useEffect(() => {
    const studentId = localStorage.getItem("studentId"); // Get student ID from localStorage

    const fetchCourses = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/courses");
        const data = await res.json();
        setCourses(data);
      } catch (error) {
        console.error("Error fetching courses:", error);
      }
    };

    const fetchStudentProgress = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/students/${studentId}`);
        const data = await res.json();
        if (data?.progress) {
          setProgressData(data.progress);
        }
      } catch (error) {
        console.error("Error fetching student progress:", error);
      }
    };

    fetchCourses();
    if (studentId) fetchStudentProgress();
  }, []);

  const progressPercentage = progressData.totalLessons
    ? ((progressData.completedLessons / progressData.totalLessons) * 100).toFixed(0)
    : 0;

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-6">Student Dashboard</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Link to="/dashboard/progress" className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg">
          <div className="flex items-center gap-2">
            <Book className="text-blue-600" />
            <h3 className="font-semibold">Progress</h3>
          </div>
          <p className="mt-2 text-2xl font-bold">{progressPercentage}%</p>
          <p className="text-gray-600">
            {progressData.completedLessons}/{progressData.totalLessons || "N/A"} Lessons
          </p>
        </Link>
        {/* Other sections */}
      </div>
      {/* Lessons */}
      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-6">Available Lessons</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {courses.map((course) => (
            <Link
              key={course._id}
              to={`/dashboard/lesson/${course._id}`}
              className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg"
            >
              <h3 className="font-semibold text-lg mb-2">{course.title}</h3>
              <p className="text-gray-600">{course.subject} | {course.duration} min</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

const Dashboard = () => (
  <div className="min-h-screen bg-gray-100">
    <Header />
    <main className="container mx-auto">
      <StudentDashboard />
    </main>
  </div>
);

export default Dashboard;

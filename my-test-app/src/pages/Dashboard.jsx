import React from "react";
import { Link } from "react-router-dom";
import { Bell, Globe, Menu, Clock, Book, Award, Download, Play } from "lucide-react";
import Header from "./Header";

// Student Dashboard Component
const StudentDashboard = () => {
  const progressData = {
    completedLessons: 12,
    totalLessons: 20,
    achievements: 5,
    downloadedContent: 8,
    studyTime: 12, // in hours
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-6">Student Dashboard</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Progress */}
        <Link to="/dashboard/progress" className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg">
          <div className="flex items-center gap-2">
            <Book className="text-blue-600" />
            <h3 className="font-semibold">Progress</h3>
          </div>
          <p className="mt-2 text-2xl font-bold">
            {(progressData.completedLessons / progressData.totalLessons * 100).toFixed(0)}%
          </p>
          <p className="text-gray-600">
            {progressData.completedLessons}/{progressData.totalLessons} Lessons
          </p>
        </Link>

        {/* Achievements */}
        <Link
          to="/dashboard/achievements"
          className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg"
        >
          <div className="flex items-center gap-2">
            <Award className="text-yellow-500" />
            <h3 className="font-semibold">Achievements</h3>
          </div>
          <p className="mt-2 text-2xl font-bold">{progressData.achievements}</p>
          <p className="text-gray-600">Earned</p>
        </Link>

        {/* Study Time */}
        <Link
          to="/dashboard/study-time"
          className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg"
        >
          <div className="flex items-center gap-2">
            <Clock className="text-green-500" />
            <h3 className="font-semibold">Study Time</h3>
          </div>
          <p className="mt-2 text-2xl font-bold">{progressData.studyTime}h</p>
          <p className="text-gray-600">This Week</p>
        </Link>

        {/* Downloads */}
        <Link
          to="/dashboard/downloads"
          className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg"
        >
          <div className="flex items-center gap-2">
            <Download className="text-purple-500" />
            <h3 className="font-semibold">Downloads</h3>
          </div>
          <p className="mt-2 text-2xl font-bold">{progressData.downloadedContent}</p>
          <p className="text-gray-600">Lessons</p>
        </Link>
      </div>

      {/* Lessons */}
      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-6">Available Lessons</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Link
            to="/dashboard/lesson/1"
            className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg"
          >
            <h3 className="font-semibold text-lg mb-2">Introduction to Algebra</h3>
            <p className="text-gray-600">Mathematics | 30 min</p>
          </Link>
          <Link
            to="/dashboard/lesson/2"
            className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg"
          >
            <h3 className="font-semibold text-lg mb-2">Basic Chemistry</h3>
            <p className="text-gray-600">Science | 45 min</p>
          </Link>
          <Link
            to="/dashboard/lesson/3"
            className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg"
          >
            <h3 className="font-semibold text-lg mb-2">World History</h3>
            <p className="text-gray-600">Social Studies | 40 min</p>
          </Link>
        </div>
      </div>
    </div>
  );
};

// Main Dashboard Component
const Dashboard = () => {
    return (
      <div className="min-h-screen bg-gray-100">
        <Header />
        <main className="container mx-auto">
          <StudentDashboard />
        </main>
      </div>
    );
  };

export default Dashboard;

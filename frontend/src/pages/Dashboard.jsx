import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Book } from "lucide-react";
import Header from "./Header";
import { useAuth } from "../contexts/AuthContext";

const StudentDashboard = () => {
  const { user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCourses = async () => {
      if (!user?.uid) return;
      
      try {
        const response = await fetch(`http://localhost:5001/api/students/profile/${user.uid}`);
        if (!response.ok) throw new Error('Failed to fetch profile');
        
        const data = await response.json();
        if (data.courses && data.courses.length > 0) {
          const coursesPromises = data.courses.map(courseId =>
            fetch(`http://localhost:5001/api/courses/${courseId}/progress/${user.uid}`)
              .then(r => r.json())
          );
          
          const coursesData = await Promise.all(coursesPromises);
          setCourses(coursesData);
        }
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, [user]);

  if (loading) return <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>;
  if (error) return <div className="text-red-600">{error}</div>;

  // Calculate totals with proper default values
  const completedReadings = courses.reduce((sum, course) => 
    sum + (course.completedReadings || 0), 0);
  const completedLessons = courses.reduce((sum, course) => 
    sum + (course.completedLessons || 0), 0);
  const totalReadings = courses.reduce((sum, course) => 
    sum + (course.totalReadings || 0), 0);
  const totalLessons = courses.reduce((sum, course) => 
    sum + (course.totalLessons || 0), 0);

  const totalCompleted = completedReadings + completedLessons;
  const totalItems = totalReadings + totalLessons;

  const overallProgress = totalItems > 0 
    ? Math.round((totalCompleted / totalItems) * 100)
    : 0;

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Welcome Back!</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <div className="flex items-center gap-2">
            <Book className="text-blue-600" />
            <h3 className="font-semibold">Overall Progress</h3>
          </div>
          <p className="mt-2 text-2xl font-bold">
            {totalCompleted} of {totalItems} items
          </p>
          <div className="mt-2 text-gray-600">
            <p>Readings: {completedReadings}/{totalReadings}</p>
            <p>Lessons: {completedLessons}/{totalLessons}</p>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-4 mt-2">
            <div
              className="bg-blue-600 h-4 rounded-full transition-all duration-500"
              style={{ width: `${overallProgress}%` }}
            />
          </div>
        </div>
      </div>

      {/* Course List */}
      <h2 className="text-2xl font-bold mb-4">Your Courses</h2>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {courses.map(course => (
          <Link 
            key={course._id}
            to={`/course/${course._id}`}
            className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow"
          >
            <h3 className="text-xl font-bold mb-2">{course.title}</h3>
            <p className="text-gray-600 mb-4">{course.subject} | {course.duration} min</p>
            <div className="w-full bg-gray-200 rounded-full h-4 mb-2">
              <div
                className="bg-green-500 h-4 rounded-full transition-all duration-500"
                style={{ width: `${course.progress || 0}%` }}
              />
            </div>
            <p className="text-gray-600">
              {course.completedReadings + course.completedLessons} of {course.totalReadings + course.totalLessons} items completed
            </p>
            <div className="mt-2 text-sm text-gray-500">
              <p>Readings: {course.completedReadings}/{course.totalReadings}</p>
              <p>Lessons: {course.completedLessons}/{course.totalLessons}</p>
            </div>
          </Link>
        ))}
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

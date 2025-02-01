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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">Welcome back, {user?.displayName}!</h1>
              <p className="text-gray-600">Track your progress and continue learning</p>
            </div>
            <div className="mt-4 md:mt-0">
              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <p className="text-sm text-gray-500">Overall Progress</p>
                  <p className="text-2xl font-bold text-blue-600">{overallProgress}%</p>
                </div>
                <div className="w-16 h-16">
                  <svg viewBox="0 0 36 36" className="circular-chart">
                    <path
                      d="M18 2.0845
                        a 15.9155 15.9155 0 0 1 0 31.831
                        a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="#E2E8F0"
                      strokeWidth="3"
                    />
                    <path
                      d="M18 2.0845
                        a 15.9155 15.9155 0 0 1 0 31.831
                        a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="#3B82F6"
                      strokeWidth="3"
                      strokeDasharray={`${overallProgress}, 100`}
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Course Grid */}
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Your Courses</h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {courses.map(course => (
            <Link 
              key={course._id}
              to={`/course/${course._id}`}
              className="group bg-white rounded-2xl shadow-lg hover:shadow-xl transform transition-all duration-300 hover:-translate-y-1"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-gray-800 group-hover:text-blue-600 transition-colors">
                    {course.title}
                  </h3>
                  <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded-full">
                    {course.subject}
                  </span>
                </div>

                <div className="space-y-4">
                  {/* Progress Bar */}
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-gray-700">Course Progress</span>
                      <span className="text-sm font-semibold text-blue-600">{course.progress || 0}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
                      <div
                        className="bg-blue-600 h-2.5 rounded-full transition-all duration-500 ease-out"
                        style={{ width: `${course.progress || 0}%` }}
                      />
                    </div>
                  </div>

                  {/* Stats Grid */}
                  <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-100">
                    <div>
                      <p className="text-sm text-gray-500">Readings</p>
                      <p className="text-lg font-semibold text-gray-700">
                        {course.completedReadings}/{course.totalReadings}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Lessons</p>
                      <p className="text-lg font-semibold text-gray-700">
                        {course.completedLessons}/{course.totalLessons}
                      </p>
                    </div>
                  </div>

                  {/* Time Estimate */}
                  <div className="flex items-center text-gray-500">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-sm">{course.duration} minutes</span>
                  </div>
                </div>
              </div>
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

import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Book } from "lucide-react";
import Header from "./Header";
import { useAuth } from "../contexts/AuthContext";

const StudentDashboard = () => {
  const { user } = useAuth();
  const [studentData, setStudentData] = useState(null);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [progressData, setProgressData] = useState({
    completedLessons: 0,
    totalLessons: 0
  });

  useEffect(() => {
    const fetchData = async () => {
      if (!user?.uid) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        // Fetch enrolled courses
        if (user.courses && user.courses.length > 0) {
          const coursesResponse = await fetch(`http://localhost:5001/api/courses?ids=${user.courses.join(',')}`);
          if (coursesResponse.ok) {
            const coursesData = await coursesResponse.json();
            setCourses(coursesData);
          }
        }
        
        setStudentData(user);
      } catch (error) {
        console.error('Error:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  if (loading) return <div className="min-h-screen flex items-center justify-center">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
  </div>;

  if (error) return <div className="text-red-600 text-center">{error}</div>;

  return (
    <div className="p-4">
      <div className="mb-6">
        <h2 className="text-2xl font-bold">Hi, {studentData?.nickname || studentData?.name}</h2>
        <p className="text-gray-600">{studentData?.email}</p>
      </div>

      {/* Progress Card */}
      <div className="grid grid-cols-1 gap-4">
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
      </div>

      {/* Enrolled Courses */}
      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-6">Your Courses</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {courses.map(course => (
            <Link 
              key={course._id} 
              to={`/dashboard/course/${course._id}`}
              className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg"
            >
              <h3 className="font-semibold text-lg mb-2">{course.title}</h3>
              <p className="text-gray-600">{course.subject} | {course.duration} min</p>
              <div className="mt-2">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full" 
                    style={{ width: `${course.progress || 0}%` }}
                  ></div>
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

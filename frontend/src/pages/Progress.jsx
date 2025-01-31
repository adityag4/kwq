import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Progress = () => {
  const { user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const response = await fetch(`http://localhost:5001/api/students/profile/${user.uid}`);
        if (!response.ok) throw new Error('Failed to fetch student profile');
        
        const studentData = await response.json();
        if (studentData.courses && studentData.courses.length > 0) {
          const coursesPromises = studentData.courses.map(courseId =>
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

    fetchProgress();
  }, [user]);

  if (loading) return <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>;
  if (error) return <div className="text-red-600">{error}</div>;

  const totalProgress = courses.length > 0 
    ? courses.reduce((sum, course) => sum + (course.progress || 0), 0) / courses.length 
    : 0;

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-blue-600 mb-6">Your Learning Progress</h1>
      
      <div className="bg-white p-6 rounded-lg shadow-lg mb-8">
        <h2 className="text-2xl font-bold mb-4">Overall Progress</h2>
        <div className="w-full bg-gray-200 rounded-full h-6">
          <div
            className="bg-blue-600 h-6 rounded-full text-center text-white text-sm flex items-center justify-center"
            style={{ width: `${totalProgress}%` }}
          >
            {Math.round(totalProgress)}%
          </div>
        </div>
      </div>

      <h2 className="text-2xl font-bold mb-4">Your Courses</h2>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {courses.map(course => (
          <Link 
            key={course.courseId} 
            to={`/course/${course.courseId}`}
            className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow"
          >
            <h3 className="text-xl font-bold mb-4">{course.title}</h3>
            <p className="text-gray-600 mb-2">{course.subject} | {course.duration} min</p>
            <div className="w-full bg-gray-200 rounded-full h-4 mb-4">
              <div
                className="bg-green-500 h-4 rounded-full transition-all duration-500"
                style={{ width: `${course.progress || 0}%` }}
              />
            </div>
            <p className="text-gray-600">
              {course.readings.filter(r => r.completed).length} of {course.readings.length} readings completed
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Progress; 
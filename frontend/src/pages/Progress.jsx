import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

const Progress = () => {
  const { user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProgress = async () => {
      if (!user?.uid) {
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`http://localhost:5001/api/students/profile/${user.uid}`);
        if (!response.ok) {
          throw new Error('Failed to fetch student profile');
        }
        const studentData = await response.json();

        if (studentData.courses && studentData.courses.length > 0) {
          const coursesPromises = studentData.courses.map(courseId =>
            fetch(`http://localhost:5001/api/courses/${courseId}/progress/${user.uid}`)
              .then(r => {
                if (!r.ok) throw new Error(`Failed to fetch course ${courseId}`);
                return r.json();
              })
          );

          const coursesData = await Promise.all(coursesPromises);
          setCourses(coursesData);
        }
      } catch (error) {
        console.error('Error:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProgress();
  }, [user]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8">
        <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-lg">
          {error}
        </div>
      </div>
    );
  }

  if (!courses.length) {
    return (
      <div className="p-8">
        <h1 className="text-3xl font-bold text-blue-600 mb-6">Progress Details</h1>
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <p className="text-gray-600">No courses enrolled yet.</p>
        </div>
      </div>
    );
  }

  const totalProgress = courses.length > 0
    ? courses.reduce((sum, course) => sum + (course.progress || 0), 0) / courses.length
    : 0;

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-blue-600 mb-6">Progress Details</h1>
      
      <div className="bg-white p-6 rounded-lg shadow-lg mb-8">
        <h2 className="text-2xl font-bold mb-4">Overall Progress</h2>
        <div className="w-full bg-gray-200 rounded-full h-6">
          <div
            className="bg-blue-600 h-6 rounded-full text-center text-white text-sm flex items-center justify-center transition-all duration-500"
            style={{ width: `${Math.max(totalProgress, 0)}%` }}
          >
            {Math.round(totalProgress)}%
          </div>
        </div>
      </div>

      <div className="grid gap-6">
        {courses.map(course => (
          <div key={course._id} className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-bold mb-4">{course.title}</h3>
            <div className="w-full bg-gray-200 rounded-full h-4 mb-4">
              <div
                className="bg-green-500 h-4 rounded-full transition-all duration-500"
                style={{ width: `${Math.max(course.progress || 0, 0)}%` }}
              />
            </div>
            <p className="text-gray-600">
              {course.readings?.filter(r => r.completed)?.length || 0} of {course.readings?.length || 0} readings completed
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Progress; 
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const CourseSelection = () => {
  const [courses, setCourses] = useState([]);
  const [selectedCourses, setSelectedCourses] = useState([]);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await fetch('http://localhost:5001/api/courses');
        const data = await response.json();
        setCourses(data);
      } catch (error) {
        console.error('Error fetching courses:', error);
      }
    };
    fetchCourses();
  }, []);

  const handleCourseToggle = (courseId) => {
    setSelectedCourses(prev => 
      prev.includes(courseId)
        ? prev.filter(id => id !== courseId)
        : [...prev, courseId]
    );
  };

  const handleSubmit = async () => {
    try {
      const response = await fetch(`http://localhost:5001/api/students/update-courses/${user.uid}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          courses: selectedCourses.map(id => id.toString()) 
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update courses');
      }

      const data = await response.json();
      if (data.success) {
        navigate('/dashboard');
      }
    } catch (error) {
      console.error('Error saving course preferences:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-8">Select Your Courses</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {courses.map((course) => (
            <div
              key={course._id}
              className={`p-4 rounded-lg cursor-pointer transition-all ${
                selectedCourses.includes(course._id)
                  ? 'bg-blue-100 border-2 border-blue-500'
                  : 'bg-white border-2 border-transparent'
              }`}
              onClick={() => handleCourseToggle(course._id)}
            >
              <h3 className="font-semibold text-lg">{course.title}</h3>
              <p className="text-gray-600">{course.subject}</p>
              <p className="text-sm text-gray-500">{course.duration} minutes</p>
            </div>
          ))}
        </div>
        <button
          onClick={handleSubmit}
          disabled={selectedCourses.length === 0}
          className="mt-8 w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 disabled:bg-gray-400"
        >
          Continue to Dashboard
        </button>
      </div>
    </div>
  );
};

export default CourseSelection; 
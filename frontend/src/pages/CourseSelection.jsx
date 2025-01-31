import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const CourseSelection = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [selectedCourses, setSelectedCourses] = useState([]);

  const availableCourses = [
    { 
      _id: "679ce280b9bc666f6a6e5a25", 
      title: 'Introduction to Algebra', 
      subject: 'Mathematics', 
      duration: '30',
      readings: [
        { _id: "read1", title: "Basic Algebra Concepts", content: "Introduction to basic algebra", completed: false },
        { _id: "read2", title: "Linear Equations", content: "Understanding linear equations", completed: false },
        { _id: "read3", title: "Quadratic Equations", content: "Basics of quadratic equations", completed: false },
        { _id: "read4", title: "Algebraic Expressions", content: "Working with expressions", completed: false }
      ]
    },
    { id: 2, title: 'Basic Chemistry', subject: 'Science', duration: '45' },
    { id: 3, title: 'World History', subject: 'Social Studies', duration: '40' },
    { id: 4, title: 'English Literature', subject: 'Language Arts', duration: '35' }
  ];

  const handleCourseToggle = (courseId) => {
    setSelectedCourses(prev => 
      prev.includes(courseId)
        ? prev.filter(id => id !== courseId)
        : [...prev, courseId]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:5001/api/students/update-courses/${user.uid}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          courses: selectedCourses.map(id => id.toString()),
          readings: availableCourses.reduce((acc, course) => {
            if (selectedCourses.includes(course._id)) {
              acc[course._id] = course.readings;
            }
            return acc;
          }, {})
        }),
      });

      if (response.ok) {
        navigate('/dashboard');
      }
    } catch (error) {
      console.error('Error saving course preferences:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white p-8 rounded-lg shadow">
          <h2 className="text-2xl font-bold mb-6">Select Your Courses</h2>
          <p className="text-gray-600 mb-6">Choose the courses you're interested in:</p>
          
          <div className="space-y-4">
            {availableCourses.map((course) => (
              <div 
                key={course._id || course.id}
                className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                  selectedCourses.includes(course._id || course.id)
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-blue-300'
                }`}
                onClick={() => handleCourseToggle(course._id || course.id)}
              >
                <h3 className="font-semibold">{course.title}</h3>
                <p className="text-sm text-gray-600">{course.subject} | {course.duration} min</p>
              </div>
            ))}
          </div>

          <button
            onClick={handleSubmit}
            disabled={selectedCourses.length === 0}
            className="mt-6 w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-gray-400"
          >
            Continue to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};

export default CourseSelection; 
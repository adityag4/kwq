import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const CourseProgress = () => {
  const { courseId } = useParams();
  const { user } = useAuth();
  const [courseData, setCourseData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCourseProgress = async () => {
      if (!user?.uid || !courseId) {
        setLoading(false);
        return;
      }

      try {
        console.log('Fetching course:', courseId, 'for user:', user.uid);
        const response = await fetch(`http://localhost:5001/api/courses/${courseId}/progress/${user.uid}`);
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to fetch course progress');
        }
        
        const data = await response.json();
        console.log('Received course data:', data);
        setCourseData(data);
      } catch (error) {
        console.error('Error fetching course:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCourseProgress();
  }, [courseId, user?.uid]);

  const markAsRead = async (readingId) => {
    try {
      const response = await fetch(
        `http://localhost:5001/api/courses/${courseId}/readings/${readingId}/complete`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId: user.uid })
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to mark reading as complete');
      }

      const data = await response.json();
      
      setCourseData(prev => {
        if (!prev) return prev;
        
        const updatedReadings = prev.readings.map(reading => 
          reading._id === readingId 
            ? { ...reading, completed: true }
            : reading
        );

        return {
          ...prev,
          progress: data.progress,
          readings: updatedReadings
        };
      });
    } catch (error) {
      console.error('Error marking as read:', error);
      setError(error.message);
    }
  };

  if (loading) return <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>;
  if (error) return <div className="text-red-600">Error: {error}</div>;
  if (!courseData) return <div>No course data found</div>;

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">{courseData.title}</h1>
      
      <div className="mb-8">
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div 
            className="bg-blue-600 h-2.5 rounded-full" 
            style={{ width: `${courseData.progress || 0}%` }}
          ></div>
        </div>
        <p className="mt-2 text-gray-600">{Math.round(courseData.progress || 0)}% Complete</p>
      </div>

      <div className="space-y-4">
        {courseData.readings.map(reading => (
          <div key={reading._id} className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-semibold mb-2">{reading.title}</h3>
            <p className="text-gray-600 mb-4">{reading.content}</p>
            <button
              onClick={() => markAsRead(reading._id)}
              disabled={reading.completed}
              className={`px-4 py-2 rounded-md ${
                reading.completed 
                  ? 'bg-green-500 text-white cursor-not-allowed'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              {reading.completed ? 'Completed ✓' : 'Mark as Complete'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CourseProgress; 
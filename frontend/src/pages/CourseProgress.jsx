import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const CourseProgress = () => {
  const { courseId } = useParams();
  const { user } = useAuth();
  const [course, setCourse] = useState(null);
  const [readings, setReadings] = useState([]);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const response = await fetch(`http://localhost:5001/api/courses/${courseId}/progress/${user.uid}`);
        const data = await response.json();
        setReadings(data.readings);
        setProgress(data.progress);
      } catch (error) {
        console.error('Error:', error);
      }
    };

    fetchProgress();
  }, [courseId, user.uid]);

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
      const data = await response.json();
      setProgress(data.progress);
      
      // Update reading status locally
      setReadings(prev => 
        prev.map(r => r._id === readingId ? { ...r, completed: true } : r)
      );
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h2 className="text-2xl font-bold">{course?.title}</h2>
        <div className="mt-4 w-full bg-gray-200 rounded-full h-2.5">
          <div 
            className="bg-blue-600 h-2.5 rounded-full" 
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        <p className="mt-2 text-gray-600">{progress.toFixed(0)}% Complete</p>
      </div>

      <div className="space-y-4">
        {readings.map(reading => (
          <div key={reading._id} className="bg-white p-4 rounded-lg shadow">
            <h3 className="font-semibold">{reading.title}</h3>
            <p className="text-gray-600 mt-2">{reading.content}</p>
            <button
              onClick={() => markAsRead(reading._id)}
              disabled={reading.completed}
              className={`mt-4 px-4 py-2 rounded ${
                reading.completed 
                  ? 'bg-green-500 text-white cursor-not-allowed'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              {reading.completed ? 'Completed' : 'Mark as Read'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CourseProgress; 
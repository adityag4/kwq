import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const ReadingView = () => {
  const { courseId, readingId } = useParams();
  const { user } = useAuth();
  const [reading, setReading] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReading = async () => {
      try {
        setLoading(true);
        const response = await fetch(`http://localhost:5001/api/courses/${courseId}/readings/${readingId}`);
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to fetch reading');
        }
        const data = await response.json();
        
        if (!data.content) {
          // Generate content if it doesn't exist
          await generateAndSaveContent(data.title, data.courseName);
        } else {
          setReading(data);
        }
      } catch (error) {
        console.error('Error:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchReading();
  }, [courseId, readingId]);

  const generateAndSaveContent = async (title, courseName) => {
    try {
      const generateResponse = await fetch('http://localhost:5001/api/readings/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, courseName })
      });

      if (!generateResponse.ok) {
        const errorData = await generateResponse.json();
        throw new Error(errorData.error || 'Failed to generate content');
      }

      const { content } = await generateResponse.json();

      // Save the generated content
      const saveResponse = await fetch(
        `http://localhost:5001/api/courses/${courseId}/readings/${readingId}/content`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ content })
        }
      );

      if (!saveResponse.ok) {
        throw new Error('Failed to save content');
      }

      // Fetch the updated reading
      const updatedResponse = await fetch(`http://localhost:5001/api/courses/${courseId}/readings/${readingId}`);
      const updatedData = await updatedResponse.json();
      setReading(updatedData);
    } catch (error) {
      console.error('Error generating/saving content:', error);
      setError(error.message);
    }
  };

  const markAsComplete = async () => {
    try {
      const response = await fetch(
        `http://localhost:5001/api/courses/${courseId}/readings/${readingId}/complete`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId: user.uid })
        }
      );
      if (!response.ok) throw new Error('Failed to mark reading as complete');
    } catch (error) {
      setError(error.message);
    }
  };

  if (loading) return <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>;
  if (error) return <div className="text-red-600">Error: {error}</div>;
  if (!reading) return <div>No reading found</div>;

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">{reading.title}</h1>
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="prose prose-lg max-w-none">
          {reading.content ? (
            <div 
              dangerouslySetInnerHTML={{ __html: reading.content }} 
              className="space-y-6 prose-headings:font-bold prose-h1:text-3xl prose-h2:text-2xl prose-p:text-gray-600 prose-ul:list-disc prose-ul:pl-5"
            />
          ) : (
            <div className="animate-pulse space-y-4">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-full"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6"></div>
            </div>
          )}
          <button
            onClick={markAsComplete}
            className="mt-8 px-6 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
          >
            Mark as Complete
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReadingView; 
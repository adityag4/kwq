import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const ReadingView = () => {
  const { courseId, readingId } = useParams();
  const { user } = useAuth();
  const [reading, setReading] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [generatedContent, setGeneratedContent] = useState(null);

  useEffect(() => {
    const fetchReading = async () => {
      try {
        console.log('Fetching course:', courseId);
        const courseResponse = await fetch(`http://localhost:5001/api/courses/${courseId}`);
        if (!courseResponse.ok) {
          const errorData = await courseResponse.json();
          throw new Error(errorData.message || 'Failed to fetch course');
        }
        const courseData = await courseResponse.json();
        console.log('Course data:', courseData);

        console.log('Fetching reading:', readingId);
        const readingResponse = await fetch(`http://localhost:5001/api/courses/${courseId}/readings/${readingId}`);
        if (!readingResponse.ok) {
          const errorData = await readingResponse.json();
          throw new Error(errorData.message || 'Failed to fetch reading');
        }
        const readingData = await readingResponse.json();
        console.log('Reading data:', readingData);
        setReading(readingData);
        
        if (!readingData.content) {
          console.log('No content found, generating...');
          await generateContent(readingData.title, courseData.title);
        } else {
          console.log('Using existing content');
          setGeneratedContent(readingData.content);
        }
      } catch (error) {
        console.error('Error in fetchReading:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchReading();
  }, [courseId, readingId]);

  const generateContent = async (title, courseName) => {
    try {
      console.log('Generating content for:', { title, courseName });
      const response = await fetch('http://localhost:5001/api/readings/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, courseName })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        console.error('Generation error:', errorData);
        throw new Error(errorData.error || 'Failed to generate content');
      }
      const data = await response.json();
      console.log('Generated content (raw):', data.content);
      setGeneratedContent(data.content);
      
      await saveGeneratedContent(data.content);
    } catch (error) {
      console.error('Error in generateContent:', error);
      setError('Failed to generate content');
    }
  };

  const saveGeneratedContent = async (content) => {
    try {
      await fetch(`http://localhost:5001/api/courses/${courseId}/readings/${readingId}/content`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content })
      });
    } catch (error) {
      console.error('Error saving content:', error);
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
          {generatedContent ? (
            <div 
              dangerouslySetInnerHTML={{ __html: generatedContent }} 
              className="space-y-6 prose-headings:font-bold prose-h1:text-3xl prose-h2:text-2xl prose-p:text-gray-600 prose-ul:list-disc prose-ul:pl-5"
            />
          ) : (
            <div className="animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-full mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6"></div>
            </div>
          )}
        </div>
        <button
          onClick={() => markAsComplete()}
          className="mt-8 px-6 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
        >
          Mark as Complete
        </button>
      </div>
    </div>
  );
};

export default ReadingView; 
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const LessonView = () => {
  const { courseId, lessonId } = useParams();
  const { user } = useAuth();
  const [lesson, setLesson] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [generatedContent, setGeneratedContent] = useState(null);

  useEffect(() => {
    const fetchLesson = async () => {
      try {
        const response = await fetch(`http://localhost:5001/api/courses/${courseId}/lessons/${lessonId}`);
        if (!response.ok) throw new Error('Failed to fetch lesson');
        const data = await response.json();
        setLesson(data);
        
        // Generate content if not already present
        if (!data.content) {
          await generateLessonContent(data.title, data.subject);
        } else {
          setGeneratedContent(data.content);
        }
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchLesson();
  }, [courseId, lessonId]);

  const generateLessonContent = async (title, subject) => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:5001/api/lessons/generate', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer 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`
        },
        body: JSON.stringify({ 
          title, 
          subject,
          model: "gpt-3.5-turbo",
          store: true
        })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate content');
      }

      const data = await response.json();
      setGeneratedContent(data.content);
      
      // Save the generated content
      await saveGeneratedContent(data.content);
    } catch (error) {
      setError('Failed to generate lesson content: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const saveGeneratedContent = async (content) => {
    try {
      const response = await fetch(
        `http://localhost:5001/api/courses/${courseId}/lessons/${lessonId}/content`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ content })
        }
      );

      if (!response.ok) {
        throw new Error('Failed to save generated content');
      }
    } catch (error) {
      console.error('Error saving content:', error);
      // Don't set error state here as we already have the content
    }
  };

  const markAsComplete = async () => {
    try {
      const response = await fetch(
        `http://localhost:5001/api/courses/${courseId}/lessons/${lessonId}/complete`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId: user.uid })
        }
      );

      if (!response.ok) throw new Error('Failed to mark lesson as complete');
    } catch (error) {
      setError(error.message);
    }
  };

  if (loading) return <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>;
  if (error) return <div className="text-red-600">Error: {error}</div>;
  if (!lesson) return <div>No lesson found</div>;

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">{lesson.title}</h1>
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="prose max-w-none">
          {generatedContent ? (
            <div dangerouslySetInnerHTML={{ __html: generatedContent }} />
          ) : (
            <div className="animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-full mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6"></div>
            </div>
          )}
        </div>
        <button
          onClick={markAsComplete}
          className="mt-8 px-6 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
        >
          Mark as Complete
        </button>
      </div>
    </div>
  );
};

export default LessonView;
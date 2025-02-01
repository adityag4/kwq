import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { generateLessonContent } from '../utils/gptHelper';
import DOMPurify from 'dompurify';
import marked from 'marked';

const LessonView = () => {
  const { courseId, lessonId } = useParams();
  const { user } = useAuth();
  const [lesson, setLesson] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [generatedContent, setGeneratedContent] = useState('');

  useEffect(() => {
    const fetchLesson = async () => {
      try {
        setLoading(true);
        const response = await fetch(`http://localhost:5001/api/courses/${courseId}/lessons/${lessonId}`);
        if (!response.ok) throw new Error('Failed to fetch lesson');
        const data = await response.json();
        setLesson(data);
        
        // Generate content if not already cached
        if (!data.generatedContent) {
          const content = await generateLessonContent(data);
          if (content) {
            // Convert markdown to HTML and sanitize
            const htmlContent = DOMPurify.sanitize(marked(content));
            setGeneratedContent(htmlContent);
            
            // Cache the generated content
            await fetch(`http://localhost:5001/api/lessons/${lessonId}/content`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ content: htmlContent })
            });
          }
        } else {
          setGeneratedContent(data.generatedContent);
        }
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchLesson();
  }, [courseId, lessonId]);

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

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) return <div className="p-8 text-red-600">Error: {error}</div>;
  if (!lesson) return <div className="p-8">No lesson found</div>;

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">{lesson.title}</h1>
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="prose max-w-none">
          {generatedContent ? (
            <div dangerouslySetInnerHTML={{ __html: generatedContent }} />
          ) : (
            <div className="animate-pulse space-y-4">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-full"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6"></div>
            </div>
          )}
        </div>
        <div className="mt-8 flex justify-between items-center">
          <button
            onClick={markAsComplete}
            className="px-6 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 
            transition-colors disabled:opacity-50"
            disabled={lesson.completed}
          >
            {lesson.completed ? 'Completed ✓' : 'Mark as Complete'}
          </button>
          <span className="text-gray-500">
            <span className="font-medium">{lesson.duration}</span> minutes
          </span>
        </div>
      </div>
    </div>
  );
};

export default LessonView;
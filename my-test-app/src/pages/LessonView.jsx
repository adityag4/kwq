import React from 'react';
import { useParams } from 'react-router-dom';

const LessonView = () => {
  const { lessonId } = useParams();
  
  // This would typically come from an API
  const lessonContent = {
    title: "Introduction to Algebra",
    chapters: [
      {
        id: 1,
        title: "Basic Expressions",
        content: "Algebraic expressions are combinations of variables and constants...",
        videoUrl: "https://example.com/video1"
      },
      {
        id: 2,
        title: "Solving Equations",
        content: "An equation is a statement that two expressions are equal...",
        videoUrl: "https://example.com/video2"
      }
    ]
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">{lessonContent.title}</h1>
        <div className="space-y-6">
          {lessonContent.chapters.map((chapter) => (
            <div key={chapter.id} className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4">{chapter.title}</h2>
              <p className="text-gray-600 mb-4">{chapter.content}</p>
              <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
                Watch Video
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LessonView;
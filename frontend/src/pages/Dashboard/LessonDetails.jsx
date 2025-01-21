import React from "react";
import { useParams } from "react-router-dom";
import Header from "../Header"; // Import the Header component

const LessonDetails = () => {
  const { lessonId } = useParams();

  return (
    <>
      <Header /> {/* Add the Header at the top */}
      <div className="min-h-screen bg-gray-100 p-8">
        <h1 className="text-3xl font-bold text-blue-600 mb-6">Lesson Details</h1>
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold mb-4">Lesson ID: {lessonId}</h2>
          <p className="text-gray-700">
            Detailed information about the lesson will go here. For now, this is a placeholder for
            lesson ID <strong>{lessonId}</strong>.
          </p>
        </div>
      </div>
    </>
  );
};

export default LessonDetails;
import React from "react";
import Header from "../Header"; // Import the Header component

const Downloads = () => {
  return (
    <>
      <Header /> {/* Add the Header at the top */}
      <div className="min-h-screen bg-gray-100 p-8">
        <h1 className="text-3xl font-bold text-purple-600 mb-6">Downloads</h1>
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold mb-4">Downloaded Lessons</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li className="text-gray-700">Introduction to Algebra</li>
            <li className="text-gray-700">Basic Chemistry</li>
            <li className="text-gray-700">World History</li>
          </ul>
          <p className="text-gray-500 mt-4">All your downloads are stored here.</p>
        </div>
      </div>
    </>
  );
};

export default Downloads;

import React from "react";
import Header from "../Header"; // Import the Header component

const StudyTime = () => {
  return (
    <>
      <Header /> {/* Add the Header at the top */}
      <div className="min-h-screen bg-gray-100 p-8">
        <h1 className="text-3xl font-bold text-green-500 mb-6">Study Time</h1>
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold mb-4">This Week</h2>
          <p className="text-gray-700">
            You’ve studied <strong>12 hours</strong> this week.
          </p>
          <h2 className="text-2xl font-bold mt-6 mb-4">This Month</h2>
          <p className="text-gray-700">
            Total study time: <strong>50 hours</strong>.
          </p>
        </div>
      </div>
    </>
  );
};

export default StudyTime;
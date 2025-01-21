import React from "react";
import Header from "../Header";

const Progress = () => {
  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-100 p-8">
        <h1 className="text-3xl font-bold text-blue-600 mb-6">Progress Details</h1>
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold mb-4">Your Progress</h2>
          <p className="text-gray-700 mb-4">
            You’ve completed <strong>12</strong> out of <strong>20</strong> lessons.
          </p>
          <div className="w-full bg-gray-200 rounded-full h-6">
            <div
              className="bg-blue-600 h-6 rounded-full text-center text-white text-sm"
              style={{ width: "60%" }}
            >
              60%
            </div>
          </div>
          <p className="text-gray-500 mt-4">Keep up the great work!</p>
        </div>
      </div>
    </>
  );
};

export default Progress;
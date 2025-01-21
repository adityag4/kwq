import React from "react";
import Header from "../Header";

const Achievements = () => {
  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-100 p-8">
        <h1 className="text-3xl font-bold text-yellow-500 mb-6">Achievements</h1>
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold mb-4">Badges Earned</h2>
          <ul className="space-y-4">
            <li className="flex items-center gap-4">
              <div className="bg-yellow-500 text-white rounded-full w-12 h-12 flex items-center justify-center text-lg">
                🏅
              </div>
              <p className="text-gray-700">
                <strong>Math Whiz:</strong> Completed 10 math lessons.
              </p>
            </li>
            <li className="flex items-center gap-4">
              <div className="bg-yellow-500 text-white rounded-full w-12 h-12 flex items-center justify-center text-lg">
                📘
              </div>
              <p className="text-gray-700">
                <strong>Bookworm:</strong> Completed 5 science lessons.
              </p>
            </li>
          </ul>
        </div>
      </div>
    </>
  );
};

export default Achievements;

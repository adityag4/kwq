import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const UserSelection = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleStudentClick = () => {
    // Simulate a login for now
    login({
      uid: 'test-uid',
      email: 'test@example.com',
      name: 'Test User'
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900">Welcome to LearnBridge</h2>
          <p className="mt-2 text-gray-600">Choose your role to get started</p>
        </div>
        <div className="space-y-4">
          <button
            onClick={handleStudentClick}
            className="w-full flex items-center justify-center px-4 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
          >
            I'm a Student
          </button>
          <button
            onClick={() => navigate('/register/institution')}
            className="w-full flex items-center justify-center px-4 py-3 border border-transparent text-base font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
          >
            I'm an Institution
          </button>
          <button
            onClick={() => navigate('/register/donor')}
            className="w-full flex items-center justify-center px-4 py-3 border border-transparent text-base font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700"
          >
            I'm a Donor
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserSelection;
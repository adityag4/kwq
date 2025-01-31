import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const NicknameSelection = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [nickname, setNickname] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:5001/api/students/update-nickname/${user.uid}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ nickname }),
      });

      if (response.ok) {
        navigate('/course-selection');
      }
    } catch (error) {
      console.error('Error saving nickname:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-6">Choose Your Nickname</h2>
        <p className="text-gray-600 mb-6">This is how you'll be known in the platform</p>
        
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            placeholder="Enter your nickname"
            className="w-full p-2 border rounded-md mb-4"
            required
          />
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
          >
            Continue
          </button>
        </form>
      </div>
    </div>
  );
};

export default NicknameSelection; 
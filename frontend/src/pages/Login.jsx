import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { getAuth, signOut } from 'firebase/auth';

const Login = () => {
  const { signInWithGoogle } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState('');

  const handleSignOut = async () => {
    const auth = getAuth();
    try {
      await signOut(auth);
      localStorage.clear();
      sessionStorage.clear();
      window.location.reload();
    } catch (error) {
      console.error('Error signing out:', error);
      setError(error.message);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      setError('');
      await signInWithGoogle();
    } catch (error) {
      console.error('Error signing in:', error);
      setError(error.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Student Login</h2>
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
        <button
          onClick={handleGoogleSignIn}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
        >
          Sign in with Google
        </button>
        <button
          onClick={handleSignOut}
          className="w-full bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 mt-4"
        >
          Sign Out & Clear Data
        </button>
      </div>
    </div>
  );
};

export default Login; 
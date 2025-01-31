import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth } from '../firebase';

const UserSelection = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const checkBackend = async () => {
      try {
        const response = await fetch('http://localhost:5001/api/health');
        if (!response.ok) {
          console.error('Backend health check failed');
        } else {
          console.log('Backend is accessible');
        }
      } catch (error) {
        console.error('Backend is not accessible:', error);
      }
    };
    
    checkBackend();
  }, []);

  const handleStudentLogin = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('Starting Google sign in...');
      
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      console.log('Google sign in successful:', result.user.email);

      // Send user data to backend
      const response = await fetch('http://localhost:5001/api/students/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          uid: result.user.uid,
          email: result.user.email,
          name: result.user.displayName,
          photoURL: result.user.photoURL
        })
      });

      if (!response.ok) {
        throw new Error(`Backend auth failed: ${response.status}`);
      }

      const data = await response.json();
      console.log('Backend auth successful:', data);
      
      login(result.user);
      navigate(data.isFirstLogin ? '/onboarding' : '/dashboard');
    } catch (error) {
      console.error('Login error:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-2xl font-bold text-center mb-6">Welcome to Learning Platform</h1>
        
        {error && (
          <div className="mb-4 p-4 bg-red-50 text-red-600 rounded-md">
            {error}
          </div>
        )}

        <button
          onClick={handleStudentLogin}
          disabled={loading}
          className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? 'Signing in...' : 'Sign in with Google'}
        </button>
      </div>
    </div>
  );
};

export default UserSelection;
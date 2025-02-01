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
  const [showTokenLogin, setShowTokenLogin] = useState(false);
  const [tokenLoginData, setTokenLoginData] = useState({
    email: '',
    token: ''
  });

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

  const handleTokenLogin = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('http://localhost:5001/api/students/auth-token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(tokenLoginData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Login failed');
      }

      // Create a simplified user object for auth context
      const user = {
        uid: data.student.uid,
        email: data.student.email,
        displayName: data.student.name,
        photoURL: data.student.photoURL,
        accessToken: tokenLoginData.token
      };

      login(user);
      navigate(data.isFirstLogin ? '/onboarding' : '/dashboard');
    } catch (error) {
      console.error('Token login error:', error);
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="max-w-md w-full mx-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 transform transition-all hover:shadow-2xl">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Welcome to LearnBridge</h1>
            <p className="text-gray-600">Your gateway to seamless learning</p>
          </div>
          
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 rounded-lg flex items-center">
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" />
              </svg>
              {error}
            </div>
          )}

          {!showTokenLogin ? (
            <div className="space-y-4">
              <button
                onClick={handleStudentLogin}
                disabled={loading}
                className="w-full bg-blue-600 text-white py-4 px-6 rounded-xl hover:bg-blue-700 disabled:opacity-50 
                transform transition-all hover:-translate-y-0.5 flex items-center justify-center space-x-2"
              >
                <svg className="w-6 h-6" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z"/>
                </svg>
                <span>{loading ? 'Signing in...' : 'Continue with Google'}</span>
              </button>

              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white text-gray-500">Or</span>
                </div>
              </div>

              <button
                onClick={() => setShowTokenLogin(true)}
                className="w-full bg-white text-gray-700 py-4 px-6 rounded-xl border-2 border-gray-200 
                hover:border-blue-400 hover:bg-blue-50 transition-all flex items-center justify-center space-x-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                </svg>
                <span>Sign in with Access Token</span>
              </button>
            </div>
          ) : (
            <form onSubmit={handleTokenLogin} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                <input
                  type="email"
                  value={tokenLoginData.email}
                  onChange={(e) => setTokenLoginData(prev => ({ ...prev, email: e.target.value }))}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 
                  focus:border-blue-500 transition-all"
                  placeholder="Enter your email"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Access Token</label>
                <input
                  type="text"
                  value={tokenLoginData.token}
                  onChange={(e) => setTokenLoginData(prev => ({ ...prev, token: e.target.value }))}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 
                  focus:border-blue-500 transition-all"
                  placeholder="Enter your 10-digit token"
                  required
                />
              </div>

              <div className="space-y-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-blue-600 text-white py-4 px-6 rounded-xl hover:bg-blue-700 
                  disabled:opacity-50 transform transition-all hover:-translate-y-0.5"
                >
                  {loading ? 'Signing in...' : 'Sign In'}
                </button>

                <button
                  type="button"
                  onClick={() => setShowTokenLogin(false)}
                  className="w-full bg-gray-100 text-gray-700 py-4 px-6 rounded-xl hover:bg-gray-200 
                  transition-all"
                >
                  Back to Options
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserSelection;
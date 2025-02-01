import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const StudentOnboarding = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [courses, setCourses] = useState([]);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    nickname: '',
    phone: '',
    selectedCourses: []
  });

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:5001/api/courses');
        if (!response.ok) throw new Error('Failed to fetch courses');
        const data = await response.json();
        setCourses(data);
      } catch (error) {
        console.error('Error fetching courses:', error);
        setErrors(prev => ({ ...prev, fetch: 'Failed to load courses' }));
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  const validateStep1 = async () => {
    const newErrors = {};
    
    if (!formData.nickname.trim()) {
      newErrors.nickname = 'Nickname is required';
    }
    
    if (!formData.phone.trim()) {
      newErrors.phone = 'Offline access token is required';
    } else if (!/^\d{10}$/.test(formData.phone.trim())) {
      newErrors.phone = 'Please enter a valid 10-digit access token';
    } else {
      try {
        const response = await fetch('http://localhost:5001/api/students/check-token', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token: formData.phone }),
        });
        
        if (!response.ok) {
          const data = await response.json();
          newErrors.phone = data.error || 'This access token is already in use';
        }
      } catch (error) {
        newErrors.phone = 'Error validating access token';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNextStep = async () => {
    const isValid = await validateStep1();
    if (isValid) {
      setStep(2);
    }
  };

  const handleCourseToggle = (courseId) => {
    setFormData(prev => ({
      ...prev,
      selectedCourses: prev.selectedCourses.includes(courseId)
        ? prev.selectedCourses.filter(id => id !== courseId)
        : [...prev.selectedCourses, courseId]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.selectedCourses.length === 0) {
      setErrors({ courses: 'Please select at least one course' });
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`http://localhost:5001/api/students/complete-onboarding/${user.uid}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        navigate('/dashboard');
      } else {
        const data = await response.json();
        setErrors({ submit: data.message || 'Something went wrong' });
      }
    } catch (error) {
      setErrors({ submit: 'Network error occurred' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="flex items-center mb-8">
            <div className="w-full">
              <div className="flex justify-between items-center mb-4">
                <h1 className="text-3xl font-bold text-gray-800">Complete Your Profile</h1>
                <div className="flex items-center space-x-2">
                  <span className={`w-3 h-3 rounded-full ${step === 1 ? 'bg-blue-600' : 'bg-gray-300'}`}></span>
                  <span className={`w-3 h-3 rounded-full ${step === 2 ? 'bg-blue-600' : 'bg-gray-300'}`}></span>
                </div>
              </div>
              <p className="text-gray-600">Step {step} of 2</p>
            </div>
          </div>

          {step === 1 ? (
            <div className="space-y-6">
              <div className="transform transition-all">
                <label className="block text-sm font-medium text-gray-700 mb-1">Nickname</label>
                <input
                  type="text"
                  value={formData.nickname}
                  onChange={(e) => {
                    setFormData(prev => ({ ...prev, nickname: e.target.value }));
                    setErrors(prev => ({ ...prev, nickname: '' }));
                  }}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 
                  focus:border-blue-500 transition-all"
                  placeholder="Choose a nickname"
                />
                {errors.nickname && (
                  <p className="mt-2 text-sm text-red-600 flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    {errors.nickname}
                  </p>
                )}
              </div>

              <div className="transform transition-all">
                <label className="block text-sm font-medium text-gray-700 mb-1">Offline Access Token</label>
                <input
                  type="text"
                  value={formData.phone}
                  onChange={(e) => {
                    setFormData(prev => ({ ...prev, phone: e.target.value }));
                    setErrors(prev => ({ ...prev, phone: '' }));
                  }}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 
                  focus:border-blue-500 transition-all"
                  placeholder="Enter your 10-digit access token"
                  required
                />
                {errors.phone && (
                  <p className="mt-2 text-sm text-red-600 flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    {errors.phone}
                  </p>
                )}
                <p className="mt-1 text-sm text-gray-500">This token will be used for offline access to the platform</p>
              </div>

              <button
                onClick={handleNextStep}
                className="w-full bg-blue-600 text-white py-4 px-6 rounded-xl hover:bg-blue-700 
                disabled:opacity-50 transform transition-all hover:-translate-y-0.5"
              >
                Continue to Course Selection
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {courses.map((course) => (
                  <div
                    key={course._id}
                    onClick={() => handleCourseToggle(course._id)}
                    className={`p-6 rounded-xl border-2 cursor-pointer transform transition-all hover:-translate-y-1 
                    ${formData.selectedCourses.includes(course._id)
                      ? 'border-blue-500 bg-blue-50 shadow-md'
                      : 'border-gray-200 hover:border-blue-300'}`}
                  >
                    <h3 className="font-semibold text-lg mb-2">{course.title}</h3>
                    <div className="flex items-center text-sm text-gray-600">
                      <span className="mr-3">{course.subject}</span>
                      <span>•</span>
                      <span className="ml-3">{course.duration} min</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex space-x-4 mt-8">
                <button
                  onClick={() => setStep(1)}
                  className="w-1/2 bg-gray-100 text-gray-700 py-4 px-6 rounded-xl hover:bg-gray-200 
                  transition-all"
                >
                  Back
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={loading || formData.selectedCourses.length === 0}
                  className="w-1/2 bg-blue-600 text-white py-4 px-6 rounded-xl hover:bg-blue-700 
                  disabled:opacity-50 transform transition-all hover:-translate-y-0.5"
                >
                  {loading ? 'Setting up...' : 'Complete Setup'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentOnboarding; 
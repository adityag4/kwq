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

  const validateStep1 = () => {
    const newErrors = {};
    if (!formData.nickname.trim()) {
      newErrors.nickname = 'Nickname is required';
    }
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^\d{10}$/.test(formData.phone.trim())) {
      newErrors.phone = 'Please enter a valid 10-digit phone number';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNextStep = () => {
    if (validateStep1()) {
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
    <div className="min-h-screen bg-gray-100 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white p-8 rounded-lg shadow">
          {/* Progress indicator */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div className={`h-2 w-2 rounded-full ${step === 1 ? 'bg-blue-600' : 'bg-gray-300'}`} />
              <div className={`h-2 flex-1 mx-2 ${step === 2 ? 'bg-blue-600' : 'bg-gray-300'}`} />
              <div className={`h-2 w-2 rounded-full ${step === 2 ? 'bg-blue-600' : 'bg-gray-300'}`} />
            </div>
            <div className="flex justify-between mt-2">
              <span className="text-sm text-gray-600">Personal Details</span>
              <span className="text-sm text-gray-600">Course Selection</span>
            </div>
          </div>

          {step === 1 ? (
            <>
              <h2 className="text-2xl font-bold mb-6">Personal Details</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Nickname</label>
                  <input
                    type="text"
                    value={formData.nickname}
                    onChange={(e) => {
                      setFormData(prev => ({ ...prev, nickname: e.target.value }));
                      setErrors(prev => ({ ...prev, nickname: '' }));
                    }}
                    className={`mt-1 block w-full rounded-md shadow-sm ${
                      errors.nickname ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.nickname && <p className="mt-1 text-sm text-red-500">{errors.nickname}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Phone Number</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => {
                      setFormData(prev => ({ ...prev, phone: e.target.value }));
                      setErrors(prev => ({ ...prev, phone: '' }));
                    }}
                    className={`mt-1 block w-full rounded-md shadow-sm ${
                      errors.phone ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.phone && <p className="mt-1 text-sm text-red-500">{errors.phone}</p>}
                </div>
                <button
                  onClick={handleNextStep}
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </>
          ) : (
            <>
              <h2 className="text-2xl font-bold mb-6">Select Your Courses</h2>
              {errors.courses && <p className="mb-4 text-sm text-red-500">{errors.courses}</p>}
              <div className="space-y-4">
                {courses.map((course) => (
                  <div
                    key={course._id}
                    onClick={() => handleCourseToggle(course._id)}
                    className={`p-4 border rounded-lg cursor-pointer transition-all ${
                      formData.selectedCourses.includes(course._id)
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-blue-300'
                    }`}
                  >
                    <h3 className="font-semibold">{course.title}</h3>
                    <p className="text-sm text-gray-600">{course.subject} | {course.duration} min</p>
                  </div>
                ))}
              </div>
              {errors.submit && <p className="mt-4 text-sm text-red-500">{errors.submit}</p>}
              <div className="mt-6 flex gap-4">
                <button
                  onClick={() => setStep(1)}
                  className="w-1/2 bg-gray-200 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-300"
                  disabled={loading}
                >
                  Back
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={loading || formData.selectedCourses.length === 0}
                  className="w-1/2 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50"
                >
                  {loading ? 'Setting up...' : 'Complete Setup'}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentOnboarding; 
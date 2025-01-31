import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import UserSelection from "./pages/UserSelection";
import StudentRegistration from "./pages/StudentRegistration";
import NicknameSelection from './pages/NicknameSelection';
import CourseSelection from './pages/CourseSelection';
import Dashboard from "./pages/Dashboard";
import Progress from "./pages/Dashboard/Progress";
import Achievements from "./pages/Dashboard/Achievements";
import StudyTime from "./pages/Dashboard/StudyTime";
import Downloads from "./pages/Dashboard/Downloads";
import Settings from "./pages/Dashboard/Settings";
import LessonDetails from "./pages/Dashboard/LessonDetails";
import Login from './pages/Login';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import { getAuth, signOut } from 'firebase/auth';

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="min-h-screen bg-gray-100">
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<StudentRegistration />} />
            <Route path="/register/student" element={<StudentRegistration />} />
            <Route path="/nickname-selection" element={<NicknameSelection />} />
            <Route path="/course-selection" element={<CourseSelection />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/dashboard/progress" element={<Progress />} />
            <Route path="/dashboard/achievements" element={<Achievements />} />
            <Route path="/dashboard/study-time" element={<StudyTime />} />
            <Route path="/dashboard/downloads" element={<Downloads />} />
            <Route path="/dashboard/lesson/:lessonId" element={<LessonDetails />} />
            <Route path="/dashboard/settings" element={<Settings />} />
          </Routes>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
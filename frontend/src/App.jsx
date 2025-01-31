import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from './contexts/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import UserSelection from "./pages/UserSelection";
import StudentOnboarding from './pages/StudentOnboarding';
import Dashboard from "./pages/Dashboard";
import Progress from "./pages/Progress";
import CourseProgress from './pages/CourseProgress';
import Login from './pages/Login';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<UserSelection />} />
          <Route path="/onboarding" element={
            <PrivateRoute>
              <StudentOnboarding />
            </PrivateRoute>
          } />
          <Route path="/dashboard" element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          } />
          <Route path="/dashboard/progress" element={
            <PrivateRoute>
              <Progress />
            </PrivateRoute>
          } />
          <Route path="/course/:courseId" element={
            <PrivateRoute>
              <CourseProgress />
            </PrivateRoute>
          } />
          <Route path="/" element={<Navigate to="/dashboard" />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
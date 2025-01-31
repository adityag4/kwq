import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from './contexts/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import UserSelection from "./pages/UserSelection";
import StudentOnboarding from './pages/StudentOnboarding';
import Dashboard from "./pages/Dashboard";
import Progress from "./pages/Progress";
import CourseProgress from './pages/CourseProgress';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
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
          <Route path="/dashboard/course/:courseId" element={
            <PrivateRoute>
              <CourseProgress />
            </PrivateRoute>
          } />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
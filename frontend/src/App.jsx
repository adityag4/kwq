import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import UserSelection from "./pages/UserSelection";
import StudentRegistration from "./pages/StudentRegistration";
import InstitutionRegistration from './pages/InstitutionRegistration';
import DonorRegistration from './pages/DonorRegistration';;
import LessonView from './pages/LessonView';
import Dashboard from "./pages/Dashboard";
import Progress from "./pages/Dashboard/Progress";
import Achievements from "./pages/Dashboard/Achievements";
import StudyTime from "./pages/Dashboard/StudyTime";
import Downloads from "./pages/Dashboard/Downloads";
import Settings from "./pages/Dashboard/Settings";
import LessonDetails from "./pages/Dashboard/LessonDetails";


function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <Routes>
          <Route path="/" element={<UserSelection />} />
          <Route path="/register/student" element={<StudentRegistration />} />
          <Route path="/register/donor" element={<DonorRegistration />} />
          <Route path="/register/institution" element={<InstitutionRegistration />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/lesson/:lessonId" element={<LessonView />} />
          <Route path="/dashboard/progress" element={<Progress />} />
        <Route path="/dashboard/achievements" element={<Achievements />} />
        <Route path="/dashboard/study-time" element={<StudyTime />} />
        <Route path="/dashboard/downloads" element={<Downloads />} />
        <Route path="/dashboard/lesson/:lessonId" element={<LessonDetails />} />
        <Route path="/dashboard/settings" element={<Settings />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
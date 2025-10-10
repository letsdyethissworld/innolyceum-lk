import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Layout from './components/layout/Layout';
import Login from './pages/Login';
import Register from './pages/Register';
import ApplicantDashboard from './pages/applicant/Dashboard';
import Profile from './pages/applicant/Profile';
import Documents from './pages/applicant/Documents';
import Status from './pages/applicant/Status';
import './styles/globals.css';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* Applicant Routes */}
          <Route path="/applicant" element={<Layout><ApplicantDashboard /></Layout>} />
          <Route path="/applicant/profile" element={<Layout><Profile /></Layout>} />
          <Route path="/applicant/documents" element={<Layout><Documents /></Layout>} />
          <Route path="/applicant/status" element={<Layout><Status /></Layout>} />
          
          <Route path="/" element={<Login />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
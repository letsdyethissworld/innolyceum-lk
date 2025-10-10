import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Layout from './components/layout/Layout';
import AdminLayout from './components/admin/AdminLayout';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminRequests from './pages/admin/AdminRequests';
import AdminRequestDetail from './pages/admin/AdminRequestDetail';
import AdminFiles from './pages/admin/AdminFiles';
import ApplicantDashboard from './pages/applicant/Dashboard';
import Profile from './pages/applicant/Profile';
import DocumentUpload from './components/documentupload/DocumentUpload';
import Status from './pages/applicant/Status';
import ProtectedRoute from './components/protectedroute/ProtectedRoute';
import ApplicantRoute from './components/applicantroute/ApplicantRoute';
import AdminRoute from './components/AdminRoute';
import './styles/globals.css';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          
          {/* Applicant routes */}
          <Route path="/applicant" element={
            <ProtectedRoute>
              <ApplicantRoute>
                <Layout><ApplicantDashboard /></Layout>
              </ApplicantRoute>
            </ProtectedRoute>
          } />
          <Route path="/applicant/profile" element={
            <ProtectedRoute>
              <ApplicantRoute>
                <Layout><Profile /></Layout>
              </ApplicantRoute>
            </ProtectedRoute>
          } />
          <Route path="/applicant/documents" element={
            <ProtectedRoute>
              <ApplicantRoute>
                <Layout><DocumentUpload /></Layout>
              </ApplicantRoute>
            </ProtectedRoute>
          } />
          <Route path="/applicant/status" element={
            <ProtectedRoute>
              <ApplicantRoute>
                <Layout><Status /></Layout>
              </ApplicantRoute>
            </ProtectedRoute>
          } />
          
          {/* Admin routes */}
          <Route path="/admin" element={
            <ProtectedRoute>
              <AdminRoute>
                <AdminLayout><AdminDashboard /></AdminLayout>
              </AdminRoute>
            </ProtectedRoute>
          } />
          <Route path="/admin/requests" element={
            <ProtectedRoute>
              <AdminRoute>
                <AdminLayout><AdminRequests /></AdminLayout>
              </AdminRoute>
            </ProtectedRoute>
          } />
          <Route path="/admin/requests/:id" element={
            <ProtectedRoute>
              <AdminRoute>
                <AdminLayout><AdminRequestDetail /></AdminLayout>
              </AdminRoute>
            </ProtectedRoute>
          } />
          <Route path="/admin/files" element={
            <ProtectedRoute>
              <AdminRoute>
                <AdminLayout><AdminFiles /></AdminLayout>
              </AdminRoute>
            </ProtectedRoute>
          } />
          
          {/* Redirects */}
          <Route path="/" element={<Navigate to="/applicant" replace />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
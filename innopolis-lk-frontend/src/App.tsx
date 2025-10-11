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
import AdminRoute from './components/AdminRoute'; // Новый импорт
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
              <Layout><ApplicantDashboard /></Layout>
            </ProtectedRoute>
          } />
          <Route path="/applicant/profile" element={
            <ProtectedRoute>
              <Layout><Profile /></Layout>
            </ProtectedRoute>
          } />
          <Route path="/applicant/documents" element={
            <ProtectedRoute>
              <Layout><DocumentUpload /></Layout>
            </ProtectedRoute>
          } />
          <Route path="/applicant/status" element={
            <ProtectedRoute>
              <Layout><Status /></Layout>
            </ProtectedRoute>
          } />
          
          {/* Admin routes - используем AdminRoute вместо ProtectedRoute */}
          <Route path="/admin" element={
            <AdminRoute>
              <AdminLayout><AdminDashboard /></AdminLayout>
            </AdminRoute>
          } />
          <Route path="/admin/requests" element={
            <AdminRoute>
              <AdminLayout><AdminRequests /></AdminLayout>
            </AdminRoute>
          } />
          <Route path="/admin/requests/:id" element={
            <AdminRoute>
              <AdminLayout><AdminRequestDetail /></AdminLayout>
            </AdminRoute>
          } />
          <Route path="/admin/files" element={
            <AdminRoute>
              <AdminLayout><AdminFiles /></AdminLayout>
            </AdminRoute>
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

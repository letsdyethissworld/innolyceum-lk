import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

interface ApplicantRouteProps {
  children: React.ReactNode;
}

const ApplicantRoute: React.FC<ApplicantRouteProps> = ({ children }) => {
  const { currentUser } = useAuth();

  // Проверяем что пользователь авторизован И является applicant
  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  if (currentUser.role !== 'applicant') {
    // Если пользователь admin, перенаправляем в админку
    // Если роль неизвестна, на главную
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default ApplicantRoute;
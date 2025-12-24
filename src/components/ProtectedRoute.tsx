import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { Spin } from 'antd';
import { useAuth } from '../contexts/AuthContext';
import { ROUTES } from '../constants';
import './ProtectedRoute.css';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

// Guard: Chỉ cho phép user đã login truy cập
export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="protected-route-loading">
        <Spin size="large" />
      </div>
    );
  }

  if (!isAuthenticated) {
    // Chưa login → redirect về /login
    return <Navigate to={ROUTES.LOGIN} state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

// Guard ngược: Đã login thì không vào được trang Login
export const PublicRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="protected-route-loading">
        <Spin size="large" />
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to={ROUTES.COURSES} replace />;
  }

  return <>{children}</>;
};

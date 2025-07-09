import React, { useEffect } from 'react';
import { Navigate } from 'react-router-dom';

interface LoginRedirectProps {
  children: React.ReactNode;
}

/**
 * Component để redirect user đã đăng nhập khỏi trang login
 */
const LoginRedirect: React.FC<LoginRedirectProps> = ({ children }) => {
  const isAuthenticated = () => {
    const token = localStorage.getItem('auth_token');
    const userInfo = localStorage.getItem('user_info');
    return !!(token && userInfo);
  };

  const getUser = () => {
    const userStr = localStorage.getItem('user_info');
    if (userStr) {
      try {
        return JSON.parse(userStr);
      } catch (error) {
        return null;
      }
    }
    return null;
  };

  const getDefaultRouteByRole = (role: string): string => {
    switch (role) {
      case 'EMPLOYEE':
        return '/evaluation';
      case 'SUPERVISOR':
        return '/cycles';
      case 'MANAGER':
        return '/';
      default:
        return '/evaluation';
    }
  };

  // Nếu user đã đăng nhập, redirect về trang phù hợp
  if (isAuthenticated()) {
    const user = getUser();
    if (user) {
      const defaultRoute = getDefaultRouteByRole(user.role);
      return <Navigate to={defaultRoute} replace />;
    }
  }

  // Nếu chưa đăng nhập, hiển thị trang login
  return <>{children}</>;
};

export default LoginRedirect;

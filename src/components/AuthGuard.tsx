import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface AuthGuardProps {
  children: React.ReactNode;
}

const AuthGuard: React.FC<AuthGuardProps> = ({ children }) => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    const userInfo = localStorage.getItem('user_info');

    // If no token or user info, redirect to login
    if (!token || !userInfo) {
      navigate('/login', { replace: true });
      return;
    }

    // Optional: Validate token format (basic check)
    try {
      JSON.parse(userInfo);
    } catch (error) {
      console.error('Invalid user info in localStorage');
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user_info');
      navigate('/login', { replace: true });
    }
  }, [navigate]);

  // Check if user is authenticated
  const isAuthenticated = () => {
    const token = localStorage.getItem('auth_token');
    const userInfo = localStorage.getItem('user_info');
    return !!(token && userInfo);
  };

  // Show loading or redirect if not authenticated
  if (!isAuthenticated()) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Đang kiểm tra quyền truy cập...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default AuthGuard;

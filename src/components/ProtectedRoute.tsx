import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRoles?: string[];
  fallbackPath?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredRoles = [],
  fallbackPath = '/login',
}) => {
  const location = useLocation();

  // Simple check using localStorage
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

  // Redirect to login if not authenticated
  if (!isAuthenticated()) {
    return <Navigate to={fallbackPath} state={{ from: location }} replace />;
  }

  // Check role-based access if required roles are specified
  if (requiredRoles.length > 0) {
    const user = getUser();
    if (user) {
      const hasRequiredRole = requiredRoles.includes(user.role);

      if (!hasRequiredRole) {
        return (
          <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="text-center max-w-md mx-auto">
              <div className="mx-auto h-12 w-12 flex items-center justify-center rounded-full bg-red-100">
                <svg
                  className="h-6 w-6 text-red-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                  />
                </svg>
              </div>
              <h2 className="mt-4 text-lg font-medium text-gray-900">
                Không có quyền truy cập
              </h2>
              <p className="mt-2 text-sm text-gray-600">
                Bạn không có quyền truy cập vào trang này.
              </p>
              <p className="mt-1 text-xs text-gray-500">
                Yêu cầu quyền: {requiredRoles.join(', ')}
              </p>
              <p className="text-xs text-gray-500">
                Quyền hiện tại: {user.role}
              </p>
            </div>
          </div>
        );
      }
    }
  }

  // Render children if all checks pass
  return <>{children}</>;
};

export default ProtectedRoute;

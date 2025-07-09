import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useRoleAccess, Role } from '../hooks/useRoleAccess';

interface RoleBasedRouteProps {
  children: React.ReactNode;
  allowedRoles: Role[];
  fallbackPath?: string;
  showAccessDenied?: boolean;
}

/**
 * Component bảo vệ route dựa trên role
 * Chỉ cho phép user với role được phép truy cập
 */
const RoleBasedRoute: React.FC<RoleBasedRouteProps> = ({
  children,
  allowedRoles,
  fallbackPath,
  showAccessDenied = true
}) => {
  const location = useLocation();
  const { userRole, hasAnyRole, getDefaultRoute } = useRoleAccess();

  // Nếu chưa có role (chưa đăng nhập), redirect về login
  if (!userRole) {
    return <Navigate to="/login" replace />;
  }

  // Kiểm tra quyền truy cập
  const hasAccess = hasAnyRole(allowedRoles);

  if (!hasAccess) {
    // Nếu có fallbackPath, redirect đến đó
    if (fallbackPath && location.pathname !== fallbackPath) {
      return <Navigate to={fallbackPath} replace />;
    }

    // Nếu không có fallbackPath, redirect về trang mặc định của role
    const defaultRoute = getDefaultRoute();

    // Tránh vòng lặp redirect - chỉ redirect nếu khác route hiện tại
    if (defaultRoute && location.pathname !== defaultRoute) {
      return <Navigate to={defaultRoute} replace />;
    }

    // Nếu đang ở trang hiện tại và không có quyền, hiển thị access denied
    if (showAccessDenied) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center max-w-md mx-auto p-6">
            <div className="mx-auto h-16 w-16 flex items-center justify-center rounded-full bg-red-100 mb-4">
              <svg
                className="h-8 w-8 text-red-600"
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
            
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Không có quyền truy cập
            </h2>
            
            <p className="text-gray-600 mb-4">
              Bạn không có quyền truy cập vào trang này.
            </p>
            
            <div className="bg-gray-100 rounded-lg p-4 mb-4">
              <p className="text-sm text-gray-700">
                <span className="font-medium">Quyền hiện tại:</span> {userRole}
              </p>
              <p className="text-sm text-gray-700">
                <span className="font-medium">Quyền yêu cầu:</span> {allowedRoles.join(', ')}
              </p>
            </div>

            <button
              onClick={() => window.history.back()}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <svg
                className="mr-2 h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
              Quay lại
            </button>
          </div>
        </div>
      );
    }

    // Fallback cuối cùng
    return <Navigate to="/login" replace />;
  }

  // Nếu có quyền, render children
  return <>{children}</>;
};

export default RoleBasedRoute;

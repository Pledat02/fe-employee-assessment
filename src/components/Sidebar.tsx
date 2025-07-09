import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useRoleAccess } from '../hooks/useRoleAccess';

interface MenuItem {
  id: 'employees' | 'departments' | 'evaluation' | 'statistics' | 'cycles' | 'evaluation-form'|'criteria'|'evaluation-history';
  label: string;
  path: string;
  icon: string;
  permission: keyof typeof menuPermissions; // Thêm permission key
}

interface SidebarProps {
  isMobileMenuOpen?: boolean;
  onMobileMenuToggle?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  isMobileMenuOpen = false,
  onMobileMenuToggle
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const { menuPermissions } = useRoleAccess();



  const allMenuItems: MenuItem[] = [
    { id: 'employees', label: 'Quản lý nhân viên', path: '/', icon: 'fas fa-users', permission: 'employees' },
    { id: 'departments', label: 'Quản lý phòng ban', path: '/departments', icon: 'fas fa-building', permission: 'departments' },
    { id: 'cycles', label: 'Quản lý chu kì', path: '/cycles', icon: 'fas fa-calendar-alt', permission: 'cycles' },
    { id: 'evaluation-form', label: 'Quản lý form', path: '/evaluation-form', icon: 'fas fa-file-alt', permission: 'evaluationForm' },
    { id: 'criteria', label: 'Tiêu chí & Câu hỏi', path: '/criteria', icon: 'fas fa-list-check', permission: 'criteria' },
    { id: 'evaluation', label: 'Đánh giá nhân viên', path: '/evaluation-selection', icon: 'fas fa-star', permission: 'evaluation' },
    { id: 'evaluation-history', label: 'Lịch sử đánh giá', path: '/evaluation-history', icon: 'fas fa-history', permission: 'evaluationHistory' },
    { id: 'statistics', label: 'Thống kê đánh giá', path: '/statistics', icon: 'fas fa-chart-bar', permission: 'statistics' },
  ];

  // Lọc menu items dựa trên quyền của user
  const menuItems = allMenuItems.filter(item => menuPermissions[item.permission]);

  const getMenuItemClassName = (itemPath: string) =>
      `flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 group relative ${
          location.pathname === itemPath
              ? 'text-blue-600 bg-blue-50 border-b-2 border-blue-600'
              : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
      }`;

  const handleLogout = async () => {
    try {
      // Clear all storage immediately
      localStorage.clear();
      sessionStorage.clear();

      // Call logout API (optional)
      await logout();
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      // Force clear everything and reload
      localStorage.clear();
      sessionStorage.clear();

      // Force reload the entire app
      window.location.replace('/login');
    }
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
          onClick={onMobileMenuToggle}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed left-0 top-0 z-50 flex h-screen w-64 flex-col border-r border-gray-200 bg-gradient-to-b from-white to-gray-50 shadow-xl transition-transform duration-300 ${
        isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      }`}>
      {/* Header */}
      <div className="flex items-center justify-center border-b border-gray-200 bg-gradient-to-r from-blue-600 to-blue-700 p-6">
        <div className="text-center">
          <span className="text-xl font-bold text-white">HR Evaluation</span>
          <div className="mt-1 text-xs text-blue-100">Hệ thống đánh giá</div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-3 px-4 py-8" aria-label="Main navigation">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => navigate(item.path)}
            className={getMenuItemClassName(item.path)}
            aria-current={location.pathname === item.path ? 'page' : undefined}
          >
            <div className={`mr-3 flex size-8 items-center justify-center rounded-lg transition-colors ${
              location.pathname === item.path
                ? 'bg-blue-100'
                : 'bg-gray-100 group-hover:bg-blue-100'
            }`}>
              <i className={`${item.icon} text-sm ${
                location.pathname === item.path
                  ? 'text-blue-600'
                  : 'text-gray-600 group-hover:text-blue-600'
              }`}></i>
            </div>
            <span className="font-medium">{item.label}</span>
          </button>
        ))}
      </nav>

      {/* User Info */}
      <div className="border-t border-gray-200 bg-gray-50/50 p-4">
        {/* User Profile */}
        <div className="mb-3 flex items-center rounded-xl bg-white p-3 shadow-sm">
          <div className="flex size-10 items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg">
            <i className="fas fa-user text-sm"></i>
          </div>
          <div className="ml-3 flex-1">
            <p className="truncate text-sm font-semibold text-gray-900">
              {user?.employee?.fullName || user?.username}
            </p>
            <p className="truncate text-xs text-gray-500">
              {user?.role} - {user?.employee?.departmentName}
            </p>
          </div>
        </div>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="group flex w-full items-center rounded-xl border border-gray-200 bg-white px-4 py-3 text-left text-sm text-gray-700 shadow-sm transition-colors duration-200 hover:bg-red-50 hover:text-red-600"
        >
          <div className="mr-3 flex size-8 items-center justify-center rounded-lg bg-gray-100 transition-colors group-hover:bg-red-100">
            <i className="fas fa-sign-out-alt text-xs"></i>
          </div>
          <span className="font-medium">Đăng xuất</span>
        </button>
      </div>
      </div>
    </>
  );
};

export default Sidebar;
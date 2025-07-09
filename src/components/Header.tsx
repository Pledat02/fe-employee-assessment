import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface MenuItem {
  id: 'employees' | 'departments' | 'evaluation' | 'statistics' | 'cycles' | 'evaluation-form'|'criteria';
  label: string;
  path: string;
  icon: string; // Add icon for sidebar
}

interface SidebarProps {
  isCollapsed?: boolean;
  onToggle?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isCollapsed = false, onToggle }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const menuItems: MenuItem[] = [
    { id: 'employees', label: 'Quản lý nhân viên', path: '/', icon: 'fas fa-users' },
    { id: 'departments', label: 'Quản lý phòng ban', path: '/departments', icon: 'fas fa-building' },
    { id: 'cycles', label: 'Quản lý chu kì', path: '/cycles', icon: 'fas fa-calendar-alt' },
    { id: 'evaluation-form', label: 'Quản lý form', path: '/evaluation-form', icon: 'fas fa-file-alt' },
    { id: 'criteria', label: 'Tiêu chí & Câu hỏi', path: '/criteria', icon: 'fas fa-list-check' },
    { id: 'evaluation', label: 'Đánh giá nhân viên', path: '/evaluation', icon: 'fas fa-star' },
    { id: 'statistics', label: 'Thống kê đánh giá', path: '/statistics', icon: 'fas fa-chart-bar' },
  ];

  const getMenuItemClassName = (itemPath: string) =>
      `flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
          location.pathname === itemPath
              ? 'bg-blue-100 text-blue-700 border-r-2 border-blue-500'
              : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
      }`;

  const handleUserMenuClick = () => {
    setShowUserMenu(!showUserMenu);
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <div className={`bg-white shadow-lg transition-all duration-300 ${
      isCollapsed ? 'w-16' : 'w-64'
    } min-h-screen flex flex-col`}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        {!isCollapsed && (
          <span className="text-xl font-bold text-blue-600">HR Evaluation</span>
        )}
        <button
          onClick={onToggle}
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          aria-label="Toggle sidebar"
        >
          <i className={`fas ${isCollapsed ? 'fa-chevron-right' : 'fa-chevron-left'} text-gray-600`}></i>
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-2" aria-label="Main navigation">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => navigate(item.path)}
            className={getMenuItemClassName(item.path)}
            aria-current={location.pathname === item.path ? 'page' : undefined}
            title={isCollapsed ? item.label : undefined}
          >
            <i className={`${item.icon} ${isCollapsed ? 'text-lg' : 'mr-3'}`}></i>
            {!isCollapsed && <span>{item.label}</span>}
          </button>
        ))}
      </nav>

      {/* User Menu */}
      <div className="border-t border-gray-200 p-4">
        <div className="relative" ref={menuRef}>
          <button
            onClick={handleUserMenuClick}
            className={`flex items-center w-full p-3 rounded-lg hover:bg-gray-100 transition-colors ${
              isCollapsed ? 'justify-center' : 'justify-between'
            }`}
            aria-label="Mở menu người dùng"
          >
            <div className="flex items-center">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-600">
                <i className="fas fa-user text-sm"></i>
              </div>
              {!isCollapsed && (
                <div className="ml-3 text-left">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {user?.employee?.fullName || user?.username}
                  </p>
                  <p className="text-xs text-gray-500 truncate">
                    {user?.role}
                  </p>
                </div>
              )}
            </div>
            {!isCollapsed && (
              <i className="fas fa-chevron-up text-gray-400 text-xs"></i>
            )}
          </button>

          {/* User Dropdown Menu */}
          {showUserMenu && (
            <div className={`absolute ${isCollapsed ? 'left-16 bottom-0' : 'left-0 bottom-16'} z-50 w-48 rounded-md border border-gray-200 bg-white py-1 shadow-lg`}>
              <div className="border-b border-gray-100 px-4 py-2">
                <p className="text-sm font-medium text-gray-900">
                  {user?.employee?.fullName || user?.username}
                </p>
                <p className="text-xs text-gray-500">
                  {user?.role} - {user?.employee?.departmentName}
                </p>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
              >
                <i className="fas fa-sign-out-alt mr-2"></i>
                Đăng xuất
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
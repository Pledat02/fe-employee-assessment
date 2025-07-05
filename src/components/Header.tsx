import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface Tab {
  id: 'employees' | 'departments' | 'evaluation' | 'statistics';
  label: string;
  path: string; // Add path for navigation
}

const Header: React.FC = () => {
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

  const tabs: Tab[] = [
    { id: 'employees', label: 'Quản lý nhân viên', path: '/' },
    { id: 'departments', label: 'Quản lý phòng ban', path: '/departments' },
    { id: 'criteria', label: 'Tiêu chí & Câu hỏi', path: '/criteria' },
    { id: 'evaluation', label: 'Đánh giá nhân viên', path: '/evaluation' },
    { id: 'statistics', label: 'Thống kê đánh giá', path: '/statistics' },
  ];

  const getTabClassName = (tabPath: string) =>
      `whitespace-nowrap cursor-pointer px-1 pb-2 border-b-2 font-medium text-sm ${
          location.pathname === tabPath
              ? 'border-blue-500 text-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
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
      <header className="bg-white shadow-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center">
              <div className="shrink-0">
                <span className="text-xl font-bold text-blue-600">HR Evaluation</span>
              </div>
              <nav className="ml-10 flex space-x-8" aria-label="Main navigation">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => navigate(tab.path)}
                        className={getTabClassName(tab.path)}
                        aria-current={location.pathname === tab.path ? 'page' : undefined}
                    >
                      {tab.label}
                    </button>
                ))}
              </nav>
            </div>
            <div className="flex items-center">
              <div className="relative" ref={menuRef}>
                <button
                  onClick={handleUserMenuClick}
                  className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                  aria-label="Mở menu người dùng"
                >
                  <span className="sr-only">Mở menu người dùng</span>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </button>

                {/* User Dropdown Menu */}
                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="text-sm font-medium text-gray-900">
                        {user?.employee?.fullName || user?.username}
                      </p>
                      <p className="text-xs text-gray-500">
                        {user?.role} - {user?.employee?.departmentName}
                      </p>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <i className="fas fa-sign-out-alt mr-2"></i>
                      Đăng xuất
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>
  );
};

export default Header;
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

interface Tab {
  id: 'employees' | 'departments' | 'evaluation' | 'statistics';
  label: string;
  path: string; // Add path for navigation
}

const Header: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const tabs: Tab[] = [
    { id: 'employees', label: 'Quản lý nhân viên', path: '/' },
    { id: 'departments', label: 'Quản lý phòng ban', path: '/departments' },
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
    alert('User menu functionality to be implemented (e.g., show dropdown with profile/logout)');
    // Example: navigate('/profile') or toggle dropdown
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
              <div className="relative">
                <button
                    onClick={handleUserMenuClick}
                    className="flex cursor-pointer rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    aria-label="Mở menu người dùng"
                >
                  <span className="sr-only">Mở menu người dùng</span>
                  <img
                      className="size-8 rounded-full"
                      src="https://readdy.ai/api/search-image?query=professional%20portrait%20of%20a%20Vietnamese%20business%20man%20in%20suit%20with%20neutral%20background%2C%20professional%20headshot%2C%20high%20quality%2C%20realistic%2C%20detailed%20facial%20features&width=100&height=100&seq=9&orientation=squarish"
                      alt="Ảnh đại diện người dùng"
                  />
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>
  );
};

export default Header;
import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../components/Header';

// Define props interface for MainLayout
interface MainLayoutProps {
    activeTab: 'employees' | 'departments' | 'evaluation' | 'statistics';
    setActiveTab: (tab: 'employees' | 'departments' | 'evaluation' | 'statistics') => void;
}

const MainLayout: React.FC<MainLayoutProps> = ({ activeTab, setActiveTab }) => {
    return (
        <div className="min-h-screen bg-gray-100">
            <Header activeTab={activeTab} setActiveTab={setActiveTab} />
            <main className="p-6">
                <div className="mx-auto max-w-7xl">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default MainLayout;
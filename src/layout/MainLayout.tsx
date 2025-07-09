import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';

// Define props interface for MainLayout
interface MainLayoutProps {
    children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    return (
        <div className="min-h-screen bg-gray-100">
            <Sidebar
                isMobileMenuOpen={isMobileMenuOpen}
                onMobileMenuToggle={toggleMobileMenu}
            />
            <main className="lg:ml-64 ml-0 min-h-screen">
                {/* Mobile Header */}
                <div className="lg:hidden bg-white shadow-sm border-b border-gray-200 p-4 flex items-center justify-between sticky top-0 z-30">
                    <button
                        onClick={toggleMobileMenu}
                        className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                        aria-label="Open menu"
                    >
                        <i className="fas fa-bars text-gray-600"></i>
                    </button>
                    <span className="text-lg font-bold text-blue-600">HR Evaluation</span>
                    <div className="w-10"></div> {/* Spacer for centering */}
                </div>

                <div className="p-6">
                    <div className="mx-auto max-w-full">
                        {children}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default MainLayout;
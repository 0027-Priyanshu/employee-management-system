import React from 'react';
import Sidebar from './Sidebar.jsx';
import Topbar from './Topbar.jsx';

const MainLayout = ({ children }) => {
    return (
        <div className="flex min-h-screen bg-gray-50">
            <Sidebar />
            <div className="flex-1 flex flex-col ml-64 transition-all duration-300">
                <Topbar />
                <main className="flex-1 p-8 overflow-y-auto">
                    <div className="max-w-7xl mx-auto">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default MainLayout;
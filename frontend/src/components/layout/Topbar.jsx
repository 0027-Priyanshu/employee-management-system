import React from 'react';
import { Menu, Bell, User as UserIcon, LogOut } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth.js';

const Topbar = () => {
    const { currentUser, logout } = useAuth();

    return (
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 sticky top-0 z-30 shadow-sm">
            <div className="flex items-center">
                <button className="p-2 rounded-md hover:bg-gray-100 text-gray-500 lg:hidden focus:outline-none focus:ring-2 focus:ring-primary-500">
                    <Menu size={24} />
                </button>
            </div>

            <div className="flex items-center space-x-4">
                <button className="p-2 rounded-full hover:bg-gray-100 text-gray-500 relative transition-colors">
                    <Bell size={20} />
                    <span className="absolute top-1.5 right-1.5 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white"></span>
                </button>

                <div className="flex items-center pl-4 border-l border-gray-200 space-x-3 group relative cursor-pointer">
                    <div className="flex flex-col text-right">
                        <span className="text-sm font-semibold text-gray-800 leading-tight">{currentUser?.name || 'User'}</span>
                        <span className="text-xs font-medium text-primary-600">{currentUser?.role || 'Role'}</span>
                    </div>
                    <div className="h-9 w-9 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-bold border border-primary-200">
                        <UserIcon size={18} />
                    </div>

                    <div className="absolute right-0 top-10 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-100 py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                        <button onClick={logout} className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-red-600 transition-colors">
                            <LogOut size={16} className="mr-2" />
                            Sign out
                        </button>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Topbar;
import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Users, Building, CalendarCheck, PieChart, Settings } from 'lucide-react';

const Sidebar = () => {
    const navItems = [
        { name: 'Dashboard', path: '/', icon: <LayoutDashboard size={20} /> },
        { name: 'Employees', path: '/employees', icon: <Users size={20} /> },
        { name: 'Departments', path: '/departments', icon: <Building size={20} /> },
        { name: 'Attendance', path: '/attendance', icon: <CalendarCheck size={20} /> },
    ];

    return (
        <aside className="w-64 bg-dark-900 min-h-screen text-gray-300 flex flex-col transition-all duration-300 fixed left-0 top-0 z-40 shadow-xl">
            <div className="h-16 flex items-center px-6 border-b border-dark-800 bg-dark-900 shadow-sm">
                <Building className="w-8 h-8 text-primary-500 mr-3" />
                <span className="text-xl font-bold text-white tracking-wide">EMS Pro</span>
            </div>

            <nav className="flex-1 py-6 px-4 space-y-2 overflow-y-auto">
                <p className="px-2 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">Main Menu</p>
                {navItems.map((item) => (
                    <NavLink
                        key={item.name}
                        to={item.path}
                        className={({ isActive }) =>
                            `flex items-center px-3 py-3 rounded-lg transition-all duration-200 group ${
                                isActive ? 'bg-primary-600 text-white shadow-md' : 'hover:bg-dark-800 hover:text-white'
                            }`
                        }
                    >
                        <span className="mr-3">{item.icon}</span>
                        <span className="font-medium text-sm">{item.name}</span>
                    </NavLink>
                ))}
            </nav>

            <div className="p-4 border-t border-dark-800">
                <button className="flex items-center px-3 py-3 w-full rounded-lg hover:bg-dark-800 hover:text-white transition-colors text-sm font-medium">
                    <Settings size={20} className="mr-3" />
                    Settings
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
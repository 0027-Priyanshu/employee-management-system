import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth.js';
import Login from './pages/Login.jsx';
import MainLayout from './components/layout/MainLayout.jsx';

// Import our real pages
import Dashboard from './pages/Dashboard.jsx';
import Employees from './pages/Employees.jsx';
import Attendance from './pages/Attendance.jsx';
import Departments from './pages/Departments.jsx'; // <-- 1. ADDED IMPORT

const ProtectedRoute = ({ children }) => {
    const { currentUser, loading } = useAuth();

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            </div>
        );
    }

    if (!currentUser) {
        return <Navigate to="/login" replace />;
    }

    return <MainLayout>{children}</MainLayout>;
};

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/login" element={<Login />} />

                {/* Protected Routes */}
                <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                <Route path="/employees" element={<ProtectedRoute><Employees /></ProtectedRoute>} />
                <Route path="/attendance" element={<ProtectedRoute><Attendance /></ProtectedRoute>} />

                {/* <-- 2. ADDED DEPARTMENT ROUTE --> */}
                <Route path="/departments" element={<ProtectedRoute><Departments /></ProtectedRoute>} />

                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </Router>
    );
}

export default App;
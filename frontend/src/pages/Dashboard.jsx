import React, { useState, useEffect } from 'react';
import { Users, UserCheck, UserX, Clock, Loader2 } from 'lucide-react';
import { Bar } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import api from '../services/api';

// Register only the components we are using
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Dashboard = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                // Fetching both analytics and report data
                const [reportRes, analyticsRes] = await Promise.all([
                    api.get('/attendance/report'),
                    api.get('/attendance/analytics')
                ]);

                setStats({
                    ...reportRes.data,
                    deptData: analyticsRes.data
                });
            } catch (error) {
                console.error('Error fetching dashboard stats', error);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-full">
                <Loader2 className="w-8 h-8 text-primary-600 animate-spin" />
            </div>
        );
    }

    const safeStats = stats || { totalEmployees: 0, present: 0, absent: 0, late: 0, deptData: [] };

    const statCards = [
        { title: 'Total Employees', value: safeStats.totalEmployees || 0, icon: <Users size={24} className="text-blue-600" />, bg: 'bg-blue-100' },
        { title: 'Present Today', value: safeStats.present || 0, icon: <UserCheck size={24} className="text-green-600" />, bg: 'bg-green-100' },
        { title: 'Absent Today', value: safeStats.absent || 0, icon: <UserX size={24} className="text-red-600" />, bg: 'bg-red-100' },
        { title: 'Late Arrivals', value: safeStats.late || 0, icon: <Clock size={24} className="text-orange-600" />, bg: 'bg-orange-100' },
    ];

    const departmentData = {
        labels: safeStats.deptData.map(d => d.name),
        datasets: [{
            label: 'Present Count',
            data: safeStats.deptData.map(d => d.present),
            backgroundColor: '#3b82f6',
            borderRadius: 4,
        }],
    };

    return (
        <div className="space-y-6 animate-fade-in">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
                <p className="text-sm text-gray-500 mt-1">Welcome back, here is what's happening today.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {statCards.map((card, index) => (
                    <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex items-center">
                        <div className={`p-4 rounded-lg ${card.bg} mr-4`}>{card.icon}</div>
                        <div>
                            <p className="text-sm font-medium text-gray-500">{card.title}</p>
                            <h3 className="text-2xl font-bold text-gray-900 mt-1">{card.value}</h3>
                        </div>
                    </div>
                ))}
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Department Attendance</h3>
                <div className="h-80">
                    <Bar data={departmentData} options={{ maintainAspectRatio: false }} />
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
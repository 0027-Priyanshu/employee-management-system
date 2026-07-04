import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle, Clock, Loader2 } from 'lucide-react';
import api from '../services/api';

const Attendance = () => {
    const today = new Date().toISOString().split('T')[0];

    // 1. Initial state checks localStorage for persistence
    const [selectedDate, setSelectedDate] = useState(() => {
        return localStorage.getItem('attendanceDate') || today;
    });

    const [employees, setEmployees] = useState([]);
    const [attendanceRecords, setAttendanceRecords] = useState({});
    const [loading, setLoading] = useState(true);

    // 2. Save date to localStorage whenever it changes
    useEffect(() => {
        localStorage.setItem('attendanceDate', selectedDate);
    }, [selectedDate]);

    // 3. Fetch data whenever the date changes
    useEffect(() => {
        fetchData();
    }, [selectedDate]);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [empRes, attRes] = await Promise.all([
                api.get('/employees'),
                api.get(`/attendance/date/${selectedDate}`)
            ]);

            const recordMap = {};
            attRes.data.forEach(record => {
                const empId = record.employee._id || record.employee;
                recordMap[empId] = record.status;
            });

            setEmployees(empRes.data);
            setAttendanceRecords(recordMap);
        } catch (error) {
            console.error('Data load failed', error);
        } finally {
            setLoading(false);
        }
    };

    const handleMarkAttendance = async (employeeId, status) => {
        try {
            // Sending the date to the backend so it saves correctly
            const response = await api.post('/attendance', {
                employee: employeeId,
                status,
                date: selectedDate
            });

            if (response.status === 200) {
                setAttendanceRecords(prev => ({
                    ...prev,
                    [employeeId]: status
                }));
            }
        } catch (error) {
            alert('Failed to mark attendance: ' + (error.response?.data?.message || 'Server Error'));
        }
    };

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex justify-between items-center bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div>
                    <h1 className="text-2xl font-bold">Daily Attendance</h1>
                    <p className="text-sm text-gray-500">Manage your team's presence.</p>
                </div>
                <input
                    type="date"
                    value={selectedDate}
                    max={today}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="p-2 border rounded-lg"
                />
            </div>

            {loading ? (
                <div className="flex justify-center py-20"><Loader2 className="animate-spin w-8 h-8 text-primary-600" /></div>
            ) : (
                <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-semibold uppercase">Employee</th>
                            <th className="px-6 py-3 text-left text-xs font-semibold uppercase">Status</th>
                            <th className="px-6 py-3 text-right text-xs font-semibold uppercase">Actions</th>
                        </tr>
                        </thead>
                        <tbody className="divide-y">
                        {employees.map((emp) => (
                            <tr key={emp._id}>
                                <td className="px-6 py-4">{emp.firstName} {emp.lastName}</td>
                                <td className="px-6 py-4">
                                        <span className={`px-2 py-1 rounded text-xs font-medium ${attendanceRecords[emp._id] ? 'bg-blue-100' : 'bg-gray-100'}`}>
                                            {attendanceRecords[emp._id] || 'Not Marked'}
                                        </span>
                                </td>
                                <td className="px-6 py-4 flex justify-end space-x-2">
                                    <button onClick={() => handleMarkAttendance(emp._id, 'Present')} className="text-green-600"><CheckCircle size={20} /></button>
                                    <button onClick={() => handleMarkAttendance(emp._id, 'Late')} className="text-orange-500"><Clock size={20} /></button>
                                    <button onClick={() => handleMarkAttendance(emp._id, 'Absent')} className="text-red-600"><XCircle size={20} /></button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default Attendance;
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const AttendanceChart = ({ data }) => {
    return (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-80">
            <h3 className="font-semibold text-gray-700 mb-4">Department Attendance</h3>
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="present" fill="#16a34a" />
                    <Bar dataKey="absent" fill="#dc2626" />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};

export default AttendanceChart;
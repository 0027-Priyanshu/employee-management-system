import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Trash2, Edit2, Plus } from 'lucide-react';

const Departments = () => {
    const [departments, setDepartments] = useState([]);
    const [name, setName] = useState('');
    const [editingId, setEditingId] = useState(null);

    useEffect(() => { fetchDepts(); }, []);

    const fetchDepts = async () => {
        const { data } = await api.get('/departments');
        setDepartments(data);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (editingId) {
            await api.put(`/departments/${editingId}`, { name });
        } else {
            await api.post('/departments', { name });
        }
        setName(''); setEditingId(null); fetchDepts();
    };

    const deleteDept = async (id) => {
        if (window.confirm("Are you sure?")) {
            await api.delete(`/departments/${id}`);
            fetchDepts();
        }
    };

    return (
        <div className="p-6 bg-white rounded-xl shadow-sm border">
            <h1 className="text-2xl font-bold mb-6">Manage Departments</h1>
            <form onSubmit={handleSubmit} className="flex gap-4 mb-8">
                <input
                    value={name} onChange={(e) => setName(e.target.value)}
                    className="border p-2 rounded w-full" placeholder="Department Name" required
                />
                <button className="bg-blue-600 text-white px-4 py-2 rounded">{editingId ? 'Update' : 'Add'}</button>
            </form>

            <table className="min-w-full divide-y">
                {departments.map(dept => (
                    <tr key={dept._id} className="border-b">
                        <td className="py-3">{dept.name}</td>
                        <td className="py-3 flex justify-end gap-3">
                            <button onClick={() => { setName(dept.name); setEditingId(dept._id); }}><Edit2 size={18}/></button>
                            <button onClick={() => deleteDept(dept._id)} className="text-red-500"><Trash2 size={18}/></button>
                        </td>
                    </tr>
                ))}
            </table>
        </div>
    );
};
export default Departments;
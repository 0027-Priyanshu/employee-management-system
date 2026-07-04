import React, { useState, useEffect } from 'react';
import { Plus, Search, Mail, Phone, Building2, Edit, Trash2, X, Loader2 } from 'lucide-react';
import api from '../services/api';

const Employees = () => {
    const [employees, setEmployees] = useState([]);
    const [departmentList, setDepartmentList] = useState([]); // NEW: State for departments
    const [loading, setLoading] = useState(true);

    // Modal & Form State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');

    const defaultForm = { firstName: '', lastName: '', email: '', phone: '', department: 'Engineering', position: '', status: 'Active' };
    const [formData, setFormData] = useState(defaultForm);

    useEffect(() => {
        fetchEmployees();
        fetchDepartments(); // NEW: Fetch departments on load
    }, []);

    const fetchEmployees = async () => {
        try {
            const { data } = await api.get('/employees');
            setEmployees(data);
        } catch (error) {
            console.error('Failed to fetch employees', error);
        } finally {
            setLoading(false);
        }
    };

    // NEW: Function to fetch dynamic departments
    const fetchDepartments = async () => {
        try {
            const { data } = await api.get('/departments');
            setDepartmentList(data);
        } catch (error) {
            console.error('Failed to fetch departments', error);
        }
    };

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            if (editingId) {
                await api.put(`/employees/${editingId}`, formData);
            } else {
                await api.post('/employees', formData);
            }
            setIsModalOpen(false);
            setFormData(defaultForm);
            fetchEmployees();
        } catch (error) {
            console.error("Full error object:", error.response);
            alert(error.response?.data?.message || 'Failed to save employee');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this employee? This cannot be undone.')) {
            try {
                await api.delete(`/employees/${id}`);
                fetchEmployees();
            } catch (error) {
                alert('Failed to delete employee');
            }
        }
    };

    const openAddModal = () => {
        setFormData(defaultForm);
        setEditingId(null);
        setIsModalOpen(true);
    };

    const openEditModal = (employee) => {
        setFormData(employee);
        setEditingId(employee._id);
        setIsModalOpen(true);
    };

    const filteredEmployees = employees.filter(emp => {
        const fullName = `${emp.firstName} ${emp.lastName}`.toLowerCase();
        return fullName.includes(searchQuery.toLowerCase()) ||
            emp.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
            emp.department.toLowerCase().includes(searchQuery.toLowerCase());
    });

    if (loading) {
        return (
            <div className="flex items-center justify-center h-full mt-20">
                <Loader2 className="w-8 h-8 text-primary-600 animate-spin" />
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Employee Directory</h1>
                    <p className="text-sm text-gray-500 mt-1">Manage your team members and their roles.</p>
                </div>
                <button onClick={openAddModal} className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors shadow-sm font-medium text-sm">
                    <Plus size={18} className="mr-2" /> Add Employee
                </button>
            </div>

            {/* Search Bar... */}
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center">
                <div className="relative flex-1 max-w-md">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Search className="h-4 w-4 text-gray-400" />
                    </div>
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="block w-full pl-10 pr-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-primary-500 focus:border-primary-500 outline-none bg-gray-50 focus:bg-white transition-colors"
                        placeholder="Search by name, email, or department..."
                    />
                </div>
            </div>

            {/* Data Table... */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Employee</th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Contact</th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Department</th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                        {filteredEmployees.length === 0 ? (
                            <tr><td colSpan="5" className="px-6 py-12 text-center text-gray-500">No employees found.</td></tr>
                        ) : (
                            filteredEmployees.map((emp) => (
                                <tr key={emp._id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-bold border border-primary-200">
                                                {emp.firstName.charAt(0)}{emp.lastName.charAt(0)}
                                            </div>
                                            <div className="ml-4">
                                                <div className="text-sm font-medium text-gray-900">{emp.firstName} {emp.lastName}</div>
                                                <div className="text-sm text-gray-500">{emp.position}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-900 flex items-center mb-1"><Mail size={14} className="mr-2 text-gray-400"/> {emp.email}</div>
                                        <div className="text-sm text-gray-500 flex items-center"><Phone size={14} className="mr-2 text-gray-400"/> {emp.phone}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                            <Building2 size={12} className="mr-1" /> {emp.department}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${emp.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                            {emp.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <button onClick={() => openEditModal(emp)} className="text-blue-600 hover:text-blue-900 mx-2 transition-colors"><Edit size={18} /></button>
                                        <button onClick={() => handleDelete(emp._id)} className="text-red-600 hover:text-red-900 mx-2 transition-colors"><Trash2 size={18} /></button>
                                    </td>
                                </tr>
                            ))
                        )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/50 backdrop-blur-sm px-4">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden animate-fade-in">
                        <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100">
                            <h2 className="text-lg font-semibold text-gray-900">{editingId ? 'Edit Employee' : 'Add New Employee'}</h2>
                            <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            {/* ... (Fields: firstName, lastName, email, phone) ... */}
                            <div className="grid grid-cols-2 gap-4">
                                <input required type="text" name="firstName" placeholder="First Name" value={formData.firstName} onChange={handleInputChange} className="w-full px-3 py-2 border rounded-md text-sm" />
                                <input required type="text" name="lastName" placeholder="Last Name" value={formData.lastName} onChange={handleInputChange} className="w-full px-3 py-2 border rounded-md text-sm" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <input required type="email" name="email" placeholder="Email" value={formData.email} onChange={handleInputChange} className="w-full px-3 py-2 border rounded-md text-sm" />
                                <input required type="text" name="phone" placeholder="Phone" value={formData.phone} onChange={handleInputChange} className="w-full px-3 py-2 border rounded-md text-sm" />
                            </div>

                            {/* DYNAMIC DEPARTMENT SELECT */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                                <select name="department" value={formData.department} onChange={handleInputChange} className="w-full px-3 py-2 border rounded-md text-sm bg-white">
                                    {departmentList.map((dept) => (
                                        <option key={dept._id} value={dept.name}>{dept.name}</option>
                                    ))}
                                </select>
                            </div>

                            <input required type="text" name="position" placeholder="Job Title" value={formData.position} onChange={handleInputChange} className="w-full px-3 py-2 border rounded-md text-sm" />

                            <button type="submit" className="w-full bg-primary-600 text-white py-2 rounded-lg hover:bg-primary-700">
                                {isSubmitting ? <Loader2 className="animate-spin mx-auto" /> : (editingId ? 'Update' : 'Save')}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Employees;
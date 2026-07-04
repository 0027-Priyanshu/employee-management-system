import Employee from '../models/Employee.js';

// @desc    Get all employees
export const getEmployees = async (req, res) => {
    try {
        const employees = await Employee.find({}).sort({ createdAt: -1 });
        res.json(employees);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch employees', error: error.message });
    }
};

// @desc    Create a new employee
export const createEmployee = async (req, res) => {
    try {
        const { firstName, lastName, email, phone, department, position, status } = req.body;
        const employeeExists = await Employee.findOne({ email });
        if (employeeExists) {
            return res.status(400).json({ message: 'Employee with this email already exists' });
        }
        const employee = await Employee.create({
            firstName, lastName, email, phone, department, position, status: status || 'Active',
        });
        res.status(201).json(employee);
    } catch (error) {
        res.status(500).json({ message: 'Failed to create employee', error: error.message });
    }
};

// @desc    Update employee
export const updateEmployee = async (req, res) => {
    try {
        const updatedEmployee = await Employee.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updatedEmployee);
    } catch (error) {
        res.status(500).json({ message: 'Failed to update employee', error: error.message });
    }
};

// @desc    Delete employee
export const deleteEmployee = async (req, res) => {
    try {
        await Employee.findByIdAndDelete(req.params.id);
        res.json({ message: 'Employee removed' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to delete employee', error: error.message });
    }
};
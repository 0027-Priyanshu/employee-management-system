import Department from '../models/Department.js';

// Ensure the 'export' keyword is present before every function
export const getDepartments = async (req, res) => {
    try {
        const depts = await Department.find();
        res.json(depts);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const addDepartment = async (req, res) => {
    try {
        const newDept = await Department.create(req.body);
        res.json(newDept);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const updateDepartment = async (req, res) => {
    try {
        const updated = await Department.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updated);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const deleteDepartment = async (req, res) => {
    try {
        await Department.findByIdAndDelete(req.params.id);
        res.json({ message: "Deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
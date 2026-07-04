import mongoose from 'mongoose';

const employeeSchema = mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    phone: {
        type: String,
        required: true
    },
    department: {
        type: String,
        required: true
    },
    position: {
        type: String,
        required: true
    },
    status: {
        type: String,
        default: 'Active'
    }
}, {
    timestamps: true
});

const Employee = mongoose.model('Employee', employeeSchema);

export default Employee;
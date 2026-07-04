import mongoose from 'mongoose';

const attendanceSchema = mongoose.Schema({
    employee: { // Changed from employeeId to employee
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Employee',
        required: true
    },
    date: { type: Date, required: true },
    status: {
        type: String,
        enum: ['Present', 'Absent', 'On Leave', 'Late'],
        default: 'Present'
    }
});

// IMPORTANT: Ensure the unique index matches the field name 'employee'
attendanceSchema.index({ employee: 1, date: 1 }, { unique: true });

export default mongoose.model('Attendance', attendanceSchema);
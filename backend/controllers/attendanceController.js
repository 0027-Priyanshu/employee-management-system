import Attendance from '../models/Attendance.js';

// 1. Mark or Update Attendance (Now supports specific dates)
export const markAttendance = async (req, res) => {
    try {
        const { employee, status, date } = req.body;

        // Use the passed date, or default to today
        const targetDate = date ? new Date(date) : new Date();
        targetDate.setHours(0, 0, 0, 0);

        const endOfDay = new Date(targetDate);
        endOfDay.setHours(23, 59, 59, 999);

        // Find record for this specific employee ON THIS SPECIFIC DATE
        let attendance = await Attendance.findOne({
            employee: employee,
            date: { $gte: targetDate, $lte: endOfDay }
        });

        if (attendance) {
            attendance.status = status;
            await attendance.save();
        } else {
            attendance = await Attendance.create({
                employee,
                status,
                date: targetDate
            });
        }
        res.status(200).json(attendance);
    } catch (error) {
        console.error("ATTENDANCE DB ERROR:", error);
        res.status(500).json({ message: error.message });
    }
};

// 2. Fetch Attendance by Specific Date
export const getAttendanceByDate = async (req, res) => {
    try {
        const { date } = req.params; // Expects YYYY-MM-DD
        const start = new Date(date);
        start.setHours(0, 0, 0, 0);

        const end = new Date(date);
        end.setHours(23, 59, 59, 999);

        const records = await Attendance.find({
            date: { $gte: start, $lte: end }
        }).populate('employee');

        res.json(records);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// 3. Analytics for Dashboard Charts
export const getAnalytics = async (req, res) => {
    try {
        const stats = await Attendance.aggregate([
            {
                $lookup: {
                    from: 'employees', // Ensure this matches your MongoDB collection name
                    localField: 'employee',
                    foreignField: '_id',
                    as: 'empDetails'
                }
            },
            { $unwind: '$empDetails' },
            {
                $group: {
                    _id: '$empDetails.department',
                    present: { $sum: { $cond: [{ $eq: ['$status', 'Present'] }, 1, 0] } },
                    absent: { $sum: { $cond: [{ $eq: ['$status', 'Absent'] }, 1, 0] } }
                }
            },
            { $project: { name: '$_id', present: 1, absent: 1, _id: 0 } }
        ]);
        res.json(stats);
    } catch (error) {
        console.error("ANALYTICS ERROR:", error);
        res.status(500).json({ message: error.message });
    }
};

// 4. Placeholder for future Report generation
export const getAttendanceReport = async (req, res) => {
    try {
        res.json({ message: "Report coming soon!" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
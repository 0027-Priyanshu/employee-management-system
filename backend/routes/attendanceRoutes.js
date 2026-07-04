import express from 'express';
// Make sure 'getAnalytics' is added to this import list
import { markAttendance, getAttendanceReport, getAttendanceByDate, getAnalytics } from '../controllers/attendanceController.js';

const router = express.Router();

router.post('/', markAttendance);
router.get('/report', getAttendanceReport);
router.get('/date/:date', getAttendanceByDate);
router.get('/analytics', getAnalytics); // Now this will work because it's imported!

export default router;
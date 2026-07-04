import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import attendanceRoutes from './routes/attendanceRoutes.js';
import employeeRoutes from './routes/employeeRoutes.js';
import departmentRoutes from './routes/departmentRoutes.js';

dotenv.config();
connectDB();

const app = express();

// --- Middleware ---
app.use(cors()); // CORS should usually be first
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// --- DIAGNOSTIC LOGGER ---
// This will print every single request to your terminal
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    if (Object.keys(req.body).length > 0) {
        console.log('Request Body:', JSON.stringify(req.body, null, 2));
    }
    next();
});

// --- Routes ---
app.use('/api/auth', authRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/employees', employeeRoutes);
app.use('/api/departments', departmentRoutes);

app.get('/', (req, res) => {
    res.send('EMS API is running...');
});

// Error handling middleware (catches bugs before they crash the server)
app.use((err, req, res, next) => {
    console.error('🚨 SERVER ERROR:', err.stack);
    res.status(500).json({ message: 'Internal Server Error', error: err.message });
});

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
    console.log(`Server running in development mode on port ${PORT}`);
});
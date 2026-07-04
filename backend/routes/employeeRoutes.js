import express from 'express';
import {
    getEmployees,
    createEmployee,
    updateEmployee,
    deleteEmployee
} from '../controllers/employeeController.js';

const router = express.Router();

// Routes for the main collection
router.route('/')
    .get(getEmployees)
    .post(createEmployee);

// Routes for a specific employee ID
router.route('/:id')
    .put(updateEmployee)
    .delete(deleteEmployee);

export default router;
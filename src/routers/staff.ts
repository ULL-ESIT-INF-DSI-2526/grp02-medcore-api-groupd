import { Router } from 'express';
import { createStaffController } from '../controller/staff/createStaffController.js';
import { readStaffByIdController } from '../controller/staff/readStaffByIdController.js';

const staffRouter = Router();


staffRouter.post('/', async (req, res) => {createStaffController(req, res);});

// Read
// por query
staffRouter.get('/:medicalLicenseNumber', (req, res) => {readStaffByIdController(req, res);});
    

export default staffRouter;
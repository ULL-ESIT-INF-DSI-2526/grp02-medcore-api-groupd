import { Router } from 'express';
import { createStaffController } from '../controller/staff/createStaffController.js';
import { readStaffByIdController } from '../controller/staff/readStaffByIdController.js';
import { readStaffController } from '../controller/staff/readStaffController.js';

const staffRouter = Router();


staffRouter.post('/', async (req, res) => {createStaffController(req, res);});

// Read
// por query
staffRouter.get('/:id', (req, res) => {readStaffByIdController(req, res);});
    
staffRouter.get('/', (req, res) => {readStaffController(req, res);});
export default staffRouter;
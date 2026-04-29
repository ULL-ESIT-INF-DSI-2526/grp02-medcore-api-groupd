import {app} from '../app.js';
import { Router } from 'express';
import { createNewStaff } from '../services/staff/createNewStaff.js';
import StaffInterface from '../models/staff/staffInterface.js';
import { createStaffController } from '../controller/staff/createStaffController.js';

const staffRouter = Router();


staffRouter.post('/', async (req, res) => {createStaffController(req, res);});


staffRouter.get('/', (req, res) => {});
    

export default staffRouter;
import { Router } from 'express';
import { createPatient } from '../controller/patients/createPatient.controller.js';

export const patientRouter = Router();

patientRouter.post('/patients', (req, res) => {
  createPatient(req, res);
});

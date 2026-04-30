import { Router } from 'express';
import { createPatient } from '../controller/patients/createPatient.controller.js';
import { getPatients } from '../controller/patients/getPatient.controller.js';
import { getPatientById } from '../controller/patients/getPatientById.controller.js';

export const patientRouter = Router();

patientRouter.post('/patients', (req, res) => {
  createPatient(req, res);
});

patientRouter.get('/patients', (req, res) => {
  getPatients(req, res);
});

patientRouter.get('/patients/:id', (req, res) => {
  getPatientById(req, res);
});

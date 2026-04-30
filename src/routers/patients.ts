import { Router } from 'express';
import { createPatient } from '../controller/patients/createPatient.controller.js';
import { getPatients } from '../controller/patients/getPatient.controller.js';

export const patientRouter = Router();

patientRouter.post('/patients', (req, res) => {
  console.log('Crear paciente');
  createPatient(req, res);
});

patientRouter.get('/patients', (req, res) => {
  getPatients(req, res);
});

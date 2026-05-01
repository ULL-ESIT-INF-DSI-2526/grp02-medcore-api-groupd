import { Router } from 'express';
import { createPatient } from '../controller/patients/createPatient.controller.js';
import { getPatients } from '../controller/patients/getPatient.controller.js';
import { getPatientById } from '../controller/patients/getPatientById.controller.js';
import { modifyPatient } from '../controller/patients/modifyPatient.controller.js';
import { deletePatient } from '../controller/patients/deletePatient.controller.js';
import { getPatientSummary } from '../controller/patients/getPatientsSummary.controller.js';

export const patientRouter = Router();

patientRouter.post('/patients', (req, res) => {
  createPatient(req, res);
});

patientRouter.get('/patients/summary', (req, res) => {
  getPatientSummary(req, res);
});

patientRouter.get('/patients', (req, res) => {
  getPatients(req, res);
});

patientRouter.get('/patients/:id', (req, res) => {
  getPatientById(req, res);
});

patientRouter.patch('/patients/:id', (req, res) => {
  modifyPatient(req, res);
});

patientRouter.delete('/patients/:id', (req, res) => {
  deletePatient(req, res);
});

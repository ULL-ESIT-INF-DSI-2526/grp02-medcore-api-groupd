import { Router } from 'express';
import { createMedication } from '../controller/medications/createMedication.controller.js';
import { readMedications } from '../controller/medications/getMedication.controller.js';
import { getMedicationbyId } from '../controller/medications/getMedicationbyId.controller.js';
import { deleteMedicationbyId } from '../controller/medications/deleteMedicationbyId.controller.js';
import { deleteMedication } from '../controller/medications/deleteMedication.controller.js';
import { modifyMedicationbyId } from '../controller/medications/modifyMedicationbyId.controller.js';
import { modifyMedication } from '../controller/medications/modifyMedication.controller.js';

export const medicationRouter = Router();

medicationRouter.post('/medications', (req, res) => {
  createMedication(req, res);
});

medicationRouter.get('/', (req, res) => {
  readMedications(req, res);
});

medicationRouter.get('/:id', (req, res) => {
  getMedicationbyId(req, res);
});

medicationRouter.delete('/:id', (req, res) => {
  deleteMedicationbyId(req, res);
});

medicationRouter.delete('/', (req, res) => {
  deleteMedication(req, res);
});

medicationRouter.patch('/:id', (req, res) => {
  modifyMedicationbyId(req, res);
});

medicationRouter.patch('/', (req, res) => {
  modifyMedication(req, res);
});
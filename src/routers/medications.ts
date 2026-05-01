import { Router } from 'express';
import { createMedication } from '../controller/medications/createMedication.controlles.js';

export const medicationRouter = Router();

medicationRouter.post('/medications', (req, res) => {
  createMedication(req, res);
});
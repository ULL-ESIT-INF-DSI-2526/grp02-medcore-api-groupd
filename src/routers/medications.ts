import { Router } from 'express';
import { createMedication } from '../controller/medications/createMedication.controller.js';

export const medicationRouter = Router();

medicationRouter.post('/', (req, res) => {
  createMedication(req, res);
});
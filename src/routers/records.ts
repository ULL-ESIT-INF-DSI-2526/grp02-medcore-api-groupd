import { Router } from 'express';
import { createRecord } from '../controller/record/createRecord.controller.js';

export const recordRouter = Router();

recordRouter.post('/records', (req, res) => {
  createRecord(req, res);
});

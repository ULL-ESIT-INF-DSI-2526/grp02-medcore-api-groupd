import { Router } from 'express';
import { createRecord } from '../controller/record/createRecord.controller.js';
import { readRecordsController } from '../controller/record/readRecord.controller.js';

export const recordRouter = Router();

recordRouter.post('/records', (req, res) => {
  createRecord(req, res);
});

recordRouter.get('/', (req, res) => {
  readRecordsController(req, res);
});
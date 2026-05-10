import { Router } from 'express';
import { createRecord } from '../controller/record/createRecord.controller.js';
import { readRecordController } from '../controller/record/readRecord.controller.js';
import { readRecordByIdController } from '../controller/record/readRecordById.controller.js';
import { deleteRecord } from '../controller/record/deleteRecord.controller.js';
import { modifyRecord } from '../controller/record/modifyRecord.controller.js';

export const recordRouter = Router();

recordRouter.post('/records', (req, res) => {
  createRecord(req, res);
});

recordRouter.get('/', (req, res) => {
  readRecordController(req, res);
});

recordRouter.get('/:id', readRecordByIdController);

recordRouter.delete('/records/:id', (req, res) => {
  deleteRecord(req, res);
});

recordRouter.patch('/records/:id', (req, res) => {
  modifyRecord(req, res);
});
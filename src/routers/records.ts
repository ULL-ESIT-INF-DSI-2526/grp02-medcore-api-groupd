import { Router } from 'express';
import { createRecord } from '../controller/record/createRecord.controller.js';
import { readRecordController } from '../controller/record/readRecord.controller.js';
import { readRecordByIdController } from '../controller/record/readRecordById.controller.js';
import { deleteRecord } from '../controller/record/deleteRecord.controller.js';
import { modifyRecord } from '../controller/record/modifyRecord.controller.js';

export const recordRouter = Router();

/**
 * @swagger
 * /records:
 *   post:
 *     summary: Create a new medical record
 *     tags:
 *       - Records
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       201:
 *         description: Record created successfully
 *       400:
 *         description: Invalid request body
 */
recordRouter.post('/records', (req, res) => {
  createRecord(req, res);
});
/**
 * @swagger
 * /records:
 *   get:
 *     summary: Get all medical records
 *     tags:
 *       - Records
 *     responses:
 *       200:
 *         description: List of records retrieved successfully
 *       400:
 *         description: Invalid request
 *     parameters:
 *       - in: query
 *         name: patient
 *         schema:
 *           type: string
 *         description: Filter records by patient ID
 *       - in: query
 *         name: doctor
 *         schema:
 *           type: string
 *         description: Filter records by doctor ID
 */
recordRouter.get('/records', (req, res) => {
  readRecordController(req, res);
});
/**
 * @swagger
 * /records/{id}:
 *   get:
 *     summary: Get a medical record by ID
 *     tags:
 *       - Records
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the medical record to retrieve
 *     responses:
 *       200:
 *         description: Record retrieved successfully
 *       404:
 *         description: Record not found
 *       400:
 *         description: Invalid request
 */
recordRouter.get('/records/:id', readRecordByIdController);

/**
 * @swagger
 * /records/{id}:
 *   delete:
 *     summary: Delete a medical record by ID
 *     tags:
 *       - Records
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the medical record to delete
 *     responses:
 *       200:
 *         description: Record deleted successfully
 *       404:
 *         description: Record not found
 *       400:
 *         description: Invalid request
 */
recordRouter.delete('/records/:id', (req, res) => {
  deleteRecord(req, res);
});

/**
 * @swagger
 * /records/{id}:
 *   patch:
 *     summary: Modify a medical record by ID
 *     tags:
 *       - Records
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the medical record to modify
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Record modified successfully
 *       404:
 *         description: Record not found
 *       400:
 *         description: Invalid request body or parameters
 */
recordRouter.patch('/records/:id', (req, res) => {
  modifyRecord(req, res);
});

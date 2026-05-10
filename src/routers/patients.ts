import { Router } from 'express';
import { createPatient } from '../controller/patients/createPatient.controller.js';
import { getPatients } from '../controller/patients/getPatient.controller.js';
import { getPatientById } from '../controller/patients/getPatientById.controller.js';
import { modifyPatient } from '../controller/patients/modifyPatient.controller.js';
import { deletePatient } from '../controller/patients/deletePatient.controller.js';
import { getPatientSummary } from '../controller/patients/getPatientsSummary.controller.js';
import { deletePatientsByFilter } from '../controller/patients/deletePatientsByFilter.controller.js';

export const patientRouter = Router();

/**
 * @swagger
 * /patients:
 *   post:
 *     summary: Create a new patient
 *     tags:
 *       - Patients
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       201:
 *         description: Patient created successfully
 *       400:
 *         description: Invalid request body
 */
patientRouter.post('/patients', (req, res) => {
  createPatient(req, res);
});

/**
 * @swagger
 * /patients:
 *   get:
 *     summary: Get all patients
 *     tags:
 *       - Patients
 *     responses:
 *       200:
 *         description: List of patients retrieved successfully
 *       400:
 *         description: Invalid request
 */
patientRouter.get('/patients', (req, res) => {
  getPatients(req, res);
});

/**
 * @swagger
 * /patients:
 *   delete:
 *     summary: Delete a patient using query parameters
 *     tags:
 *       - Patients
 *     parameters:
 *       - in: query
 *         name: idNumber
 *         required: true
 *         schema:
 *           type: string
 *         description: Identification number of the patient
 *     responses:
 *       200:
 *         description: Patient deleted successfully
 *       404:
 *         description: Patient not found
 *       400:
 *         description: Missing or invalid query parameter
 */
patientRouter.delete('/patients', (req, res) => {
  deletePatientsByFilter(req, res);
});

/**
 * @swagger
 * /patients/summary:
 *   get:
 *     summary: Get patient summary
 *     tags:
 *       - Patients
 *     responses:
 *       200:
 *         description: Patient summary retrieved successfully
 *       400:
 *         description: Invalid request
 */
patientRouter.get('/patients/summary', (req, res) => {
  getPatientSummary(req, res);
});

/**
 * @swagger
 * /patients/{id}:
 *   get:
 *     summary: Get a patient by ID
 *     tags:
 *       - Patients
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Patient ID
 *     responses:
 *       200:
 *         description: Patient retrieved successfully
 *       404:
 *         description: Patient not found
 */
patientRouter.get('/patients/:id', (req, res) => {
  getPatientById(req, res);
});

/**
 * @swagger
 * /patients/{id}:
 *   patch:
 *     summary: Modify a patient
 *     tags:
 *       - Patients
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Patient ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Patient modified successfully
 *       404:
 *         description: Patient not found
 *       400:
 *         description: Invalid request body
 */
patientRouter.patch('/patients/:id', (req, res) => {
  modifyPatient(req, res);
});

/**
 * @swagger
 * /patients/{id}:
 *   delete:
 *     summary: Delete a patient by ID
 *     tags:
 *       - Patients
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Patient ID
 *     responses:
 *       200:
 *         description: Patient deleted successfully
 *       404:
 *         description: Patient not found
 */
patientRouter.delete('/patients/:id', (req, res) => {
  deletePatient(req, res);
});

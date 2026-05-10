import { Router } from 'express';
import { createMedication } from '../controller/medications/createMedication.controller.js';
import { readMedications } from '../controller/medications/getMedication.controller.js';
import { getMedicationbyId } from '../controller/medications/getMedicationbyId.controller.js';
import { deleteMedicationbyId } from '../controller/medications/deleteMedicationbyId.controller.js';
import { deleteMedication } from '../controller/medications/deleteMedication.controller.js';
import { modifyMedicationbyId } from '../controller/medications/modifyMedicationbyId.controller.js';
import { modifyMedication } from '../controller/medications/modifyMedication.controller.js';

export const medicationRouter = Router();

/**
 * @swagger
 * /medications:
 *  post:
 *    summary: Create a new medication
 *    tags:
 *      - Medications
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *    responses:
 *      201:
 *        description: Medication created successfully
 *      400:
 *        description: Invalid request body
 *      409:
 *        description: Medication already exists
 */
medicationRouter.post('/', (req, res) => {
  createMedication(req, res);
});

/**
 * @swagger
 * /medications:
 *  get:
 *    summary: Get all medications
 *    tags:
 *      - Medications
 *    responses:
 *      200:
 *        description: List of medications retrieved successfully
 */
medicationRouter.get('/', (req, res) => {
  readMedications(req, res);
});

/**
 * @swagger
 * /medications/{id}:
 *  get:
 *    summary: Get a medication by ID
 *    tags:
 *      - Medications
 *    parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        schema:
 *          type: string
 *        description: MongoDB ID of the medication
 *    responses:
 *      200:
 *        description: Medication retrieved successfully
 *      404:
 *        description: Medication not found
 *      400:
 *        description: Invalid ID format
 */
medicationRouter.get('/:id', (req, res) => {
  getMedicationbyId(req, res);
});

/**
 * @swagger
 * /medications/{id}:
 *  delete:
 *    summary: Delete a medication by ID
 *    tags:
 *      - Medications
 *    parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        schema:
 *          type: string
 *        description: MongoDB ID of the medication
 *    responses:
 *      200:
 *        description: Medication deleted successfully
 *      404:
 *        description: Medication not found
 *      400:
 *        description: Invalid ID format
 */
medicationRouter.delete('/:id', (req, res) => {
  deleteMedicationbyId(req, res);
});

/**
 * @swagger
 * /medications:
 *  delete:
 *    summary: Delete a medication by filter (natCode)
 *    tags:
 *      - Medications
 *    parameters:
 *      - in: query
 *        name: natCode
 *        required: true
 *        schema:
 *          type: string
 *        description: National code of the medication
 *    responses:
 *      200:
 *        description: Medication deleted successfully
 *      404:
 *        description: Medication not found
 *      400:
 *        description: Invalid filter format
 */
medicationRouter.delete('/', (req, res) => {
  deleteMedication(req, res);
});

/**
 * @swagger
 * /medications/{id}:
 *  patch:
 *    summary: Modify a medication by ID
 *    tags:
 *      - Medications
 *    parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        schema:
 *          type: string
 *        description: MongoDB ID of the medication
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *    responses:
 *      200:
 *        description: Medication modified successfully
 *      404:
 *        description: Medication not found
 */
medicationRouter.patch('/:id', (req, res) => {
  modifyMedicationbyId(req, res);
});

/**
 * @swagger
 * /medications:
 *  patch:
 *    summary: Modify a medication by filter (natCode)
 *    tags:
 *      - Medications
 *    parameters:
 *      - in: query
 *      name: natCode
 *      required: true
 *      schema:
 *        type: string
 *      description: National code of the medication
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *    responses:
 *      200:
 *        description: Medication modified successfully
 *      404:
 *        description: Medication not found
 */
medicationRouter.patch('/', (req, res) => {
  modifyMedication(req, res);
});

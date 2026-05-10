import { Router } from 'express';
import { createStaffController } from '../controller/staff/createStaffController.js';
import { readStaffByIdController } from '../controller/staff/readStaffByIdController.js';
import { readStaffController } from '../controller/staff/readStaffController.js';
import { modifyStaffByIdController } from '../controller/staff/modifyStaffByIdController.js';
import { modifyStaffController } from '../controller/staff/modifyStaffController.js';
import { deleteStaffByIdController } from '../controller/staff/deleteStaffByIdController.js';
import { deleteStaffController } from '../controller/staff/deleteStaffController.js';

const staffRouter = Router();

/**
 * @swagger
 * /staff:
 *   post:
 *     summary: Create a new staff member
 *     tags:
 *       - Staff
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       201:
 *         description: Staff created successfully
 *       400:
 *         description: Invalid request body
 */
staffRouter.post('/', async (req, res) => {createStaffController(req, res);});// Create

/**
 * @swagger
 * /staff:
 *   get:
 *     summary: Get all staff members
 *     tags:
 *       - Staff
 *     responses:
 *       200:
 *         description: List of staff retrieved successfully
 *       400:
 *         description: Invalid request
 */
staffRouter.get('/', (req, res) => {readStaffController(req, res);});// Read

/**
 * @swagger
 * /staff:
 *   delete:
 *     summary: Delete staff by query filter
 *     tags:
 *       - Staff
 *     parameters:
 *       - in: query
 *         name: idNumber
 *         required: true
 *         schema:
 *           type: string
 *         description: Identification number of the staff member
 *     responses:
 *       200:
 *         description: Staff deleted successfully
 *       404:
 *         description: Staff not found
 *       400:
 *         description: Missing or invalid query parameter
 */
staffRouter.delete('/', (req, res) => {deleteStaffController(req, res);});// Delete by filter

/**
 * @swagger
 * /staff/{id}:
 *   get:
 *     summary: Get a staff member by ID
 *     tags:
 *       - Staff
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Staff ID
 *     responses:
 *       200:
 *         description: Staff retrieved successfully
 *       404:
 *         description: Staff not found
 */
staffRouter.get('/:id', (req, res) => {readStaffByIdController(req, res);});// Read by id

/**
 * @swagger
 * /staff/{id}:
 *   patch:
 *     summary: Modify a staff member by ID
 *     tags:
 *       - Staff
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Staff ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Staff modified successfully
 *       404:
 *         description: Staff not found
 *       400:
 *         description: Invalid request body
 */
staffRouter.patch('/:id', (req, res) => {modifyStaffByIdController(req, res);});// Update por id

/**
 * @swagger
 * /staff/{id}:
 *   delete:
 *     summary: Delete a staff member by ID
 *     tags:
 *       - Staff
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Staff ID
 *     responses:
 *       200:
 *         description: Staff deleted successfully
 *       404:
 *         description: Staff not found
 */
staffRouter.delete('/:id', (req, res) => {deleteStaffByIdController(req, res);});// delete por id

/**
 * @swagger
 * /staff:
 *   patch:
 *     summary: Modify staff by query filter
 *     tags:
 *       - Staff
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Staff modified successfully
 *       404:
 *         description: Staff not found
 *       400:
 *         description: Invalid request body
 */
staffRouter.patch('/', (req, res) => {modifyStaffController(req, res);});// Update por filtro
export default staffRouter;

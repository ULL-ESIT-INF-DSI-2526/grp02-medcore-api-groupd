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
 *     tags: [Staff]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Staff'
 *     responses:
 *       201:
 *         description: Staff member created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Staff'
 *       400:
 *         description: Bad request
 *       500:
 *         description: Internal server error
 */
staffRouter.post('/', async (req, res) => {
  createStaffController(req, res);
});

/**
 * @swagger
 * /staff/{id}:
 *   get:
 *     summary: Get a staff member by ID
 *     tags: [Staff]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The staff member ID
 *     responses:
 *       200:
 *         description: Staff member found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Staff'
 *       404:
 *         description: Staff member not found
 *       500:
 *         description: Internal server error
 */
staffRouter.get('/:id', (req, res) => {
  readStaffByIdController(req, res);
});

/**
 * @swagger
 * /staff:
 *   get:
 *     summary: Get a list of staff members
 *     tags: [Staff]
 *     parameters:
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *         description: Filter by staff member name
 *       - in: query
 *         name: role
 *         schema:
 *           type: string
 *         description: Filter by staff member role
 *     responses:
 *       200:
 *         description: A list of staff members
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Staff'
 *       500:
 *         description: Internal server error
 */
staffRouter.get('/', (req, res) => {
  readStaffController(req, res);
});

/**
 * @swagger
 * /staff/{id}:
 *   patch:
 *     summary: Update a staff member by ID
 *     tags: [Staff]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The staff member ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Staff'
 *     responses:
 *       200:
 *         description: Staff member updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Staff'
 *       400:
 *         description: Bad request
 *       404:
 *         description: Staff member not found
 *       500:
 *         description: Internal server error
 */
staffRouter.patch('/:id', (req, res) => {
  modifyStaffByIdController(req, res);
});

/**
 * @swagger
 * /staff:
 *   patch:
 *     summary: Update staff members by filter
 *     tags: [Staff]
 *     parameters:
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *         description: Filter by staff member name
 *       - in: query
 *         name: role
 *         schema:
 *           type: string
 *         description: Filter by staff member role
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Staff'
 *     responses:
 *       200:
 *         description: Staff members updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Staff'
 *       400:
 *         description: Bad request
 */
staffRouter.patch('/', (req, res) => {
  modifyStaffController(req, res);
});

/**
 * @swagger
 * /staff/{id}:
 *   delete:
 *     summary: Delete a staff member by ID
 *     tags: [Staff]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The staff member ID
 *     responses:
 *       200:
 *         description: Staff member deleted successfully
 *       404:
 *         description: Staff member not found
 *       500:
 *         description: Internal server error
 */
staffRouter.delete('/:id', (req, res) => {
  deleteStaffByIdController(req, res);
});

/**
 * @swagger
 * /staff:
 *   delete:
 *     summary: Delete staff members by filter
 *     tags: [Staff]
 *     parameters:
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *         description: Filter by staff member name
 *       - in: query
 *         name: role
 *         schema:
 *           type: string
 *         description: Filter by staff member role
 *     responses:
 *       200:
 *         description: Staff members deleted successfully
 *       400:
 *         description: Bad request
 */
staffRouter.delete('/', (req, res) => {
  deleteStaffController(req, res);
});
export default staffRouter;

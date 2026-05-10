import { readRecordById } from '../../services/record/readRecordById.js';
import { Request, Response } from 'express';
import mongoose from 'mongoose';

/**
 * Controlador para leer un registro médico por su ID.
 * @param req - Request
 * @param res - Response
 * @returns retorna un error o el registro médico encontrado por su ID.
 */
export async function readRecordByIdController(req: { params: { id: string } }, res: Response) {
    try {
        const { id } = req.params;
        if (!mongoose.isValidObjectId(id)) {
            return res.status(400).json({ error: 'Invalid record ID' });
        }
        const objectId = new mongoose.Types.ObjectId(id);
        const record = await readRecordById(objectId);
        if (!record) {
            return res.status(404).json({ error: 'Record not found' });
        }
        res.json(record);
    } catch (error) {
        if (error instanceof mongoose.Error.ValidationError) {
            return res.status(400).json({ error: error.message });
        }
        if (error instanceof Error) {
            return res.status(500).json({ error: error.message });
        }
        res.status(500).json({ error: 'Internal server error' });
    }
}   

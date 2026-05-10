import mongoose from 'mongoose';
import { Response } from 'express';
import { readStaffById } from '../../services/staff/readStaffById.js';
/**
 * 
 * @param req - Request
 * @param res - Response
 * @returns Retorna un error o el miembro del personal encontrado por su ID médico.
 */
export async function readStaffByIdController(req : { params: { id: string } }, res : Response) {
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ error: 'Invalid ID format' });
        }
        const objectId_ = new mongoose.Types.ObjectId(id);
        const result = await readStaffById(objectId_);
        if (!result) {
            return res.status(404).json({ error: 'Staff member not found' });
        }
        return res.status(200).json(result);
    } catch (error : unknown) {
        if (error instanceof mongoose.Error.CastError) {
            return res.status(400).json({ error: 'Invalid ID format' });
        }
        if (error instanceof Error) {
            return res.status(500).json({ error: error.message });
        }
    }
}
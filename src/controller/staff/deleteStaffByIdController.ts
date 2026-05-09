import { Request, Response } from 'express';
import { deleteStaffById } from '../../services/staff/deleteStaffById.js';
import mongoose from 'mongoose';

/**
 * Elimina un miembro del personal por su ID médico.
 * @param req - Request
 * @param res - Response
 * @returns Retorna un error o la confirmacion de eliminacion.
 */
export async function deleteStaffByIdController(req : {params : {id : string}}, res : Response) {
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ error: 'Invalid ID format' });
        }
        const objetcId_ = new mongoose.Types.ObjectId(id);
        const result = await deleteStaffById(objetcId_);
        if (!result) {
            return res.status(404).json({ error: 'Staff member not found' });
        }
        return res.status(200).json({ message: 'Staff member deleted successfully' });
    }
    catch (error : unknown) {
        if (error instanceof Error) {
            return res.status(500).json({ error: error.message });
        }
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}
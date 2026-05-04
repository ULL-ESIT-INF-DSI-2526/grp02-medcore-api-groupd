import { Request, Response } from 'express';
import iStaff  from '../../models/staff/staffInterface.js';
import { modifyStaff} from '../../services/staff/modifyStaff.js';
import mongoose from 'mongoose';

/**
 * Controlador para modificar un miembro del personal por un filtro.
 * @param req - Request
 * @param res - Response
 * @returns Retorna un error o el miembro dle personal modificado por el filtro.
 */
export async function modifyStaffController(req: Request, res: Response) {
    try {
        const filter : Partial<iStaff> = req.params;
        const staffData : Partial<iStaff> = req.body;
        const result = await modifyStaff(filter, staffData);
        return res.status(200).json(result);
    } catch (error : unknown) {
        if (error instanceof mongoose.Error.ValidationError) {
            return res.status(400).json({
                error: error.message,
            });
        }
        if (error instanceof Error) {
            return res.status(500).json({
                error: error.message,
            });
        }        return res.status(500).json({
            error: 'Internal Server Error',
        });
    }
}
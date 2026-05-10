import { Response } from 'express';
import iStaff  from '../../models/staff/staffInterface.js';
import { deleteStaff } from '../../services/staff/deleteStaff.js';
import mongoose from 'mongoose';

/**
 * Elimina un miembro del personal por un filtro.
 * @param req - Request
 * @param res - Response
 * @returns Retorna un error o el miembro del personal eliminado por el filtro.
 */
export async function deleteStaffController(req :  {query : {name? : string, specialty? : string}}, res : Response) {
    try {
        const { name, specialty } = req.query;
        const filter : Partial<iStaff> = {};

        if (typeof name === 'string') filter.name = name;
        if (typeof specialty === 'string') {
            const validSpecialties = ["medicina general", "cardiología", "traumatología", "pediatría", "oncología", "urgencias"];
            if (!validSpecialties.includes(specialty)) {
                return res.status(400).json({ error: `${specialty} is not a valid enum value` });
            }
            filter.specialty = specialty as iStaff['specialty'];
        }

        if (Object.keys(filter).length === 0) {
            return res.status(400).json({ error: 'No valid filter provided' });
        }

        const result = await deleteStaff(filter);
        if (!result) {
            return res.status(404).json({ error: 'Staff not found' });
        }
        return res.status(200).json(result);
    } catch (error : unknown) {
        if ( error instanceof mongoose.Error.ValidationError) {
            return res.status(400).json({ error: error.message });
        }
        if (error instanceof Error) {
            return res.status(500).json({ error: error.message });
        }
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}
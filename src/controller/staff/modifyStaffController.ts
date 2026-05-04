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
    const { name, specialty } = req.query;

    const filter: Partial<iStaff> = {};

    if (typeof name === 'string') filter.name = name;
    if (typeof specialty === 'string') {
      filter.specialty = specialty as iStaff['specialty'];
    }
    
    if (Object.keys(filter).length === 0) {
      return res.status(400).json({ error: 'No valid filter provided' });
    }

    const result = await modifyStaff(filter, req.body);

    if (!result) {
      return res.status(404).json({ error: 'Staff not found' });
    }

    return res.status(200).json(result);

  } catch (error: unknown) {
    if (error instanceof mongoose.Error.ValidationError) {
      return res.status(400).json({ error: error.message });
    }

    if (error instanceof Error) {
      return res.status(500).json({ error: error.message });
    }

    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
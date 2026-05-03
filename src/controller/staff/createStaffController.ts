import { createNewStaff } from '../../services/staff/createNewStaff.js';
import StaffInterface from '../../models/staff/staffInterface.js';

/**
 * Controlador para crear un nuevo miembro del personal.
 * @param req Request de la API, se espera que el cuerpo de la solicitud contenga los datos del nuevo miembro del personal.
 * @param res 
 * @returns 
 */
import mongoose from 'mongoose';
import { Request, Response } from 'express';

export async function createStaffController(req: Request, res: Response) {
  try {
    const createdStaff = await createNewStaff(req.body as StaffInterface);

    return res.status(201).json(createdStaff);

  } catch (error: unknown) {

    // Validation error de Mongoose
    if (error instanceof mongoose.Error.ValidationError) {
      return res.status(400).json({
        error: error.message,
      });
    }

    if (error instanceof Error) {
      const mongoError = error as Error & { code?: number };

      if (mongoError.code === 11000) {
        return res.status(409).json({
          error: 'Staff member already exists in the system',
        });
      }

      return res.status(500).json({
        error: error.message,
      });
    }

    return res.status(500).json({
      error: 'Internal Server Error',
    });
  }
}
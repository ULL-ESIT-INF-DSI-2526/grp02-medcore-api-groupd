import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { Medication } from '../../models/medications/medicationSchema.js';

/**
 * Controlador para la creación de un nuevo medicamento en el sistema.
 * @param req - Objeto de petición de Express
 * @param res - Objeto de respuesta de Express
 * 
 * @returns
 * - **201 (Created)**: Si el medicamento se guarda correctamente.
 * - **400 (Bad Request)**: Si hay errores de validación en los datos enviados.
 * - **409 (Conflict)**: Si el medicamento ya existe (error de clave duplicada).
 * - **500 (Internal Server Error)**: Para errores inesperados del servidor o de conexión.
 * 
 * @throws mongoose.Error.ValidationError Cuando los campos no cumplen con el esquema.
 */
export async function createMedication(req: Request, res: Response) {
  try{
    const newMedication = new Medication(req.body);
    await newMedication.save();
    res.status(201).json(newMedication);
  }
  catch (error: unknown) {
    if (error instanceof mongoose.Error.ValidationError) {
      return res.status(400).json({
        error: error.message,
      });
    }

    if (error instanceof Error) {
      const mongoError = error as Error & { code?: number };

      if (mongoError.code === 11000) {
        return res.status(409).json({
          error: 'The Medication is already at our system',
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
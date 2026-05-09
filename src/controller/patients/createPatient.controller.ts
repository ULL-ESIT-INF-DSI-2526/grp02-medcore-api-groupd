import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { Patient } from '../../models/patients/patientSchema.js';

/**
 * Crea un nuevo paciente en el sistema.
 * @param req - La solicitud HTTP que contiene los datos del paciente en el cuerpo.
 * @param res - La respuesta HTTP que se enviará al cliente con el resultado de la operación.
 * @returns JSON con el nuevo paciente creado o un mensaje de error en caso de fallo.
 *
 * @throws ValidationError - Si los datos del paciente no cumplen con el esquema definido.
 * @throws Error - Si ocurre un error inesperado durante la creación del paciente.
 *
 * Codigos de estado HTTP:
 * - 201: Paciente creado exitosamente.
 * - 400: Error de validación de datos.
 * - 409: El paciente ya existe en el sistema.
 * - 500: Error interno del servidor.
 */
export async function createPatient(req: Request, res: Response) {
  try {
    const newPatient = new Patient(req.body);
    await newPatient.save();
    res.status(201).json(newPatient);
  } catch (error: unknown) {
    if (error instanceof mongoose.Error.ValidationError) {
      return res.status(400).json({
        error: error.message,
      });
    }

    if (error instanceof Error) {
      const mongoError = error as Error & { code?: number };

      if (mongoError.code === 11000) {
        return res.status(409).json({
          error: 'The patient is already at our system',
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

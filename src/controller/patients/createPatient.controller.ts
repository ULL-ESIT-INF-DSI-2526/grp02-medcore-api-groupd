import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { Patient } from '../../models/patients/patientSchema.js';

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

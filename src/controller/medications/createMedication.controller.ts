import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { Medication } from '../../models/medications/medicationSchema.js';

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
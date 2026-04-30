import { Request, Response } from 'express';
import { Patient } from '../../models/patients/patientSchema.js';
import mongoose from 'mongoose';

export async function getPatientById(req: Request, res: Response) {
  try {
    const id = req.params.id as string;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid MongoDB id format' });
    }

    const patient = await Patient.findById(id);

    if (!patient)
      return res
        .status(404)
        .json({ error: `Patient with id (${id}) not found` });

    return res.status(200).json(patient);
  } catch (error) {
    return res.status(500).json({
      error:
        error instanceof Error
          ? error.message
          : 'Error interno del servidor desconocido',
    });
  }
}

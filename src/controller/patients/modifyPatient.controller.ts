import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { Patient } from '../../models/patients/patientSchema.js';

export async function modifyPatient(req: Request, res: Response) {
  try {
    const id = req.params.id as string;
    const updateData = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid MongoDB id format' });
    }

    const updatedPatient = await Patient.findByIdAndUpdate(id, updateData, {
      runValidators: true,
      returnDocument: 'after',
    });

    if (!updatedPatient) {
      return res
        .status(404)
        .json({ error: `Patient with id (${id}) not found` });
    }

    return res.status(200).json(updatedPatient);
  } catch (error) {
    return res.status(500).json({
      error:
        error instanceof Error
          ? error.message
          : 'Error interno del servidor desconocido',
    });
  }
}

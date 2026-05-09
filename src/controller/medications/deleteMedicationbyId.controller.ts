import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { Medication } from '../../models/medications/medicationSchema.js';

export async function deleteMedicationbyId(req: Request, res: Response) {
  try {
    const id = req.params.id as string;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid MongoDB id format' });
    }

    const deletedMedication = await Medication.findByIdAndDelete(id);

    if (!deletedMedication) {
      return res
        .status(404)
        .json({ error: `Medication with id (${id}) not found. Unable to delete` });
    }

    return res.status(200).json(deletedMedication);
  } catch (error) {
    return res.status(500).json({
      error:
        error instanceof Error
          ? error.message
          : 'Error interno del servidor desconocido',
    });
  }
}
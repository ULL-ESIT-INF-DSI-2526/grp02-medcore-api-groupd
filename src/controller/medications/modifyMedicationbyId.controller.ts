import { Request, Response } from 'express';
import { Medication } from '../../models/medications/medicationSchema.js';
import mongoose from 'mongoose';

export async function modifyMedicationbyId(req: Request, res: Response) {
  try {
    const id = req.params.id as string;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid MongoDB id format' });
    }
    const medication = await Medication.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });

    if (!medication)
      return res.status(404).json({ error: `Medication with id (${id}) not found` });

    return res.status(200).json(medication);
  } catch (error) {
    return res.status(500).json({
      error:
        error instanceof Error ? error.message : 'Error interno del servidor',
    });
  }
}
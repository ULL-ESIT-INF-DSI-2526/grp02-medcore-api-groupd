import { Request, Response } from 'express';
import { Medication } from '../../models/medications/medicationSchema.js';

export async function deleteMedication(req: Request, res: Response) {
  try {
    const { name, ingredient, code } = req.query;
    const filter: any = {};
    if (name) filter.name = { $regex: name, $options: 'i' };
    if (ingredient) filter.activeIngredient = { $regex: ingredient, $options: 'i' };
    if (code) filter.nationalCode = code;
    if (Object.keys(filter).length === 0) {
        return res.status(400).json({ error: 'A filter must be provided' });
    }
    const result = await Medication.deleteMany(filter);
    if (result.deletedCount === 0) {
        return res.status(404).json({ error: 'Medications were not found' });
    }
    return res.status(200).json(result);
  } catch (error : unknown) {
      return res.status(500).json({
        error: error instanceof Error ? error.message : 'Internal server error',
      });
  }
}
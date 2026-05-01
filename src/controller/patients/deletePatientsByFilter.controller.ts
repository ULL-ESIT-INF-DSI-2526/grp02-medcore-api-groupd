import { Request, Response } from 'express';
import { Patient } from '../../models/patients/patientSchema.js';

type AllowedStatus = 'active' | 'temporary leave' | 'deceased';
interface deleteFilter {
  status?: AllowedStatus;
  isCronic?: boolean;
}

export async function deletePatientsByFilter(req: Request, res: Response) {
  try {
    const status = req.query.status ? req.query.status.toString() : undefined;
    const isCronic =
      req.query.isCronic !== undefined
        ? req.query.isCronic === 'true'
        : undefined;

    const filter: deleteFilter = {};

    if (status) {
      const validStatuses = ['active', 'temporary leave', 'deceased'];

      if (!validStatuses.includes(status)) {
        return res.status(400).json({
          error: `El estado '${status}' no es válido. Opciones permitidas: active, temporary leave, deceased.`,
        });
      }

      filter.status = status as AllowedStatus;
    }
    if (isCronic !== undefined) filter.isCronic = isCronic;

    if (Object.keys(filter).length === 0) {
      return res
        .status(400)
        .json({ error: 'DANGER: A filter must be provided' });
    }

    const result = await Patient.deleteMany(filter);

    if (!result) {
      return res
        .status(404)
        .json({ error: 'Nothing to delete with this criteria' });
    }
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({
      error: error instanceof Error ? error.message : 'Internal server error',
    });
  }
}

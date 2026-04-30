import { Request, Response } from 'express';
import { Patient } from '../../models/patients/patientSchema.js';

interface PatientFilter {
  name?: { $regex: string; $options: string };
  idenNumber?: string;
}

export async function getPatients(req: Request, res: Response) {
  try {
    const name = req.query.name ? req.query.name.toString() : '';
    const idenNumber = req.query.idenNumber
      ? req.query.idenNumber.toString()
      : '';

    const filter: PatientFilter = {};

    if (name) filter.name = { $regex: name, $options: 'i' };
    if (idenNumber) filter.idenNumber = idenNumber;

    const patients = await Patient.find(filter);

    if (patients.length === 0) {
      return res
        .status(404)
        .json({ error: 'Not found any patient with this criteria' });
    }

    return res.status(200).json(patients);
  } catch (error) {
    return res.status(500).json({
      error:
        error instanceof Error
          ? error.message
          : 'Error interno del servidor desconocido',
    });
  }
}

import { Request, Response } from 'express';
import { Patient } from '../../models/patients/patientSchema.js';

export async function getPatientSummary(req: Request, res: Response) {
  try {
    const totalPatients = await Patient.countDocuments();

    if (totalPatients === 0) {
      return res.status(404).json({ error: 'Database is empty' });
    }

    const genderStats = await Patient.aggregate([
      { $group: { _id: '$gender', count: { $sum: 1 } } },
    ]);

    const bloodTypeStats = await Patient.aggregate([
      { $group: { _id: '$bloodType', count: { $sum: 1 } } },
    ]);

    const statusStats = await Patient.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]);

    return res.status(200).json({
      total: totalPatients,
      byGender: genderStats,
      byBloodType: bloodTypeStats,
      byStatus: statusStats,
    });
  } catch (error) {
    return res.status(500).json({
      error:
        error instanceof Error
          ? error.message
          : 'Error interno del servidor desconocido',
    });
  }
}

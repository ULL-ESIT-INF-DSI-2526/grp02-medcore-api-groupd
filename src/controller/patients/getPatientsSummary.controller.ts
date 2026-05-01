import { Request, Response } from 'express';
import { Patient } from '../../models/patients/patientSchema.js';

/**
 * Obtiene un resumen estadístico de los pacientes en el sistema, incluyendo el total de pacientes,
 * la distribución por género, tipo de sangre y estado.
 * @param req - La solicitud HTTP que no requiere parámetros específicos.
 * @param res - La respuesta HTTP que se enviará al cliente con el resultado de la operación.
 * @returns JSON con el resumen estadístico de los pacientes o un mensaje de error en caso de fallo.
 *
 * @throws Error - Si ocurre un error inesperado durante la obtención del resumen.
 *
 * Códigos de estado HTTP:
 * - 200: Resumen obtenido exitosamente.
 * - 404: No hay pacientes en la base de datos.
 * - 500: Error interno del servidor.
 */
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

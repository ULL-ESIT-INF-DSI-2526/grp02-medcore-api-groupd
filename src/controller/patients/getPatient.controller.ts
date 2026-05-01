import { Request, Response } from 'express';
import { Patient } from '../../models/patients/patientSchema.js';

/**
 * Interface para definir los criterios de filtrado de pacientes en la consulta.
 */
interface PatientFilter {
  name?: { $regex: string; $options: string };
  idenNumber?: string;
}

/**
 * Obtiene una lista de pacientes que coinciden con los criterios de búsqueda proporcionados en la consulta.
 * Los criterios de búsqueda pueden incluir el nombre del paciente (con coincidencia parcial) y/o el número de identificación.
 * Si no se proporcionan criterios, se devolverán todos los pacientes.
 * @param req - La solicitud HTTP que contiene los criterios de búsqueda en la consulta.
 * @param res - La respuesta HTTP que se enviará al cliente con el resultado de la operación.
 * @returns JSON con la lista de pacientes que coinciden con los criterios de búsqueda o un mensaje de error en caso de fallo.
 *
 * @throws Error - Si ocurre un error inesperado durante la consulta de pacientes.
 *
 * Códigos de estado HTTP:
 * - 200: Consulta exitosa, se devuelve la lista de pacientes.
 * - 404: No se encontraron pacientes que coincidan con los criterios de búsqueda.
 * - 500: Error interno del servidor.
 */
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

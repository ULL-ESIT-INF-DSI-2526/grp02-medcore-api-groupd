import { Request, Response } from 'express';
import { Patient } from '../../models/patients/patientSchema.js';
/**
 * Tipos permitidos para el campo 'status' en el filtro de eliminación de pacientes.
 */
type AllowedStatus = 'active' | 'temporary leave' | 'deceased';

/**
 * Interfaz que define la estructura del filtro utilizado para eliminar pacientes.
 * Ambos campos son opcionales, pero al menos uno debe ser proporcionado para realizar la eliminación.
 */
interface deleteFilter {
  status?: AllowedStatus;
  isCronic?: boolean;
}

/**
 * Elimina pacientes del sistema basándose en los filtros proporcionados en la consulta.
 * Se pueden filtrar por estado (active, temporary leave, deceased) y/o por si el paciente es crónico.
 * Al menos uno de los filtros debe ser proporcionado para realizar la eliminación.
 * @param req - La solicitud HTTP que contiene los filtros en la consulta.
 * @param res - La respuesta HTTP que se enviará al cliente con el resultado de la operación.
 * @returns JSON con el resultado de la eliminación o un mensaje de error en caso de fallo.
 *
 * @throws Error - Si ocurre un error inesperado durante la eliminación de pacientes.
 *
 * Códigos de estado HTTP:
 * - 200: Pacientes eliminados exitosamente.
 * - 400: No se proporcionó ningún filtro o el estado proporcionado no es válido.
 * - 404: No se encontraron pacientes que coincidan con los criterios de eliminación.
 * - 500: Error interno del servidor.
 */
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

    if (result.deletedCount === 0) {
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

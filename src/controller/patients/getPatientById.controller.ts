import { Request, Response } from 'express';
import { Patient } from '../../models/patients/patientSchema.js';
import mongoose from 'mongoose';

/**
 * Obtiene un paciente por su ID.
 * @param req - La solicitud HTTP que contiene el ID del paciente en los parámetros de la ruta.
 * @param res - La respuesta HTTP que se enviará al cliente con el resultado de la operación.
 * @returns JSON con el paciente encontrado o un mensaje de error en caso de fallo.
 *
 * @throws Error - Si ocurre un error inesperado durante la búsqueda del paciente.
 *
 * Códigos de estado HTTP:
 * - 200: Paciente encontrado exitosamente.
 * - 400: Formato de ID inválido.
 * - 404: Paciente no encontrado.
 * - 500: Error interno del servidor.
 */
export async function getPatientById(req: Request, res: Response) {
  try {
    const id = req.params.id as string;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid MongoDB id format' });
    }

    const patient = await Patient.findById(id);

    if (!patient)
      return res
        .status(404)
        .json({ error: `Patient with id (${id}) not found` });

    return res.status(200).json(patient);
  } catch (error) {
    return res.status(500).json({
      error:
        error instanceof Error
          ? error.message
          : 'Error interno del servidor desconocido',
    });
  }
}

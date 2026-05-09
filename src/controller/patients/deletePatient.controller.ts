import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { Patient } from '../../models/patients/patientSchema.js';

/**
 * Elimina un paciente existente del sistema utilizando su ID de MongoDB.
 * @param req - La solicitud HTTP que contiene el ID del paciente a eliminar en los parámetros de la ruta.
 * @param res - La respuesta HTTP que se enviará al cliente con el resultado de la operación.
 * @returns JSON con el paciente eliminado o un mensaje de error en caso de fallo.
 *
 * @throws Error - Si ocurre un error inesperado durante la eliminación del paciente.
 *
 * Códigos de estado HTTP:
 * - 200: Paciente eliminado exitosamente.
 * - 400: Formato de ID de MongoDB no válido.
 * - 404: Paciente no encontrado para eliminar.
 * - 500: Error interno del servidor.
 */
export async function deletePatient(req: Request, res: Response) {
  try {
    const id = req.params.id as string;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid MongoDB id format' });
    }

    const deletedPatient = await Patient.findByIdAndDelete(id);

    if (!deletedPatient) {
      return res
        .status(404)
        .json({ error: `Patient with id (${id}) not found unable to delete` });
    }

    return res.status(200).json(deletedPatient);
  } catch (error) {
    return res.status(500).json({
      error:
        error instanceof Error
          ? error.message
          : 'Error interno del servidor desconocido',
    });
  }
}

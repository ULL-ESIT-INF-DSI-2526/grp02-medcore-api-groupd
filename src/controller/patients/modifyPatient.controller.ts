import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { Patient } from '../../models/patients/patientSchema.js';

/**
 * Modifica los datos de un paciente existente en el sistema.
 * @param req - La solicitud HTTP que contiene el ID del paciente en los parámetros de la ruta y los datos a modificar en el cuerpo.
 * @param res - La respuesta HTTP que se enviará al cliente con el resultado de la operación.
 * @returns JSON con el paciente actualizado o un mensaje de error en caso de fallo.
 *
 * @throws ValidationError - Si los datos de actualización no cumplen con el esquema definido.
 * @throws Error - Si ocurre un error inesperado durante la modificación del paciente.
 *
 * Códigos de estado HTTP:
 * - 200: Paciente modificado exitosamente.
 * - 400: Formato de ID inválido o error de validación de datos.
 * - 404: Paciente no encontrado.
 * - 500: Error interno del servidor.
 */
export async function modifyPatient(req: Request, res: Response) {
  try {
    const id = req.params.id as string;
    const updateData = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid MongoDB id format' });
    }

    const updatedPatient = await Patient.findByIdAndUpdate(id, updateData, {
      runValidators: true, // Asegura que se validen los datos de actualización según el esquema del modelo.
      returnDocument: 'after',
    });

    if (!updatedPatient) {
      return res
        .status(404)
        .json({ error: `Patient with id (${id}) not found` });
    }

    return res.status(200).json(updatedPatient);
  } catch (error: unknown) {
    if (error instanceof mongoose.Error.ValidationError) {
      return res.status(400).json({ error: error.message });
    }
    return res.status(500).json({
      error:
        error instanceof Error
          ? error.message
          : 'Error interno del servidor desconocido',
    });
  }
}

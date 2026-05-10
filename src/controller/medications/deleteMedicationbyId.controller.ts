import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { Medication } from '../../models/medications/medicationSchema.js';

/**
 * Elimina un medicamento de la base de datos utilizando su identificador único de MongoDB.
 * @param req - Objeto de petición de Express. Se espera que el parámetro `id` esté presente en `req.params`.
 * @param res - Objeto de respuesta de Express.
 * 
 * @returns 
 * Una promesa que resuelve con:
 * - **200 (OK)**: El objeto del medicamento eliminado si la operación tuvo éxito.
 * - **400 (Bad Request)**: Si el formato del ID proporcionado no es un ObjectId válido.
 * - **404 (Not Found)**: Si no existe ningún medicamento con el ID proporcionado.
 * - **500 (Internal Server Error)**: Si ocurre un error inesperado durante la operación.
 */
export async function deleteMedicationbyId(req: Request, res: Response) {
  try {
    const id = req.params.id as string;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid MongoDB id format' });
    }

    const deletedMedication = await Medication.findByIdAndDelete(id);

    if (!deletedMedication) {
      return res
        .status(404)
        .json({ error: `Medication with id (${id}) not found. Unable to delete` });
    }

    return res.status(200).json(deletedMedication);
  } catch (error) {
    return res.status(500).json({
      error:
        error instanceof Error
          ? error.message
          : 'Error interno del servidor desconocido',
    });
  }
}
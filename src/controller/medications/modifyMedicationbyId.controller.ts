import { Request, Response } from 'express';
import { Medication } from '../../models/medications/medicationSchema.js';
import mongoose from 'mongoose';

/**
 * Actualiza un medicamento existente identificado por su ID de MongoDB.
 * @param req - Objeto de petición de Express. 
 *              Debe contener el ID en `req.params.id` y los campos a actualizar en `req.body`.
 * @param res - Objeto de respuesta de Express.
 * 
 * @returns
 * - **200 (OK)**: Objeto del medicamento actualizado correctamente.
 * - **400 (Bad Request)**: Si el formato del ID de MongoDB no es válido.
 * - **404 (Not Found)**: Si no existe ningún medicamento con el ID proporcionado.
 * - **500 (Internal Server Error)**: Error inesperado durante el proceso de actualización.
 */
export async function modifyMedicationbyId(req: Request, res: Response) {
  try {
    const id = req.params.id as string;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid MongoDB id format' });
    }
    const medication = await Medication.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });

    if (!medication)
      return res.status(404).json({ error: `Medication with id (${id}) not found` });

    return res.status(200).json(medication);
  } catch (error) {
    return res.status(500).json({
      error:
        error instanceof Error ? error.message : 'Error interno del servidor',
    });
  }
}
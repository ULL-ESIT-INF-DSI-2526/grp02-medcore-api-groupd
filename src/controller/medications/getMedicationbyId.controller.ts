import { Request, Response } from 'express';
import { Medication } from '../../models/medications/medicationSchema.js';
import mongoose from 'mongoose';

/**
 * Obtiene un medicamento específico de la base de datos utilizando su identificador único.
 * @param req - Objeto de petición de Express. Se espera que contenga el parámetro `id` en `req.params`.
 * @param res - Objeto de respuesta de Express utilizado para enviar el medicamento o el error.
 * 
 * @returns 
 * - **200 (OK)**: Retorna el documento del medicamento si se encuentra.
 * - **400 (Bad Request)**: Si el formato del ID de MongoDB proporcionado no es válido.
 * - **404 (Not Found)**: Si no existe ningún medicamento con el ID proporcionado.
 * - **500 (Internal Server Error)**: Si ocurre un error inesperado durante la consulta.
 */
export async function getMedicationbyId(req: Request, res: Response) {
  try {
    const id = req.params.id as string;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid MongoDB id format' });
    }

    const medication = await Medication.findById(id);

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
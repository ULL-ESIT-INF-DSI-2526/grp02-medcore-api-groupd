import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { Medication } from '../../models/medications/medicationSchema.js';

/**
 * Controlador para modificar un medicamento existente basado en criterios de búsqueda.
 * @param req - Objeto de petición de Express.
 *    - `req.query`: Puede contener `name`, `ingredient` (activeIngredient) o `code` (nationalCode).
 *    - `req.body`: Contiene los campos del medicamento que se desean actualizar.
 * @param res - Objeto de respuesta de Express.
 * 
 * @returns
 * - **200 (OK)**: Retorna el documento del medicamento actualizado.
 * - **400 (Bad Request)**: Si no se proporcionan filtros o si los datos de actualización fallan la validación.
 * - **404 (Not Found)**: Si ningún medicamento coincide con los filtros proporcionados.
 * - **500 (Internal Server Error)**: Si ocurre un error inesperado en el servidor.
 * 
 * @throws mongoose.Error.ValidationError Si los datos del `body` no cumplen con el esquema del modelo.
 */
export async function modifyMedication(req: Request, res: Response) {
  try {
    const { name, ingredient, code } = req.query;
    const filter: any = {};
    if (name) filter.name = { $regex: name, $options: 'i' };
    if (ingredient) filter.activeIngredient = { $regex: ingredient, $options: 'i' };
    if (code) filter.nationalCode = code;

    if (Object.keys(filter).length === 0) {
      return res.status(400).json({ error: 'A filter must be provided' });
    }

    const result = await Medication.findOneAndUpdate(filter, req.body, {
      runValidators: true,
      returnDocument: 'after',
    });

    if (!result) {
      return res.status(404).json({ error: 'Medication not found' });
    }
    return res.status(200).json(result);
  } catch (error: unknown) {
    if (error instanceof mongoose.Error.ValidationError) {
      return res.status(400).json({ error: error.message });
    }
    if (error instanceof Error) {
      return res.status(500).json({ error: error.message });
    }
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
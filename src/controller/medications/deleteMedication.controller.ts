import { Request, Response } from 'express';
import { Medication } from '../../models/medications/medicationSchema.js';

/**
 * Elimina medicamentos de la base de datos basándose en filtros de búsqueda.
 * 
 * @param req - Objeto de petición de Express. 
 * Se esperan los parámetros `name`, `ingredient` o `code` en `req.query`.
 * @param res - Objeto de respuesta de Express.
 * 
 * @returns
 * - **200 (OK)**: Devuelve un objeto con el conteo de documentos eliminados (`deletedCount`).
 * - **400 (Bad Request)**: Si no se proporciona ningún parámetro de filtrado.
 * - **404 (Not Found)**: Si no se encuentran medicamentos que coincidan con los filtros.
 * - **500 (Internal Server Error)**: Si ocurre un error inesperado durante la operación.
 */
export async function deleteMedication(req: Request, res: Response) {
  try {
    const { name, ingredient, code } = req.query;
    const filter: any = {};
    if (name) filter.name = { $regex: name, $options: 'i' };
    if (ingredient) filter.activeIngredient = { $regex: ingredient, $options: 'i' };
    if (code) filter.nationalCode = code;
    if (Object.keys(filter).length === 0) {
        return res.status(400).json({ error: 'A filter must be provided' });
    }
    const result = await Medication.deleteMany(filter);
    if (result.deletedCount === 0) {
        return res.status(404).json({ error: 'Medications were not found' });
    }
    return res.status(200).json(result);
  } catch (error : unknown) {
      return res.status(500).json({
        error: error instanceof Error ? error.message : 'Internal server error',
      });
  }
}
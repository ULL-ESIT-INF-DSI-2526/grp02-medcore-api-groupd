import { Request, Response } from 'express';
import { Medication } from '../../models/medications/medicationSchema.js';

/**
 * Controlador para buscar y leer medicamentos basados en filtros de consulta.
 * @param req - Objeto de petición de Express.
 *    - `req.query.name`: Nombre comercial del medicamento.
 *    - `req.query.ingredient`: Principio activo del medicamento.
 *    - `req.query.code`: Código nacional (búsqueda exacta).
 * @param res - Objeto de respuesta de Express.
 * 
 * @returns
 * - **200 (OK)**: Un array con los medicamentos que coinciden con los criterios.
 * - **400 (Bad Request)**: Si no se proporciona ningún parámetro de filtrado.
 * - **404 (Not Found)**: Si la búsqueda no devuelve ningún resultado.
 * - **500 (Internal Server Error)**: Si ocurre un error inesperado durante la consulta.
 */
export async function readMedications(req: Request, res: Response) {
  try {
    const { name, ingredient, code } = req.query;
    const filter: any = {};
    if (name) filter.name = { $regex: name, $options: 'i' };
    if (ingredient) filter.activeIngredient = { $regex: ingredient, $options: 'i' };
    if (code) filter.nationalCode = code;

    if (Object.keys(filter).length === 0) {
        return res.status(400).json({ error: 'A filter must be provided' });
    }

    const medications = await Medication.find(filter);
    if (medications.length === 0) {
      return res.status(404).json({ error: 'Search query did not match any medication' });
    }
    res.json(medications);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}
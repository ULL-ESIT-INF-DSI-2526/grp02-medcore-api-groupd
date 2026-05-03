import type { StaffFilter } from '../../models/staff/types/StaffFilter.js';
import { readStaff } from '../../services/staff/readStaff.js';

/**
 * Controlador para leer miembros del personal.
 * @param req - Request
 * @param res - Response
 * @returns Retorna una lista de miembros del personal que coinciden con los filtros aplicados.
 */
export async function readStaffController(req: any, res: any) {
  try {
    const { name, specialty, department } = req.query;

    const filter: StaffFilter = {};
    if (typeof name === 'string' && name.trim() !== '') {
      filter.name = name;
    }
    if (typeof specialty === 'string' && specialty.trim() !== '') {
      filter.speciality = specialty;
    }
    const result = await readStaff(filter);
    return res.status(200).json(result);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error:'Internal Server error' });
  }
}
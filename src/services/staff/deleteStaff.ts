import { Staff } from '../../models/staff/staffSchema.js';
import iStaff  from '../../models/staff/staffInterface.js';

/**
 * Elimina un miembro del personal basado en un filtro.
 * @param filter - Filtro para buscar el miembro del personal.
 * @returns Una promesa que resuelve con el resultado de la operación.
 */
export async function deleteStaff(filter : Partial<iStaff>) {
    try {
        const result = await Staff.findOneAndDelete(filter);
        return result;
    } catch (error) {
        throw error;
    }
}
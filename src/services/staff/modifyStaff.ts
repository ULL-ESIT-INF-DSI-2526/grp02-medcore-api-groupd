import { Staff } from '../../models/staff/staffSchema.js';
import iStaff  from '../../models/staff/staffInterface.js';
/**
 * Modifica un staff por un filtro.
 * @param filter - Filtro para buscar el staff a modificar.
 * @param staffData - Datos del staff a modificar.
 * @returns - Retorna el staff buscado por el filtro o el error que produzca la funcion findOneAndUpdate.
 */
export async function modifyStaff(filter : Partial<iStaff>, staffData : Partial<iStaff>) {
    try {
        const result = await Staff.findOneAndUpdate(filter, {$set: staffData}, { new: true });
        return result;
    }
    catch (error) {
        return error;
    }
}
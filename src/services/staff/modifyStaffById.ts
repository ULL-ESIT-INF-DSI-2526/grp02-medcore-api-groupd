import { Staff } from '../../models/staff/staffSchema.js';
import iStaff  from '../../models/staff/staffInterface.js';
/**
 * Modifica un staff por su id.
 * @param id - Id de la base de datos.
 * @param staffData - Datos del staff a modificar.
 * @returns - Retorna el staff buscado por id o el error que produzca la funcion findByIdAndUpdate.
 */
export async function modifyStaffById(id : string, staffData : Partial<iStaff>) {
    try {
        const result = await Staff.findByIdAndUpdate(id, {$set: staffData}, { new: true, runValidators: true });
        return result;
    }
    catch (error) {
        throw error;
    }
}
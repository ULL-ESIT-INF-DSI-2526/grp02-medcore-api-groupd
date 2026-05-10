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
    // Necesita runValidators para que se apliquen las validaciones del schema al actualizar por filtro, ya que por id se hace con findByIdAndUpdate y ahí sí se aplican las validaciones.
    const result = await Staff.findOneAndUpdate(filter, {$set: staffData}, { returnDocument: 'after', runValidators: true });
    return result;
    }
    catch (error) {
        throw error;
    }
}
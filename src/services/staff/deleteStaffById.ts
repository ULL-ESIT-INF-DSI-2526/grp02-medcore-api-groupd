import mongoose from "mongoose";
import { Staff } from "../../models/staff/staffSchema.js";

/**
 * Elimina un staff por su id.
 * @param id - Identificador del staff a eliminar.
 * @returns - Retorna el staff eliminado o el error que produzca la funcion findByIdAndDelete.
 */
export async function deleteStaffById(id : mongoose.Types.ObjectId) {
    try {
        const result = await Staff.findByIdAndDelete(id);
        return result;
    }
    catch (error) {
        throw error;
    }
}
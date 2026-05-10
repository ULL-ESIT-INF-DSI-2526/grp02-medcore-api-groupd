import {Staff} from '../../models/staff/staffSchema.js'
import StaffInterface from '../../models/staff/staffInterface.js';

/**
 * Crea un nuevo miembro del personal en la base de datos.
 * @param staff - Objeto que contiene la información del nuevo miembro del personal a crear.
 * @returns Retorna el nuevo miembro del personal creado o un error si ocurre algún problema durante la creación.
 */
export async function createNewStaff(staff : StaffInterface) {
    try{const newStaff = new Staff(staff);
        const data = await newStaff.save();
        return data;
    } catch (error) {
        throw error;
    }
}
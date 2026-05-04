import {Staff} from '../../models/staff/staffSchema.js'
import mongoose from 'mongoose';

/**
 * 
 * @param id - Identificador para la base de datos
 * @returns - Retorna o un error o el miembro del personal encontrado por su ID médico.
 */
export async function readStaffById(id: mongoose.Types.ObjectId) {
    try {
        const data = await Staff.findById(id);
        return data;
    } catch (error) {
        throw error;
    }
}
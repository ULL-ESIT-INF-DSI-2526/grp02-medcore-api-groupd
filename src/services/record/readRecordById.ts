import mongoose from 'mongoose';
import { Record } from '../../models/records/recordSchema.js';
/**
 * Servicio para leer un registro médico por su ID.
 * @param id - Objeto identificativo.
 * @return Retorna el registro médico correspondiente al ID proporcionado.
 * @throws Error si ocurre un problema durante la consulta.
 */
export async function readRecordById(id: mongoose.Types.ObjectId) {
    try {
        const record = await Record.findById(id);
        return record;
    } catch (error) {
        throw error;
    }
}
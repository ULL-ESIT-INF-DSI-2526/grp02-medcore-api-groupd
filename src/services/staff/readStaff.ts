import type { StaffFilter } from '../../models/staff/types/StaffFilter.js';
import {Staff} from '../../models/staff/staffSchema.js'

/**
 * ReadStaff es una función que se encarga de leer los datos del personal médico de la base de datos, utilizando un filtro opcional para buscar por nombre o especialidad.
 * @param filter - Filtro de tipo StaffFilter que contien los posibles query string que haya puesto el usuario.
 * @returns Puede retornar o error la data esperada.
 */
export async function readStaff(filter : StaffFilter) {
    try {
        const data = await Staff.find(filter);
        return data;
    }catch (error) {
        throw error;
    }
}
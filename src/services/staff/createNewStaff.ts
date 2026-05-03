import {Staff} from '../../models/staff/staffSchema.js'
import StaffInterface from '../../models/staff/staffInterface.js';

/**
 * 
 * @param staff 
 * @returns Falso en caso de 
 */
export async function createNewStaff(staff : StaffInterface) {
    const newStaff = new Staff(staff);
    const data = await newStaff.save();
    return data;
}
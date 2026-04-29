import {Staff} from '../../models/staff/staffSchema.js'
import StaffInterface from '../../models/staff/staffInterface.js';

/**
 * 
 * @param staff 
 * @returns Falso en caso de 
 */
export async function createNewStaff(staff : StaffInterface) {
   try {
    const newStaff = new Staff(staff);
    const data = await newStaff.save();
    return data;
   }
    catch (error) {
        return error;
    }
}
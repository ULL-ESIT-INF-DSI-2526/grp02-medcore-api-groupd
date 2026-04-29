import Staff from '../../models/staff/staffSchema.js'
import StaffInterface from '../../models/staff/staffInterface.js';

/**
 * 
 * @param staff 
 * @returns Falso en caso de 
 */
export async function createNewStaff(staff : StaffInterface) : Promise<boolean> {
    const data = await Staff.create(staff);
    if (!data) {
        return false;
    } else {
        return true;
    }
}
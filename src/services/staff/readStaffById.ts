import {Staff} from '../../models/staff/staffSchema.js'

export async function readStaffByMedicalId(id: string) {
    try {
        const staff = await Staff.findById(id);
        return staff;
    } catch (error) {
        throw new Error('Error reading staff by ID');
    }
}
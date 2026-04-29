import Staff from '../../models/staff/staffSchema.js'

export async function readStaffByMedicalLicenseNumber(medicalLicenseNumber: number) {
    try {
        const staff = await Staff.findOne({ medicalLicenseNumber });
        return staff;
    } catch (error) {
        throw new Error('Error reading staff by ID');
    }
}
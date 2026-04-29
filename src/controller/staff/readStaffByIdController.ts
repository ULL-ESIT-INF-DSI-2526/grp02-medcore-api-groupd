import { readStaffByMedicalLicenseNumber } from '../../services/staff/readStaffByMedicalLicenseNumber.js';

export async function readStaffByIdController(req : { params: { medicalLicenseNumber: string } }, res : any) {
    try {
        const { medicalLicenseNumber } = req.params;
        const staff = await readStaffByMedicalLicenseNumber(parseInt(medicalLicenseNumber));
        if (!staff) {
            return res.status(404).json({ error: 'Staff member not found' });
        }
        return res.status(200).json(staff);
    } catch (error) {
        return res.status(500).json({ error: 'Server error' });
    }
}
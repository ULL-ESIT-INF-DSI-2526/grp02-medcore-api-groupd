import { readStaffByMedicalId } from '../../services/staff/readStaffById.js';

export async function readStaffByIdController(req : { params: { id: string } }, res : any) {
    try {
        const { id } = req.params;
        const result = await readStaffByMedicalId(id);
        if (!result) {
            return res.status(404).json({ error: 'Staff member not found' });
        }
        return res.status(200).json(result);
    } catch (error) {
        return res.status(500).json({ error: 'Server error' });
    }
}
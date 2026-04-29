import { createNewStaff } from '../../services/staff/createNewStaff.js';
import StaffInterface from '../../models/staff/staffInterface.js';

/**
 * Controlador para crear un nuevo miembro del personal.
 * @param req Request de la API, se espera que el cuerpo de la solicitud contenga los datos del nuevo miembro del personal.
 * @param res 
 * @returns 
 */
export async function createStaffController(req : { body: StaffInterface }, res : any) {
    const data: StaffInterface = req.body;
    if (!data || Object.keys(data).length === 0) {
        return res.status(400).json({ error: 'No data provided' });
    }
    try {
        const result = await createNewStaff(data);
        if (!result) {
            return res.status(500).json({ error: 'Failed to create staff member' });
        }
        return res.status(201).json({ message: 'Staff member created successfully' });
    } catch (error) {
        return res.status(500).json({ error: 'Server error' });
    }
}
import iStaff  from '../../models/staff/staffInterface.js';
import { modifyStaffById } from '../../services/staff/modifyStaffById.js';

/**
 * Controlador para modificar un miembro del personal por su ID médico.
 * @param req - Request, se espera que los parámetros de la ruta contengan el ID del miembro del personal a modificar y el cuerpo de la solicitud contenga los datos a modificar.
 * @param res - Response
 * @returns Rerorna un error o el miembro del personal modificado por su ID médico.
 */
export async function modifyStaffByIdController(req : { params: { id: string }, body: Partial<iStaff> }, res : any) {
    try {
        const { id } = req.params;
        const staffData = req.body;
        const result = await modifyStaffById(id, staffData);
        if (!result) {
            return res.status(404).json({ error: 'Staff member not found' });
        }
        return res.status(200).json(result);
    } catch (error : unknown) {
        if (error instanceof Error) {
            return res.status(500).json({ error: error.message });
        }
        if (error instanceof Error) {
            return res.status(500).json({ error: error.message });
        }
    }
}
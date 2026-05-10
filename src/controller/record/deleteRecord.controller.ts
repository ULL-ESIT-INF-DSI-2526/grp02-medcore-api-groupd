import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { Record } from '../../models/records/recordSchema.js';
import { Medication } from '../../models/medications/medicationSchema.js';

/**
 * Función auxiliar para restaurar el stock de los medicamentos
 * antes de eliminar el registro.
 */
async function restoreMedicationStock(medicationList: any[]) {
  for (const item of medicationList) {
    const med = await Medication.findById(item.medication);
    
    if (med) {
      med.stock += item.amount;
      await med.save();
    }
  }
}

/**
 * Elimina un registro médico de la base de datos y restaura el inventario de medicamentos.
 * 
 * @remarks
 * Esta función no solo realiza una eliminación física del registro, sino que también
 * garantiza la integridad del inventario llamando a {@link restoreMedicationStock}.
 * Si el registro contiene medicamentos prescritos, las cantidades se suman de nuevo
 * al stock actual en la colección de medicamentos.
 * 
 * @param req - Objeto de petición de Express. Se espera que `req.params.id` contenga el ID del registro.
 * @param res - Objeto de respuesta de Express.
 * 
 * @returns 
 * - **200 (OK)**: Si el registro se eliminó y el stock se restauró correctamente.
 * - **400 (Bad Request)**: Si el formato del ID proporcionado no es un ObjectId de MongoDB válido.
 * - **404 (Not Found)**: Si no se encuentra ningún registro con el ID suministrado.
 * - **500 (Internal Server Error)**: Si ocurre un error inesperado durante el proceso.
 */
export async function deleteRecord(req: Request, res: Response) {
try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ error: 'ID de registro no válido' });
    }

    const record = await Record.findById(id); 

    if (!record) {
      return res.status(404).json({ error: 'Registro médico no encontrado' });
    }

    if (record.medicationList && record.medicationList.length > 0) {
      await restoreMedicationStock(record.medicationList);
    }

    await Record.findByIdAndDelete(id);

    return res.status(200).json({ message: 'Registro eliminado correctamente...' });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
}
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
 * Controlador para borrar un registro médico.
 * Implementa la reversion de stock de medicamentos.
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
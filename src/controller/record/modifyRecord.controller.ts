import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { Record } from '../../models/records/recordSchema.js';
import { Medication } from '../../models/medications/medicationSchema.js';

/**
 * Valida la disponibilidad de medicamentos, actualiza su stock y calcula el coste total.
 * @param newMeds - Array de objetos con la medicación (debe incluir `natCode`, `amount` e `instructions`).
 * @returns Un objeto que contiene la lista procesada con IDs de MongoDB y el coste total calculado.
 * @throws {Error} Si un medicamento no existe o si no hay stock suficiente.
 */
async function validateAndProcessNewMeds(newMeds: any[]) {
  let totalCost = 0;
  const processedList = [];

  for (const item of newMeds) {
    const med = await Medication.findOne({ natCode: item.natCode });
    if (!med) throw new Error(`Medicamento con codigo ${item.natCode} no encontrado`);
    if (med.stock < item.amount) throw new Error(`Stock insuficiente para el medicamento con codigo ${item.natCode}`);

    totalCost += med.price * item.amount;
    processedList.push({
      medication: med._id,
      amount: item.amount,
      instructions: item.instructions
    });
    med.stock -= item.amount;
    await med.save();
  }
  return { processedList, totalCost };
}

/**
 * Incrementa el stock de los medicamentos devueltos al sistema.
 * 
 * @remarks
 * Se utiliza al modificar o eliminar un registro para reintegrar las unidades 
 * que fueron previamente descontadas.
 * 
 * @param oldMedList - Lista de medicamentos del registro anterior (contiene referencias `_id` y cantidades).
 */
async function restoreOldStock(oldMedList: any[]) {
  for (const item of oldMedList) {
    const med = await Medication.findById(item.medication);
    if (med) {
      med.stock += item.amount;
      await med.save();
    }
  }
}

/**
 * Controlador para modificar un registro médico existente.
 * @param req - Objeto de petición de Express. `req.params.id` debe ser el ID del registro.
 * @param res - Objeto de respuesta de Express.
 * 
 * @returns
 * - **200**: Registro actualizado con éxito.
 * - **400**: Error en validación de ID o falta de stock en la nueva medicación.
 * - **404**: Registro no encontrado.
 * - **500**: Error interno del servidor.
 */
export async function modifyRecord(req: Request, res: Response) {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ error: 'ID de registro no valido' });
    }
    const oldRecord = await Record.findById(id);
    if (!oldRecord) {
      return res.status(404).json({ error: 'Registro no encontrado' });
    }

    if (req.body.medications) {
      await restoreOldStock(oldRecord.medicationList);
      try {
        const { processedList, totalCost } = await validateAndProcessNewMeds(req.body.medications);
        req.body.medicationList = processedList;
        req.body.totalPrice = totalCost;
      } catch (error: any) {
          const oldPopulated = await Record.findById(id).populate('medicationList.medication');

          if (oldPopulated) {
            const medicationsToReDeduct = oldPopulated.medicationList.map((m: any) => ({
              natCode: m.medication.natCode,
              amount: m.amount,
              instructions: m.instructions
            }));
            await validateAndProcessNewMeds(medicationsToReDeduct);
          }
          return res.status(400).json({ error: error.message });
      }
    }
    const updatedRecord = await Record.findByIdAndUpdate( id, req.body,
      { new: true, runValidators: true });
    return res.status(200).json(updatedRecord);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
}
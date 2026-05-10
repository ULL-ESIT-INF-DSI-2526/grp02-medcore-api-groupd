import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { Record } from '../../models/records/recordSchema.js';
import { Medication } from '../../models/medications/medicationSchema.js';

/**
 * Función auxiliar para procesar la nueva medicación:
 * Verifica existencia, stock y calcula el coste.
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
 * Función auxiliar para devolver el stock antiguo
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
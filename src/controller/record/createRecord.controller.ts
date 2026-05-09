import { Request, Response } from 'express';
import { Record } from '../../models/records/recordSchema.js';
import { Patient } from '../../models/patients/patientSchema.js';
import { Staff } from '../../models/staff/staffSchema.js';
import { Medication } from '../../models/medications/medicationSchema.js';
import { prescribedMed } from '../../models/records/prescibedMed.js';

interface medInfo {
  natCode: string;
  amount: number;
  instructions: string;
}

async function processMedication(medications: medInfo[]) {
  const processedMedications = [];
  const medsToSave = [];
  let totalCost = 0;

  for (const medication of medications) {
    const med = await Medication.findOne({ natCode: medication.natCode });
    if (!med) throw new Error(`NOT_FOUND_MED_${medication.natCode}`);

    if (med.expiration && new Date(med.expiration) < new Date()) {
      throw new Error(`EXPIRED_MED_${medication.natCode}`);
    }

    if (med.stock < medication.amount) {
      throw new Error(`INSUFFICIENT_STOCK_${medication.natCode}`);
    }

    totalCost += med.price * medication.amount;
    processedMedications.push({
      medication: med._id,
      amount: medication.amount,
      instructions: medication.instructions,
    });

    med.stock -= medication.amount;
    medsToSave.push(med);
  }

  for (const med of medsToSave) {
    await med.save();
  }

  return { processedMedications, totalCost };
}

export async function createRecord(req: Request, res: Response) {
  try {
    const patientDNI: string = req.body.idenNumber;
    const medNumber: number = req.body.medicalLicenseNumber;
    const medications: medInfo[] = req.body.medications;

    const patient = await Patient.findOne({ idenNumber: patientDNI });
    if (!patient) {
      return res.status(404).json({
        error: `El paciente con identificación ${patientDNI} no existe en la base de datos.`,
      });
    }

    if (patient.status === 'deceased') {
      return res.status(400).json({
        error: `El paciente con identificación ${patientDNI} está fallecido`,
      });
    }

    const doctor = await Staff.findOne({ medicalLicenseNumber: medNumber });
    if (!doctor) {
      return res.status(404).json({
        error: `El médico con número ${medNumber} no existe en la base de datos`,
      });
    }

    if (doctor.state === 'inactivo') {
      return res
        .status(400)
        .json({
          error: `El médico con número ${medNumber} no se encuentra activo`,
        });
    }

    let finalMedications: prescribedMed[] = [];
    let finalCost = 0;
    if (medications && medications.length > 0) {
      const medResult = await processMedication(medications);
      finalMedications = medResult.processedMedications;
      finalCost = medResult.totalCost;
    }

    const newRecord = await Record.create({
      patient: patient._id,
      doctor: doctor._id,
      regType: req.body.regType,
      admissionReason: req.body.admissionReason,
      diagnosis: req.body.diagnosis,
      medicationList: finalMedications,
      totalPrice: finalCost,
    });

    return res.status(201).json(newRecord);
  } catch (error) {
    if (error instanceof Error) {
      if (error.message.startsWith('NOT_FOUND_MED_')) {
        return res.status(404).json({
          error: `Medication not found: ${error.message.split('NOT_FOUND_MED_')[1]}`,
        });
      } else if (error.message.startsWith('EXPIRED_MED_')) {
        return res.status(400).json({
          error: `Medication expired: ${error.message.split('EXPIRED_MED_')[1]}`,
        });
      } else if (error.message.startsWith('INSUFFICIENT_STOCK_')) {
        return res.status(400).json({
          error: `Insufficient stock for medication: ${error.message.split('INSUFFICIENT_STOCK_')[1]}`,
        });
      } else {
        return res.status(500).json({ error: error.message });
      }
    } else {
      return res
        .status(500)
        .json({ error: 'Error interno del servidor desconocido' });
    }
  }
}

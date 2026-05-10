import { Request, Response } from 'express';
import { Record } from '../../models/records/recordSchema.js';
import { Patient } from '../../models/patients/patientSchema.js';
import { Staff } from '../../models/staff/staffSchema.js';
import { Medication } from '../../models/medications/medicationSchema.js';
import { prescribedMed } from '../../models/records/prescibedMed.js';

/**
 * Crea un nuevo registro médico para un paciente, asignado a un doctor específico,
 * con una lista opcional de medicamentos prescritos.
 */
interface medInfo {
  natCode: string;
  amount: number;
  instructions: string;
}

/**
 * Procesa la lista de medicamentos prescritos, verificando su existencia, validez y stock,
 * y calcula el costo total de los medicamentos. Si algún medicamento no es válido, está vencido o no tiene suficiente stock,
 * se lanzará un error específico.
 * @param medications - Lista de medicamentos a procesar, cada uno con su código nacional, cantidad e instrucciones.
 * @returns Objeto con los medicamentos procesados y el costo total.
 */
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

/**
 * Crea un nuevo registro médico para un paciente, asignado a un doctor específico,
 * con una lista opcional de medicamentos prescritos.
 * @param req - La solicitud HTTP que contiene los datos necesarios para crear el registro,
 *              incluyendo el DNI del paciente, número de licencia médica del doctor, tipo de registro,
 *              motivo de admisión, diagnóstico, lista de medicamentos, fecha de finalización y estado.
 * @param res - La respuesta HTTP que se enviará al cliente con el resultado de la operación,
 *              incluyendo el nuevo registro creado o un mensaje de error en caso de fallo.
 * @returns JSON con el nuevo registro creado o un mensaje de error en caso de fallo.
 *
 * @throws Error - Si ocurre un error inesperado durante la creación del registro, o si algún medicamento no es válido, está vencido o no tiene suficiente stock.
 *
 * Códigos de estado HTTP:
 * - 201: Registro creado exitosamente.
 * - 400: Formato de datos inválido o paciente/doctor no activo.
 * - 404: Paciente o doctor no encontrado, o medicamento no encontrado.
 * - 500: Error interno del servidor.
 */
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
      return res.status(400).json({
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
      endDate: req.body.endDate,
      status: req.body.status,
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
      } else if (error.name === 'ValidationError') {
        return res.status(400).json({ error: error.message });
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

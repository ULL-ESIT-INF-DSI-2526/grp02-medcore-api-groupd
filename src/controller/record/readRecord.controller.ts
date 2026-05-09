import { Request, Response } from 'express';
import { RecordFilter } from '../../models/records/types/recordFilter.js';
import { readRecords } from '../../services/record/readRecord.js';
import mongoose from 'mongoose';

/**
 * Controlador para leer registros médicos.
 * @param req - Request
 * @param res - Response
 * @returns Retorna una lista de registros que coinciden con los filtros aplicados.
 */
export async function readRecordsController(req: Request, res: Response) {
  try {
    const {patient, doctor} = req.query;
    const filter = {} as RecordFilter;
    if (typeof patient === 'string') filter.patient = patient;
    if (typeof doctor === 'string') filter.doctor = doctor;

    const result = await readRecords(filter);
    return res.status(200).json(result);
  } catch (error : unknown) {
    if (error instanceof mongoose.Error.ValidationError) {
      return res.status(400).json({ error: error.message });
    }
    if (error instanceof Error) {
      return res.status(500).json({ error: error.message });
    }
    return res.status(500).json({ error: 'Error reading records' });
  }
}
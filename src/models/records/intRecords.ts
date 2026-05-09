import mongoose from 'mongoose';
import { prescribedMed } from './prescibedMed.js';

export interface intRecords {
  patient: mongoose.Types.ObjectId;
  doctor: mongoose.Types.ObjectId;
  regType: 'ambulatory' | 'admission';
  startDate: Date;
  endDate?: Date;
  admissionReason: string;
  diagnosis: string;
  medicationList: prescribedMed[];
  totalPrice: number;
  status: 'open' | 'closed';
}

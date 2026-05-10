import { Schema, model } from 'mongoose';
import { intRecords } from './intRecords.js';

const recordSchema = new Schema({
  patient: {
    type: Schema.Types.ObjectId,
    ref: 'Patient',
    required: true,
  },
  doctor: {
    type: Schema.Types.ObjectId,
    ref: 'Staff',
    required: true,
  },
  regType: {
    type: String,
    enum: ['ambulatory', 'admission'],
    required: true,
  },
  startDate: {
    type: Date,
    default: Date.now,
    validate: {
      validator: (value: Date) => {
        if (!value) return true;
        return value <= new Date();
      },
      message: 'La fecha de inicio no puede ser una fecha en el futuro',
    },
  },
  endDate: {
    type: Date,
    validate: [
      {
        validator: (value: Date) => {
          if (!value) return true;
          return value <= new Date();
        },
        message: 'La fecha de finalización no puede ser en el futuro',
      },
      {
        validator: function (this: intRecords, value: Date) {
          if (!value || !this.startDate) return true;
          return value >= this.startDate;
        },
        message:
          'La fecha de finalización no puede ser anterior a la fecha de inicio',
      },
    ],
  },
  admissionReason: {
    type: String,
    required: true,
    trim: true,
  },
  diagnosis: {
    type: String,
    trim: true,
  },
  medicationList: [
    {
      medication: {
        type: Schema.Types.ObjectId,
        ref: 'Medication',
        required: true,
      },
      amount: {
        type: Number,
        required: true,
        min: 1,
      },
      instructions: {
        type: String,
        required: true,
        trim: true,
      },
    },
  ],
  totalPrice: {
    type: Number,
    min: 0,
    required: true,
  },
  status: {
    type: String,
    enum: ['open', 'closed'],
    default: 'open',
    validate: {
      validator: function (this: intRecords, value: string) {
        if (value === 'closed' && !this.endDate) {
          return false;
        }
        return true;
      },
      message: 'Un registro cerrado debe tener una fecha de finalización',
    },
  },
});

export const Record = model<intRecords>('Record', recordSchema);

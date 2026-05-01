import { Schema, model } from 'mongoose';
import validator from 'validator';
import { IntMedication } from './IntMedication.js';

const medicationSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    validate: {
      validator: (value: string) => {
        return (value.length >= 2);
      },
      message: 'El nombre comercial no cumple con la longitud minima',
    },
  },
  activeIngredient: {
    type: String,
    required: true,
    trim: true,
    validate: {
      validator: (value: string) => {
        return (value.length >= 2);
      },
      message: 'El principio activo no cumple con la longitud minima',
    },
  },
  natCode: {
    type: Number,
    required: true,
    unique: true,
    validate: {
      validator: (value: number) => {
        return (value >= 0 && value.toString().length === 6);
      },
      message: `El codigo nacional debe ser de 6 digitos`,
    },
  },
  pharmaForm: {
    type: String,
    required: true,
    enum: ['tablet', 'capsule', 'oral solution', 'injectable solution', 'ointment', 'transdermal patch', 'inhaler', 'other'],
  },
  standardDose: {
    amount: {
      type: Number,
      required: true,
    },
    unit: {
      type: String,
      required: true,
      enum: ['kg', 'hg', 'dag', 'g', 'dg', 'cg', 'mg'],
      default: 'mg',
    },
  },
  routeofAdministration: {
    type: String,
    required: true,
    enum: ['oral', 'intravenous', 'intramuscular', 'subcutaneous', 'topical', 'inhalation'],
  },
  stock: {
    type: Number,
    required: true,
    validate: {
      validator: (value: number) => {
        return (value >= 0 && Number.isInteger(value));
      },
      message: 'El stock ha de ser un entero no negativo',
    },
  },
  price: {
    type: Number,
    required: true,
    validate: {
      validator: (value: number) => {
        return (value > 0);
      },
      message: 'El precio ha de ser positivo',
    },
  },
  prescription: {
    type: Boolean,
  },
  expiration: {
    type: Date,
  },
  contraindications: {
    type: [{
      type: String,
      trim: true,
    }],
    required: true,
    default: [],
  }
})

export const Medication = model<IntMedication>('Medication', medicationSchema);
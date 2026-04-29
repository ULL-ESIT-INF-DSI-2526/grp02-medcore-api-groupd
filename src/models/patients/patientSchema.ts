import { Schema, model } from 'mongoose';
import validator from 'validator';
import { IntPatient } from './IntPatient.js';

const patientSchema = new Schema({
  idenNumber: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: (value: string) => {
        return (
          validator.isIdentityCard(value, 'ES') ||
          validator.isPassportNumber(value, 'ES')
        );
      },
      message: 'El documento introcudido no es un documento valido (DNI o NIE)',
    },
  },
  name: {
    type: String,
    required: true,
    trim: true,
    validate: {
      validator: (value: string) => {
        return validator.isAlpha(value, 'es-ES', { ignore: " '-" });
      },
      message: 'El nombre solo puede contener letras',
    },
  },
  birthDate: {
    type: Date,
    required: true,
  },
  SSId: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: (value: string) =>
        validator.isNumeric(value, { no_symbols: true }),
      message: 'El número de la Seguridad Social solo puede contener números',
    },
  },
  gender: {
    type: String,
    default: 'other',
    enum: ['male', 'female', 'other'],
  },
  contactData: {
    address: {
      type: String,
      required: true,
      trim: true,
    },
    phoneNumber: {
      type: String,
      required: true,
      trim: true,
      validate: {
        validator: (value: string) => {
          return validator.isMobilePhone(value, 'es-ES');
        },
        message: 'El número de telefono proporcionado no es correcto',
      },
    },
    email: {
      type: String,
      required: true,
      trim: true,
      validate: {
        validator: (value: string) => {
          return validator.isEmail(value);
        },
        message: 'La dirección de correo no es valida',
      },
    },
  },
  knownAllergies: {
    type: [
      {
        type: String,
        trim: true,
        lowercase: true,
      },
    ],
    required: true,
    default: [],
  },
  bloodType: {
    type: String,
    required: true,
    enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', '0+', '0-'],
  },
  status: {
    type: String,
    required: true,
    enum: ['active', 'temporary leave', 'deceased'],
    default: 'active',
  },
  emergencyContact: {
    name: {
      type: String,
      trim: true,
      validate: {
        validator: (value: string) => {
          return validator.isAlpha(value, 'es-ES', { ignore: ' ' });
        },
        message: 'El nombre solo puede contener letras',
      },
    },
    phoneNumber: {
      type: String,
      trim: true,
      validate: {
        validator: (value: string) => {
          return validator.isMobilePhone(value, 'es-ES');
        },
        message: 'El número de telefono proporcionado no es correcto',
      },
    },
    relationship: {
      type: String,
      trim: true,
      enum: ['parent', 'partner', 'family member', 'legal guardian'],
    },
  },
  isCronic: {
    type: Boolean,
  },
  lastVisit: {
    type: Date,
    validate: {
      validator: (value: Date) => {
        if (!value) return true;
        return value <= new Date();
      },
      message:
        'La fecha de la última visita no puede ser una fecha en el futuro',
    },
  },
});

export const Patient = model<IntPatient>('Patient', patientSchema);

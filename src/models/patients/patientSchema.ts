import { Schema, model } from 'mongoose';
import validator from 'validator';
import { IntPatient } from './IntPatient.js';

/**
 * Esquema para el modelo de paciente, con validaciones específicas para cada campo,
 * como la validación de documentos de identidad, números de teléfono y correos electrónicos.
 * Además, se incluyen campos para alergias conocidas, tipo de sangre, estado del paciente y contacto de emergencia.
 *
 * Campos:
 * - idenNumber: Número de identificación (DNI o NIE) del paciente, único y obligatorio.
 * - name: Nombre del paciente, obligatorio y solo puede contener letras.
 * - birthDate: Fecha de nacimiento del paciente, obligatoria.
 * - SSId: Número de la Seguridad Social del paciente, único y obligatorio.
 * - gender: Género del paciente, con opciones limitadas a 'male', 'female' y 'other'.
 * - contactData: Datos de contacto del paciente, incluyendo dirección, número de teléfono y correo electrónico, todos obligatorios.
 * - knownAllergies: Lista de alergias conocidas del paciente, con validación para asegurar que solo contengan texto.
 * - bloodType: Tipo de sangre del paciente, con opciones limitadas a los tipos sanguíneos comunes.
 * - status: Estado del paciente, con opciones limitadas a 'active', 'temporary leave' y 'deceased'.
 * - emergencyContact: Información de contacto de emergencia, incluyendo nombre, número de teléfono y relación con el paciente.
 * - isCronic: Indica si el paciente tiene una condición crónica.
 * - lastVisit: Fecha de la última visita del paciente, con validación para asegurar que no sea una fecha futura.
 *
 * Validaciones:
 * - idenNumber: Debe ser un DNI o NIE válido para España.
 * - name: Solo puede contener letras, espacios, apóstrofes y guiones.
 * - SSId: Solo puede contener números.
 * - contactData.phoneNumber: Debe ser un número de teléfono móvil válido para España.
 * - contactData.email: Debe ser una dirección de correo electrónico válida.
 * - knownAllergies: Cada alergia debe ser una cadena de texto sin caracteres especiales.
 * - bloodType: Debe ser uno de los tipos sanguíneos válidos.
 * - status: Debe ser uno de los estados válidos del paciente.
 * - emergencyContact.name: Solo puede contener letras y espacios.
 * - emergencyContact.phoneNumber: Debe ser un número de teléfono móvil válido para España.
 * - lastVisit: No puede ser una fecha en el futuro.
 *
 * Este esquema proporciona una estructura robusta para almacenar información de pacientes en una base de datos MongoDB,
 * asegurando la integridad y validez de los datos a través de las validaciones implementadas.
 */
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
      message: 'El documento introducido no es un documento valido (DNI o NIE)',
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

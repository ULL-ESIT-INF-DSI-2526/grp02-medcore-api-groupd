import { BloodType } from './bloodType.js';
import { ContactData, EmergencyContact } from './contactData.js';

/**
 * Interfaz que representa un paciente en el sistema. Contiene información personal,
 * datos de contacto, alergias conocidas, tipo de sangre, estado del paciente y contactos de emergencia.
 */
export interface IntPatient {
  idenNumber: string;
  name: string;
  birthDate: Date;
  SSId: string;
  gender: 'male' | 'female' | 'other';
  contactData: ContactData;
  knownAllergies: string[];
  bloodType: BloodType;
  status: 'active' | 'temporary leave' | 'deceased';
  emergencyContact?: EmergencyContact;
  isChronic?: boolean;
  lastVisit?: Date;
}

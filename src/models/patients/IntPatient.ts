import { BloodType } from './bloodType.js';
import { ContactData, EmergencyContact } from './contactData.js';

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

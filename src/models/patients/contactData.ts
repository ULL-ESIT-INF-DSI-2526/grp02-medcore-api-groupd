type Relationship = 'parent' | 'partner' | 'family member' | 'legal guardian';

/**
 * Interfaz que representa los datos de contacto de un paciente,
 * incluyendo dirección, número de teléfono y correo electrónico.
 */
export interface ContactData {
  address: string;
  phoneNumber: string;
  email: string;
}

/**
 * Interfaz que representa un contacto de emergencia para un paciente,
 * incluyendo nombre, número de teléfono y relación con el paciente.
 */
export interface EmergencyContact {
  name?: string;
  phoneNumber: string;
  relationship: Relationship;
}

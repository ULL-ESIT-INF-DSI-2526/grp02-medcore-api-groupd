type Relationship = 'parent' | 'partner' | 'family member' | 'legal guardian';

export interface ContactData {
  address: string;
  phoneNumber: string;
  email: string;
}

export interface EmergencyContact {
  name?: string;
  phoneNumber: string;
  relationship: Relationship;
}

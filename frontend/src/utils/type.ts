interface Address {
  building: string;
  street: string;
  city: string;
  state: string;
  zip: string;
}

interface Phone {
  cellPhone: string;
  workPhone: string;
}

interface WorkAuthorization {
  visaType: 'Green Card' | 'Citizen' | 'H1-B' | 'L2' | 'F1' | 'H4' | 'Other';
  startDate: string; // ISO format date
  endDate: string; // ISO format date
  files: string[];
}

interface Reference {
  firstName: string;
  lastName: string;
  middleName?: string;
  phone: string;
  email: string;
  relationship: string;
}

interface EmergencyContact {
  firstName: string;
  lastName: string;
  middleName?: string;
  phone: string;
  email: string;
  relationship: string;
}

export interface Employee {
  _id: string;
  firstName: string;
  lastName: string;
  middleName?: string;
  preferredName?: string;
  email: string;
  profilePicture?: string;
  address: Address;
  phone: Phone;
  ssn?: string;
  dateOfBirth?: string; // ISO format date
  gender: 'male' | 'female' | 'i do not wish to answer';
  visaStatus: 'Pending' | 'Approved' | 'Rejected';
  workAuthorization: WorkAuthorization;
  reference?: Reference;
  emergencyContacts: EmergencyContact[];
  registrationTokens?: string[]; // Array of registration token IDs
  userId: string;
  createdAt?: string; // ISO format date
  updatedAt?: string; // ISO format date
}

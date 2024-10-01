import mongoose from 'mongoose';

const employeeSchema = new mongoose.Schema({
  firstName: { type: String },
  lastName: { type: String },
  middleName: { type: String },
  preferredName: { type: String },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  profilePicture: { type: String, default: 'default-profile.png' },
  address: {
    building: { type: String },
    street: { type: String },
    city: { type: String },
    state: { type: String },
    zip: { type: String },
  },
  phone: {
    cellPhone: { type: String },
    workPhone: { type: String },
  },
  ssn: { type: String },
  dateOfBirth: { type: Date },
  gender: { type: String, enum: ['male', 'female', 'i do not wish to answer'] },
  visaStatus: {
    type: String,
    enum: ['Pending', 'Approved', 'Rejected'],
    default: 'Pending',
  },
  workAuthorization: {
    visaType: { type: String, enum: ['H1-B', 'L2', 'F1(CPT/OPT)', 'H4', 'Other'] },
    optReceipt: { type: String },
    startDate: { type: Date },
    endDate: { type: Date },
  },
  references: [{
    firstName: { type: String },
    lastName: { type: String },
    middleName: { type: String },
    phone: { type: String },
    email: { type: String },
    relationship: { type: String },
  }],
  emergencyContacts: [{
    firstName: { type: String },
    lastName: { type: String },
    middleName: { type: String },
    phone: { type: String },
    email: { type: String },
    relationship: { type: String },
  }],
  documents: {
    profilePicture: { type: String },
    driverLicense: { type: String },
    workAuthorization: { type: String },
  },
  registrationTokens: [{ type: mongoose.Schema.Types.ObjectId, ref: 'RegistrationToken' }],
}, { timestamps: true });

const Employee = mongoose.model('Employee', employeeSchema);
export default Employee;

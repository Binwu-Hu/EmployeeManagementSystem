import mongoose from 'mongoose';

const registrationTokenSchema = new mongoose.Schema({
  token: { type: String, required: true, unique: true },
  email: { type: String, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  expiresAt: { type: Date, required: true },
}, { timestamps: true });

const RegistrationToken = mongoose.model('RegistrationToken', registrationTokenSchema);
export default RegistrationToken;
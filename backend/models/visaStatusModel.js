import mongoose from 'mongoose';

const visaStatusSchema = new mongoose.Schema({
  employee: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee', required: true },
  visaType: { type: String, required: true },
  optReceipt: {
    files: [{ type: String }], // Array to hold multiple file paths
    status: { type: String, enum: ['Unsubmitted', 'Pending', 'Approved', 'Rejected'], default: 'Unsubmitted' }, 
    feedback: { type: String }, // HR feedback when rejected
  },
  optEAD: {
    files: [{ type: String }],
    status: { type: String, enum: ['Unsubmitted', 'Pending', 'Approved', 'Rejected'], default: 'Unsubmitted' },
    feedback: { type: String }, // HR feedback when rejected
  },
  i983Form: {
    files: [{ type: String }],
    status: { type: String, enum: ['Unsubmitted', 'Pending', 'Approved', 'Rejected'], default: 'Unsubmitted' },
    feedback: { type: String }, // HR feedback when rejected
  },
  i20Form: {
    files: [{ type: String }],
    status: { type: String, enum: ['Unsubmitted', 'Pending', 'Approved', 'Rejected'], default: 'Unsubmitted' },
    feedback: { type: String }, // HR feedback when rejected
  },
}, { timestamps: true });

const VisaStatus = mongoose.model('VisaStatus', visaStatusSchema);
export default VisaStatus;
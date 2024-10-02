import mongoose from 'mongoose';

const visaStatusSchema = new mongoose.Schema({
  employee: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee', required: true },
  visaType: { type: String, enum: ['OPT', 'H1-B', 'L2', 'F1', 'Other'], required: true },
  optReceipt: {
    files: [{ type: String }], // Array to hold multiple file paths
    status: { type: String, enum: ['Pending', 'Approved', 'Rejected'], default: 'Pending' }, 
  },
  optEAD: {
    files: [{ type: String }],
    status: { type: String, enum: ['Pending', 'Approved', 'Rejected'], default: 'Pending' },
  },
  i983Form: {
    files: [{ type: String }],
    status: { type: String, enum: ['Pending', 'Approved', 'Rejected'], default: 'Pending' },
  },
  i20Form: {
    files: [{ type: String }],
    status: { type: String, enum: ['Pending', 'Approved', 'Rejected'], default: 'Pending' },
  },
}, { timestamps: true });

const VisaStatus = mongoose.model('VisaStatus', visaStatusSchema);
export default VisaStatus;
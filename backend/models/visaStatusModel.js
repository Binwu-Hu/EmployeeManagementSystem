import mongoose from 'mongoose';

const visaStatusSchema = new mongoose.Schema({
  employee: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee', required: true },
  visaType: { type: String, enum: ['OPT', 'H1-B', 'L2', 'F1', 'Other'], required: true },
  optReceipt: {
    file: { type: String }, // ['file1','file2','file3'] -> ['file1','file2','file3'] -> ['file1','file2','file4']
    status: { type: String, enum: ['Pending', 'Approved', 'Rejected'], default: 'Pending' }, 
  },
  optEAD: {
    file: { type: String },
    status: { type: String, enum: ['Pending', 'Approved', 'Rejected'], default: 'Pending' },
  },
  i983Form: {
    file: { type: String },
    status: { type: String, enum: ['Pending', 'Approved', 'Rejected'], default: 'Pending' },
  },
  i20Form: {
    file: { type: String },
    status: { type: String, enum: ['Pending', 'Approved', 'Rejected'], default: 'Pending' },
  },
}, { timestamps: true });

const VisaStatus = mongoose.model('VisaStatus', visaStatusSchema);
export default VisaStatus;
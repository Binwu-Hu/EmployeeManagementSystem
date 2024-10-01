import mongoose from 'mongoose';

const applicationSchema = new mongoose.Schema(
  {
    employee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Employee',
      required: true,
    },
    status: {
      type: String,
      enum: ['Pending', 'Approved', 'Rejected'],
      default: 'Pending',
    },
    feedback: { type: String },
    documents: [
      {
        name: { type: String },
        url: { type: String },
      },
    ],
    submittedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const Application = mongoose.model('Application', applicationSchema);
export default Application;

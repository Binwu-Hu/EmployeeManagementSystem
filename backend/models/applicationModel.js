import mongoose from 'mongoose';

const applicationSchema = new mongoose.Schema(
  {
    // employee: {
    //   type: mongoose.Schema.Types.ObjectId,
    //   ref: 'Employee',
    //   required: true,
    // },
    email: {
      type: String,
      required: true,
    },
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    address: {
      building: { type: String, required: true },
      street: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      zip: { type: String, required: true },
    },
    phone: {
      cellPhone: { type: String, required: true },
      workPhone: { type: String },
    },
    ssn: {
      type: String,
      required: true,
    },
    dateOfBirth: {
      type: Date,
      required: true,
    },
    gender: {
      type: String,
      enum: ['male', 'female', 'i do not wish to answer'],
      required: true,
    },
    middleName: { type: String },
    preferredName: { type: String },
    documents: {
      profilePicture: { type: String },
      driverLicense: { type: String },
      workAuthorization: { type: String },
    },
    reference: {
      firstName: { type: String, required: true },
      lastName: { type: String, required: true },
      relationship: { type: String, required: true },
      middleName: { type: String },
      phone: { type: String },
      email: { type: String },
    },
    emergencyContacts: [
      {
        firstName: { type: String, required: true },
        lastName: { type: String, required: true },
        relationship: { type: String, required: true },
        middleName: { type: String },
        phone: { type: String },
        email: { type: String },
      },
    ],

    status: {
      type: String,
      enum: ['Pending', 'Approved', 'Rejected'],
      default: 'Pending',
      required: true,
    },
    feedback: { type: String },
    // documents: [
    //   {
    //     name: { type: String },
    //     url: { type: String },
    //   },
    // ],
    submittedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const Application = mongoose.model('Application', applicationSchema);
export default Application;

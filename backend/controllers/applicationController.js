import Application from '../models/applicationModel';
import Employee from '../models/employeeModel';
import asyncHandler from 'express-async-handler';
import mongoose from 'mongoose';

// @desc    Create application
// @route   POST /api/application
const createApplication = asyncHandler(async (req, res) => {
  const { gender, documents } = req.body;

  const application = new Application({
    email: req.employee.email,
    employee: req.employee._id,
    firstName: req.employee.firstName,
    lastName: req.employee.lastName,
    middleName: req.employee.middleName,
    preferredName: req.employee.preferredName,
    profilePicture: req.employee.profilePicture,
    address: {
      building: req.employee.address.building,
      street: req.employee.address.street,
      city: req.employee.address.city,
      state: req.employee.address.state,
      zip: req.employee.address.zip,
    },
    phone: {
      cellPhone: req.employee.cellPhone,
      workPhone: req.employee.workPhone,
    },
    ssn: req.employee.ssn,
    dateOfBirth: req.employee.dateOfBirth,

    gender,
    status: 'Pending',
    feedback: '',
    documents,
  });

  const createdApplication = await application.save();
  res.status(201).json(createdApplication);
});

// @desc    get application info
// @route   GET /api/application/:id
const getApplicationStatus = asyncHandler(async (req, res) => {
  const employeeId = req.params.id;
  const application = await Application.findOne({ employee: employeeId });

  if (!application) {
    // i. Never submitted: they need to fill out and submit the application for the first time
    res
      .status(200)
      .json({ message: 'Please fill in the application fields and submit.' });
  } else {
    switch (application.status) {
      case 'Rejected':
        // ii. Rejected: they can view feedback, make changes, and resubmit
        res.status(200).json({
          message:
            'Your application was rejected. Please review the feedback, make changes, and resubmit.',
          feedback: application.feedback,
          application: application, // Allow user to edit and resubmit
        });
        break;

      case 'Pending':
        // iii. Pending: they can view the submitted application (not editable) and list of uploaded documents
        const documents = application.documents.map((doc) => ({
          name: doc.name,
          url: doc.url, // Assuming document URLs are stored
          downloadLink: `${doc.url}/download`, // Provide download link
          previewLink: `${doc.url}/preview`, // Provide preview link
        }));

        res.status(200).json({
          message: 'Please wait for HR to review your application.',
          application: application, // Application is not editable
          documents: documents, // List of documents with download and preview options
        });
        break;

      case 'Approved':
        // iv. Approved: they should be redirected to the home page
        res.status(200).json({
          message:
            'Your application has been approved. Redirecting to the home page...',
          redirectTo: '/home',
        });
        break;

      default:
        res.status(400).json({ message: 'Invalid application status.' });
        break;
    }
  }
});

// @desc    update application by employee
// @route   PUT /api/application/:id
const updateApplication = asyncHandler(async (req, res) => {
  const employeeId = req.params.id;
  const { gender, documents } = req.body;

  const application = await Application.findOne({ employee: employeeId });

  if (!application) {
    return res.status(404).json({ message: 'Application not found' });
  }

  // Check if the application status is 'Rejected'
  if (application.status !== 'Rejected') {
    return res.status(400).json({
      message: 'Only rejected applications can be updated and resubmitted.',
    });
  }

  application.gender = gender || application.gender;
  application.documents = documents || application.documents;
  application.status = 'Pending';
  application.feedback = '';

  const updatedApplication = await application.save();

  res.status(200).json({
    message:
      'Application updated and resubmitted successfully. Please wait for HR to review again.',
    application: updatedApplication,
  });
});

// @desc    update application by HR
// @route   PUT /api/application
const updateApplicationStatus = asyncHandler(async (req, res) => {
  const { employeeId, status, feedback } = req.body;

  // Check if the provided status is either 'Approved' or 'Rejected'
  if (!['Approved', 'Rejected'].includes(status)) {
    return res.status(400).json({
      message:
        "Invalid status. Status must be either 'Approved' or 'Rejected'.",
    });
  }

  if (!mongoose.Types.ObjectId.isValid(employeeId)) {
    return res.status(400).json({ message: 'Invalid employee ID format.' });
  }

  const application = await Application.findOne({
    employee: mongoose.Types.ObjectId(employeeId),
  });

  if (!application) {
    return res.status(404).json({ message: 'Application not found' });
  }

  // Ensure the application is currently pending before updating
  if (application.status !== 'Pending') {
    return res.status(400).json({
      message:
        'Only pending applications can be updated to approved or rejected.',
    });
  }

  // Update the application status and feedback if provided
  application.status = status;
  if (status === 'Rejected' && feedback) {
    application.feedback = feedback; // Only add feedback if the application is rejected
  } else {
    application.feedback = ''; // Clear feedback if approved
  }

  // Save the updated application
  const updatedApplication = await application.save();

  res.status(200).json({
    message: `Application has been ${status.toLowerCase()} successfully.`,
    application: updatedApplication,
  });
});

// @desc    get all applications for HR
// @route   Get /api/applications
const getAllApplications = asyncHandler(async (req, res) => {
  // Get all pending applications
  const pendingApplications = await Application.find({ status: 'Pending' })
    .populate('employee', 'firstName lastName email')
    .select('firstName lastName email');

  // Get all rejected applications
  const rejectedApplications = await Application.find({ status: 'Rejected' })
    .populate('employee', 'firstName lastName email')
    .select('firstName lastName email feedback');

  // Get all approved applications
  const approvedApplications = await Application.find({ status: 'Approved' })
    .populate('employee', 'firstName lastName email')
    .select('firstName lastName email');

  res.status(200).json({
    pending: pendingApplications.map((app) => ({
      fullName: `${app.firstName} ${app.lastName}`,
      email: app.employee.email,
      viewApplicationLink: `/api/application/${app._id}`,
      actions: {
        approve: true, // HR can approve pending applications
        reject: true, // HR can reject pending applications
        feedback: true, // HR can provide feedback on rejected applications
      },
    })),
    rejected: rejectedApplications.map((app) => ({
      fullName: `${app.firstName} ${app.lastName}`,
      email: app.employee.email,
      feedback: app.feedback, // HR can view feedback provided during rejection
      viewApplicationLink: `/api/application/${app._id}`,
      actions: {
        approve: false,
        reject: false,
        feedback: false, // No actions for rejected applications
      },
    })),
    approved: approvedApplications.map((app) => ({
      fullName: `${app.firstName} ${app.lastName}`,
      email: app.employee.email,
      viewApplicationLink: `/api/application/${app._id}`,
      actions: {
        approve: false, // No actions for approved applications
        reject: false,
        feedback: false,
      },
    })),
  });
});

// @desc    Get application by employee id
// @route   GET /api/application/:id/view
const getApplicationById = asyncHandler(async (req, res) => {
  const { employeeId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(employeeId)) {
    return res.status(400).json({ message: 'Invalid employee ID format.' });
  }

  // Find application by employee id
  const application = await Application.findOne({
    employee: mongoose.Types.ObjectId(employeeId),
  });

  if (!application) {
    return res.status(404).json({ message: 'Application not found.' });
  }

  // Find employee by employee ID
  const employee = await Employee.findById(employeeId);

  if (!employee) {
    return res.status(404).json({ message: 'Employee not found.' });
  }

  // Combine application data with employee information and return
  res.status(200).json({
    message: 'Application and employee data found successfully.',
    employee: {
      email: employee.email,
      firstName: employee.firstName,
      lastName: employee.lastName,
      middleName: employee.middleName,
      preferredName: employee.preferredName,
      profilePicture: employee.profilePicture,
      address: {
        building: employee.address.building,
        street: employee.address.street,
        city: employee.address.city,
        state: employee.address.state,
        zip: employee.address.zip,
      },
      phone: {
        cellPhone: employee.cellPhone,
        workPhone: employee.workPhone,
      },
      ssn: employee.ssn,
      dateOfBirth: employee.dateOfBirth,
    },
    application,
  });
});

export {
  createApplication,
  getApplicationStatus,
  updateApplication,
  updateApplicationStatus,
  getAllApplications,
  getApplicationById,
};

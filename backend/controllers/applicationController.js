import Application from '../models/applicationModel.js';
import Employee from '../models/employeeModel.js';
import User from '../models/userModel.js';
import asyncHandler from 'express-async-handler';
import mongoose from 'mongoose';

// @desc    Create application
// @route   POST /api/application
const createApplication = asyncHandler(async (req, res) => {
  const { email } = req.user;

  const employee = await Employee.findOne({ email });

  if (!employee) {
    return res.status(404).json({ message: 'Employee not found.' });
  }

  // Check if an application already exists for this email
  const existingApplication = await Application.findOne({
    email: employee.email,
  });

  if (existingApplication) {
    return res
      .status(400)
      .json({ message: 'Application already exists for this email.' });
  }

  // Ensure all required fields are present
  if (
    !employee.address?.building ||
    !employee.address?.street ||
    !employee.address?.city ||
    !employee.address?.state ||
    !employee.address?.zip ||
    !employee.phone?.cellPhone ||
    !employee.ssn ||
    !employee.dateOfBirth ||
    !employee.gender ||
    !employee.reference?.firstName ||
    !employee.reference?.lastName ||
    !employee.reference?.relationship ||
    !employee.emergencyContacts?.length ||
    !employee.emergencyContacts[0]?.firstName ||
    !employee.emergencyContacts[0]?.lastName ||
    !employee.emergencyContacts[0]?.relationship
  ) {
    return res
      .status(400)
      .json({ message: 'Missing required employee information.' });
  }

  const application = new Application({
    email: employee.email,
    firstName: employee.firstName,
    lastName: employee.lastName,
    address: {
      building: employee.address.building,
      street: employee.address.street,
      city: employee.address.city,
      state: employee.address.state,
      zip: employee.address.zip,
    },
    phone: {
      cellPhone: employee.phone.cellPhone,

      ...(employee.phone.workPhone && { workPhone: employee.phone.workPhone }),
    },
    ssn: employee.ssn,
    dateOfBirth: employee.dateOfBirth,
    gender: employee.gender,

    ...(employee.middleName && { middleName: employee.middleName }),
    ...(employee.preferredName && { preferredName: employee.preferredName }),
    ...(employee.documents && {
      documents: {
        ...(employee.documents?.profilePicture && {
          profilePicture: employee.documents.profilePicture,
        }),
        ...(employee.documents?.driverLicense && {
          driverLicense: employee.documents.driverLicense,
        }),
        ...(employee.documents?.workAuthorization && {
          workAuthorization: employee.documents.workAuthorization,
        }),
      },
    }),

    reference: {
      firstName: employee.reference.firstName,
      lastName: employee.reference.lastName,
      relationship: employee.reference.relationship,

      ...(employee.reference.middleName && {
        middleName: employee.reference.middleName,
      }),
      ...(employee.reference.phone && {
        phone: employee.reference.phone,
      }),
      ...(employee.reference.email && {
        email: employee.reference.email,
      }),
    },

    emergencyContacts: employee.emergencyContacts.map((contact) => ({
      firstName: contact.firstName,
      lastName: contact.lastName,
      relationship: contact.relationship,

      ...(contact.middleName && { middleName: contact.middleName }),
      ...(contact.phone && { phone: contact.phone }),
      ...(contact.email && { email: contact.email }),
    })),

    status: 'Pending',
    feedback: '',
  });

  await application.save();

  res.status(201).json({
    message: 'Application created successfully.',
    application,
  });
});

// @desc    get application info
// @route   GET /api/application
const getApplicationStatus = asyncHandler(async (req, res) => {
  const { email } = req.user;

  const application = await Application.findOne({ email });

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

        res.status(200).json({
          message: 'Please wait for HR to review your application.',
          application: application, // Application is not editable
        });
        break;

      case 'Approved':
        // iv. Approved: they should be redirected to the home page
        res.status(200).json({
          message:
            'Your application has been approved. Redirecting to the home page...',
        });
        break;

      default:
        res.status(400).json({ message: 'Invalid application status.' });
        break;
    }
  }
});

// @desc    update application by employee
// @route   PUT /api/application
const updateApplication = asyncHandler(async (req, res) => {
  const { email } = req.user;

  const employee = await Employee.findOne({ email });

  if (!employee) {
    return res.status(404).json({ message: 'Employee not found.' });
  }

  const application = await Application.findOne({ email: employee.email });

  if (!application) {
    return res.status(404).json({ message: 'Application not found.' });
  }

  if (application.status !== 'Rejected') {
    return res.status(400).json({
      message: 'You can only update the application if it was rejected.',
    });
  }

  if (
    !employee.address?.building ||
    !employee.address?.street ||
    !employee.address?.city ||
    !employee.address?.state ||
    !employee.address?.zip ||
    !employee.phone?.cellPhone ||
    !employee.ssn ||
    !employee.dateOfBirth ||
    !employee.gender ||
    !employee.reference?.firstName ||
    !employee.reference?.lastName ||
    !employee.reference?.relationship ||
    !employee.emergencyContacts?.length ||
    !employee.emergencyContacts[0]?.firstName ||
    !employee.emergencyContacts[0]?.lastName ||
    !employee.emergencyContacts[0]?.relationship
  ) {
    return res
      .status(400)
      .json({ message: 'Missing required employee information.' });
  }

  application.firstName = employee.firstName;
  application.lastName = employee.lastName;
  application.address = {
    building: employee.address.building,
    street: employee.address.street,
    city: employee.address.city,
    state: employee.address.state,
    zip: employee.address.zip,
  };
  application.phone = {
    cellPhone: employee.phone.cellPhone,
    ...(employee.phone.workPhone && { workPhone: employee.phone.workPhone }),
  };
  application.ssn = employee.ssn;
  application.dateOfBirth = employee.dateOfBirth;
  application.gender = employee.gender;

  if (employee.middleName) application.middleName = employee.middleName;
  if (employee.preferredName)
    application.preferredName = employee.preferredName;

  if (employee.documents) {
    application.documents = {
      ...(employee.documents?.profilePicture && {
        profilePicture: employee.documents.profilePicture,
      }),
      ...(employee.documents?.driverLicense && {
        driverLicense: employee.documents.driverLicense,
      }),
      ...(employee.documents?.workAuthorization && {
        workAuthorization: employee.documents.workAuthorization,
      }),
    };
  }

  application.reference = {
    firstName: employee.reference.firstName,
    lastName: employee.reference.lastName,
    relationship: employee.reference.relationship,
    ...(employee.reference.middleName && {
      middleName: employee.reference.middleName,
    }),
    ...(employee.reference.phone && {
      phone: employee.reference.phone,
    }),
    ...(employee.reference.email && {
      email: employee.reference.email,
    }),
  };

  application.emergencyContacts = employee.emergencyContacts.map((contact) => ({
    firstName: contact.firstName,
    lastName: contact.lastName,
    relationship: contact.relationship,
    ...(contact.middleName && { middleName: contact.middleName }),
    ...(contact.phone && { phone: contact.phone }),
    ...(contact.email && { email: contact.email }),
  }));

  await application.save();

  res.status(200).json({
    message: 'Application updated successfully.',
    application,
  });
});

// @desc    update application by HR
// @route   PUT /api/application/:id
const updateApplicationStatus = asyncHandler(async (req, res) => {
  const employeeId = req.params.id;
  const { status, feedback } = req.body;

  const { email } = req.user;

  const user = await User.findOne({ email });

  if (!user) {
    return res.status(404).json({ message: 'User not found.' });
  }

  if (user.role !== 'HR') {
    return res.status(401).json({
      message: 'Unauthorized for employee',
    });
  }

  if (!mongoose.Types.ObjectId.isValid(employeeId)) {
    return res.status(400).json({ message: 'Invalid employee ID format.' });
  }

  const employee = await Employee.findById(employeeId);

  if (!employee) {
    return res.status(404).json({ message: 'Employee not found.' });
  }

  const application = await Application.findOne({ email: employee.email });

  if (!application) {
    return res.status(404).json({ message: 'Application not found.' });
  }

  // Ensure the application is currently pending before allowing updates
  if (application.status !== 'Pending') {
    return res.status(400).json({
      message:
        'Only pending applications can be updated to approved or rejected.',
    });
  }

  // Ensure the provided status is either 'Approved' or 'Rejected'
  if (!['Approved', 'Rejected'].includes(status)) {
    return res.status(400).json({
      message:
        "Invalid status. Status must be either 'Approved' or 'Rejected'.",
    });
  }

  application.status = status;

  // If the application is rejected, set feedback (if provided)
  if (status === 'Rejected' && feedback) {
    application.feedback = feedback;
  } else if (status === 'Approved') {
    application.feedback = '';
  }

  const updatedApplication = await application.save();

  res.status(200).json({
    message: `Application has been ${status.toLowerCase()} successfully.`,
    application: updatedApplication,
  });
});

// @desc    get all applications for HR
// @route   Get /api/application/all
const getAllApplications = asyncHandler(async (req, res) => {
  const { email } = req.user;

  const user = await User.findOne({ email });

  if (!user) {
    return res.status(404).json({ message: 'User not found.' });
  }

  if (user.role !== 'HR') {
    return res.status(401).json({
      message: 'Unauthorized for employee',
    });
  }

  // Get all applications by status
  const pendingApplications = await Application.find({
    status: 'Pending',
  });
  const rejectedApplications = await Application.find({
    status: 'Rejected',
  });
  const approvedApplications = await Application.find({
    status: 'Approved',
  });

  // Map applications to include all details
  const formatApplication = (app) => ({
    fullName: `${app.firstName} ${app.lastName}`,
    email: app.email,
    phone: {
      cellPhone: app.phone.cellPhone,
      workPhone: app.phone.workPhone || null,
    },
    ssn: app.ssn,
    dateOfBirth: app.dateOfBirth,
    gender: app.gender,
    address: {
      building: app.address.building,
      street: app.address.street,
      city: app.address.city,
      state: app.address.state,
      zip: app.address.zip,
    },
    documents: {
      profilePicture: app.documents?.profilePicture || null,
      driverLicense: app.documents?.driverLicense || null,
      workAuthorization: app.documents?.workAuthorization || null,
    },
    reference: {
      firstName: app.reference.firstName,
      lastName: app.reference.lastName,
      relationship: app.reference.relationship,
      middleName: app.reference.middleName || null,
      phone: app.reference.phone || null,
      email: app.reference.email || null,
    },
    emergencyContacts: app.emergencyContacts.map((contact) => ({
      firstName: contact.firstName,
      lastName: contact.lastName,
      relationship: contact.relationship,
      middleName: contact.middleName || null,
      phone: contact.phone || null,
      email: contact.email || null,
    })),
    status: app.status,
    feedback: app.feedback || null,
  });

  // Return response with applications grouped by status
  res.status(200).json({
    pending: pendingApplications.map(formatApplication),
    rejected: rejectedApplications.map(formatApplication),
    approved: approvedApplications.map(formatApplication),
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

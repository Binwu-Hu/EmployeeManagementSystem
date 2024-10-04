import Application from '../models/applicationModel.js';
import Employee from '../models/employeeModel.js';
import User from '../models/userModel.js';
import RegistrationToken from '../models/registrationTokenModel.js';
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
    employee: employee._id,
  });

  if (existingApplication) {
    return res
      .status(400)
      .json({ message: 'Application already exists for this employee.' });
  }

  if (
    !employee.firstName ||
    !employee.lastName ||
    !employee.address ||
    !employee.address.building ||
    !employee.address.street ||
    !employee.address.city ||
    !employee.address.state ||
    !employee.address.zip ||
    !employee.phone ||
    !employee.phone.cellPhone ||
    !employee.ssn ||
    !employee.dateOfBirth ||
    !employee.gender ||
    !employee.workAuthorization ||
    !employee.workAuthorization.visaType ||
    !employee.workAuthorization.startDate ||
    !employee.workAuthorization.endDate ||
    !employee.reference ||
    !employee.reference.firstName ||
    !employee.reference.lastName ||
    !employee.reference.relationship
  ) {
    return res.status(400).json({
      message:
        'Missing required employee information. Please complete all fields before creating an application.',
    });
  }

  if (!employee.emergencyContacts || employee.emergencyContacts.length === 0) {
    return res
      .status(400)
      .json({ message: 'At least one emergency contact is required.' });
  }

  for (const contact of employee.emergencyContacts) {
    if (!contact.firstName || !contact.lastName || !contact.relationship) {
      return res.status(400).json({
        message:
          'Each emergency contact must have a first name, last name, and relationship.',
      });
    }
  }

  const application = new Application({
    employee: employee._id,
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

  const employee = await Employee.findOne({ email });
  const application = await Application.findOne({ employee });

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

  const application = await Application.findOne({
    employee: employee._id,
  });

  if (!application) {
    return res.status(404).json({ message: 'Application not found.' });
  }

  if (application.status !== 'Rejected') {
    return res.status(400).json({
      message: 'You can only update the application if it was rejected.',
    });
  }

  if (
    !employee.firstName ||
    !employee.lastName ||
    !employee.address ||
    !employee.address.building ||
    !employee.address.street ||
    !employee.address.city ||
    !employee.address.state ||
    !employee.address.zip ||
    !employee.phone ||
    !employee.phone.cellPhone ||
    !employee.ssn ||
    !employee.dateOfBirth ||
    !employee.gender ||
    !employee.workAuthorization ||
    !employee.workAuthorization.visaType ||
    !employee.workAuthorization.startDate ||
    !employee.workAuthorization.endDate ||
    !employee.reference ||
    !employee.reference.firstName ||
    !employee.reference.lastName ||
    !employee.reference.relationship
  ) {
    return res.status(400).json({
      message:
        'Missing required employee information. Please complete all fields before updating the application.',
    });
  }

  if (!employee.emergencyContacts || employee.emergencyContacts.length === 0) {
    return res
      .status(400)
      .json({ message: 'At least one emergency contact is required.' });
  }

  for (const contact of employee.emergencyContacts) {
    if (!contact.firstName || !contact.lastName || !contact.relationship) {
      return res.status(400).json({
        message:
          'Each emergency contact must have a first name, last name, and relationship.',
      });
    }
  }

  application.employee = employee._id;
  application.status = 'Pending';
  application.feedback = '';

  const updatedApplication = await application.save();

  res.status(200).json({
    message: 'Application updated successfully.',
    application: updatedApplication,
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

  const application = await Application.findOne({ employee });

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

  const pendingApplications = await Application.find({
    status: 'Pending',
  }).populate('employee', 'firstName lastName email');
  const rejectedApplications = await Application.find({
    status: 'Rejected',
  }).populate('employee', 'firstName lastName email');
  const approvedApplications = await Application.find({
    status: 'Approved',
  }).populate('employee', 'firstName lastName email');

  const formatApplication = (application) => ({
    fullName: `${application.employee.firstName} ${application.employee.lastName}`,
    email: application.employee.email,
    status: application.status,
    submittedAt: application.submittedAt,
    feedback: application.feedback || '',
    employeeId: application.employee._id,
  });

  res.status(200).json({
    pending: pendingApplications.map(formatApplication),
    rejected: rejectedApplications.map(formatApplication),
    approved: approvedApplications.map(formatApplication),
  });
});

// @desc    Get application detail
// @route   GET /api/application/:id
const getApplicationDetail = asyncHandler(async (req, res) => {
  const employeeId = req.params.id;

  if (!mongoose.Types.ObjectId.isValid(employeeId)) {
    return res.status(400).json({ message: 'Invalid employee ID format.' });
  }

  const employee = await Employee.findById(employeeId);

  if (!employee) {
    return res.status(404).json({ message: 'Employee not found.' });
  }

  const { email } = req.user;

  const user = await User.findOne({ email });

  if (!user) {
    return res.status(404).json({ message: 'User not found.' });
  }

  if (user.role !== 'HR' && employee.email !== email) {
    return res
      .status(401)
      .json({ message: 'Unauthorized for other employees.' });
  }

  const application = await Application.findOne({ employee });

  if (!application) {
    return res.status(404).json({ message: 'Application not found.' });
  }

  res.status(200).json({
    employee: {
      fullName: `${employee.firstName} ${employee.lastName}`,
      middleName: employee.middleName || '',
      preferredName: employee.preferredName || '',
      email: employee.email,
      profilePicture: employee.profilePicture,
      address: {
        building: employee.address.building,
        street: employee.address.street,
        city: employee.address.city,
        state: employee.address.state,
        zip: employee.address.zip,
      },
      phone: {
        cellPhone: employee.phone.cellPhone,
        workPhone: employee.phone.workPhone || '',
      },
      ssn: employee.ssn,
      dateOfBirth: employee.dateOfBirth,
      gender: employee.gender,
      visaStatus: employee.visaStatus,
      workAuthorization: {
        visaType: employee.workAuthorization.visaType,
        startDate: employee.workAuthorization.startDate,
        endDate: employee.workAuthorization.endDate,
      },
      reference: {
        firstName: employee.reference.firstName,
        lastName: employee.reference.lastName,
        middleName: employee.reference.middleName || '',
        phone: employee.reference.phone || '',
        email: employee.reference.email || '',
        relationship: employee.reference.relationship,
      },
      emergencyContacts: employee.emergencyContacts.map((contact) => ({
        firstName: contact.firstName,
        lastName: contact.lastName,
        middleName: contact.middleName || '',
        phone: contact.phone || '',
        email: contact.email || '',
        relationship: contact.relationship,
      })),
      documents: {
        profilePicture: employee.documents.profilePicture || '',
        driverLicense: employee.documents.driverLicense || '',
        workAuthorization: employee.documents.workAuthorization || '',
      },
    },
    application: {
      status: application.status,
      feedback: application.feedback || '',
      submittedAt: application.submittedAt,
    },
  });
});

// @desc    Get all tokens, email, Employee name, and Application status
// @route   GET /api/application/tokenlist
const getTokenList = asyncHandler(async (req, res) => {
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

  try {
    // Fetch all tokens and return `token` and `email` fields
    const tokens = await RegistrationToken.find({}, 'token email');

    // For each token, check if an Employee and Application exist for the associated email
    const tokenList = await Promise.all(
      tokens.map(async (t) => {
        const employee = await Employee.findOne({ email: t.email });

        let employeeStatus = 'Employee not created';
        let applicationStatus = 'Not submitted';
        let employeeId = null;

        if (employee) {
          employeeId = employee._id;

          if (!employee.firstName && !employee.lastName) {
            employeeStatus = 'Unnamed Employee';
          } else {
            employeeStatus = `${employee.firstName || ''} ${
              employee.lastName || ''
            }`.trim();
          }

          const application = await Application.findOne({
            employee: employee._id,
          });

          // If application exists, return its status, otherwise keep 'Not submitted'
          if (application) {
            applicationStatus = application.status;
          }
        }

        return {
          token: `signup/${t.token}`,
          email: t.email,
          employee: employeeStatus,
          employeeId: employeeId,
          applicationStatus: applicationStatus,
        };
      })
    );

    res.status(200).json(tokenList);
  } catch (error) {
    res.status(500).json({
      message: 'Failed to retrieve tokens',
      error: error.message,
    });
  }
});

export {
  createApplication,
  getApplicationStatus,
  updateApplication,
  updateApplicationStatus,
  getAllApplications,
  getApplicationDetail,
  getTokenList,
};

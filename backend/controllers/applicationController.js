import Application from '../models/applicationModel.js';
import Employee from '../models/employeeModel.js';
import User from '../models/userModel.js';
import RegistrationToken from '../models/registrationTokenModel.js';
import asyncHandler from 'express-async-handler';
import mongoose from 'mongoose';
import VisaStatus from '../models/visaStatusModel.js';

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
    if (existingApplication.status === 'Pending') {
      return res.status(401).json({ message: 'Pending for Application...' });
    } else if (existingApplication.status === 'Approved') {
      return res.status(401).json({ message: 'Application has been approved' });
    } else if (existingApplication.status === 'Rejected') {
      // Update the existing application if rejected
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
        // !employee.workAuthorization.startDate ||
        // !employee.workAuthorization.endDate ||
        !employee.reference ||
        !employee.reference.firstName ||
        !employee.reference.lastName ||
        !employee.reference.relationship
      ) {
        return res.status(400).json({
          message:
            'Missing required employee information. Please complete and save all fields before updating the application.',
        });
      }

      if (
        !employee.emergencyContacts ||
        employee.emergencyContacts.length === 0
      ) {
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

      // Update the status back to 'Pending' and clear the feedback
      existingApplication.status = 'Pending';
      existingApplication.feedback = '';

      await existingApplication.save();

      return res.status(200).json({
        message: 'Application has been resubmitted successfully.',
        application: existingApplication,
      });
    } else {
      return res.status(500).json({ message: 'Application status error' });
    }
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
    // !employee.workAuthorization.startDate ||
    // !employee.workAuthorization.endDate ||
    !employee.reference ||
    !employee.reference.firstName ||
    !employee.reference.lastName ||
    !employee.reference.relationship
  ) {
    return res.status(400).json({
      message:
        'Missing required employee information. Please complete and save all fields before creating an application.',
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

  // Check if employee's visaType is 'H1-B', 'L2', 'F1', or 'H4'
  const validVisaTypes = ['H1-B', 'L2', 'F1', 'H4'];
  if (validVisaTypes.includes(employee.workAuthorization.visaType)) {
    try {
      const result = await updateVisaStatus(employee._id, employee.workAuthorization.visaType);
      console.log(result.message);
    } catch (error) {
      console.error('Error updating visa status:', error.message);
      return res.status(500).json({ message: 'Error updating visa status', error: error.message });
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
    res.status(200).json({
      applicationMessage: 'Please fill in the application fields and submit.',
    });
  } else {
    switch (application.status) {
      case 'Rejected':
        // ii. Rejected: they can view feedback, make changes, and resubmit
        res.status(200).json({
          applicationMessage:
            'Your application was rejected. Please review the feedback, make changes, and resubmit.',
          feedback: application.feedback,
          application: application, // Allow user to edit and resubmit
        });
        break;

      case 'Pending':
        // iii. Pending: they can view the submitted application (not editable) and list of uploaded documents

        res.status(200).json({
          applicationMessage: 'Please wait for HR to review your application.',
          application: application, // Application is not editable
        });
        break;

      case 'Approved':
        // iv. Approved: they should be redirected to the home page
        res.status(200).json({
          applicationMessage:
            'Your application has been approved. Redirecting to the home page...',
        });
        break;

      default:
        res
          .status(400)
          .json({ applicationMessage: 'Invalid application status.' });
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

  // Check if employee's visaType is 'H1-B', 'L2', 'F1', or 'H4'
  const validVisaTypes = ['H1-B', 'L2', 'F1', 'H4'];
  if (validVisaTypes.includes(employee.workAuthorization.visaType)) {
    try {
      const result = await updateVisaStatus(employee._id, employee.workAuthorization.visaType);
      console.log(result.message);
    } catch (error) {
      console.error('Error updating visa status:', error.message);
      return res.status(500).json({ message: 'Error updating visa status', error: error.message });
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
  const userId = req.params.id;
  const { status, feedback } = req.body;

  const employee = await Employee.findOne({ userId });

  if (!employee) {
    return res.status(404).json({ message: 'Employee not found' });
  }

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
  }).populate('employee', 'firstName lastName email userId');
  const rejectedApplications = await Application.find({
    status: 'Rejected',
  }).populate('employee', 'firstName lastName email userId');
  const approvedApplications = await Application.find({
    status: 'Approved',
  }).populate('employee', 'firstName lastName email userId');

  const formatApplication = (application) => ({
    fullName: `${application.employee.firstName} ${application.employee.lastName}`,
    email: application.employee.email,
    status: application.status,
    submittedAt: application.submittedAt,
    feedback: application.feedback || '',
    employeeId: application.employee._id,
    userId: application.employee.userId,
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

  const application = await Application.findOne({ employee });
  //.populate('employee', 'firstName lastName email userId');;

  if (!application) {
    return res.status(200).json({
      applicationMessage: 'Please fill in the application fields and submit.',
    });
  }

  // const formatApplication = (application) => ({
  //   fullName: `${application.employee.firstName} ${application.employee.lastName}`,
  //   email: application.employee.email,
  //   status: application.status,
  //   submittedAt: application.submittedAt,
  //   feedback: application.feedback || '',
  //   employeeId: application.employee._id,
  //   userId: application.employee.userId,
  // });

  res.status(200).json({ application });
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
    const tokens = await RegistrationToken.find(
      {},
      'token email firstName lastName'
    );

    // For each token, check if an Employee and Application exist for the associated email
    const tokenList = await Promise.all(
      tokens.map(async (t) => {
        const employee = await Employee.findOne({ email: t.email });

        let applicationStatus = 'Not submitted';
        let employeeId = null;

        if (employee) {
          employeeId = employee._id;

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
          name: `${t.firstName} ${t.lastName}`,
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

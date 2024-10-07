import Employee from '../models/employeeModel.js';
import asyncHandler from 'express-async-handler';
import fs from 'fs';
import path from 'path';
import { updateVisaStatus } from '../controllers/visaStatusController.js';

// Controller to get employee by userId
export const getEmployeeByUserId = async (req, res) => {
  try {
    const userId = req.params.id;
    const employee = await Employee.findOne({ userId });

    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    res.status(200).json(employee);
  } catch (error) {
    res.status(500).json({
      message: 'Error fetching employee by userID',
      error: error.message,
    });
  }
};

// export const updateEmployee = async (req, res) => {
//   const userId = req.params.id;

//   try {
//     const updatedEmployee = await Employee.findOneAndUpdate(
//       { userId },
//       { $set: req.body },
//       { new: true, runValidators: true } // Return updated employee, run validation
//     );

//     if (!updatedEmployee) {
//       return res.status(404).json({ message: 'Employee not found' });
//     }

//     const visaType = updatedEmployee?.workAuthorization?.visaType;

//     const files = updatedEmployee?.workAuthorization?.files;

//     try {
//       if (files) {
//         await updateVisaStatus(updatedEmployee._id, visaType, files);
//       } else {
//         await updateVisaStatus(updatedEmployee._id, visaType);
//       }
//     } catch (error) {
//       console.error('Error updating visa status:', error.message);
//       return res.status(500).json({
//         message: 'Error updating visa status',
//         error: error.message,
//       });
//     }

//     res.status(200).json(updatedEmployee);
//   } catch (error) {
//     res
//       .status(500)
//       .json({ message: 'Error updating employee', error: error.message });
//   }
// };

export const updateEmployee = async (req, res) => {
  const userId = req.params.id;

  try {
    let updatedEmployee = await Employee.findOneAndUpdate(
      { userId },
      { $set: req.body },
      { new: true, runValidators: true } // Return updated employee, run validation
    );

    if (!updatedEmployee) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    // Check if the visaType is not 'F1', and if so, remove the files field
    if (updatedEmployee?.workAuthorization?.visaType !== 'F1') {
      updatedEmployee = await Employee.findOneAndUpdate(
        { userId },
        { $unset: { 'workAuthorization.files': 1 } },
        { new: true } // Return the updated document
      );
    }

    const visaType = updatedEmployee?.workAuthorization?.visaType;

    const files = updatedEmployee?.workAuthorization?.files;

    try {
      // Update visa status based on the existence of files
      if (files) {
        await updateVisaStatus(updatedEmployee._id, visaType, files);
      } else {
        await updateVisaStatus(updatedEmployee._id, visaType);
      }
    } catch (error) {
      console.error('Error updating visa status:', error.message);
      return res.status(500).json({
        message: 'Error updating visa status',
        error: error.message,
      });
    }

    res.status(200).json(updatedEmployee);
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Error updating employee', error: error.message });
  }
};

// Get all employees, ordered by last name
export const getAllEmployees = async (req, res) => {
  try {
    const employees = await Employee.find().sort({ lastName: 1 });
    res.status(200).json(employees);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching employees', error });
  }
};

// upload profile picture or documents (e.g., PDFs)
export const uploadEmployeeFile = asyncHandler(async (req, res) => {
  const userId = req.params.id;

  const employee = await Employee.findOne({ userId });

  if (!employee) {
    return res.status(404).json({ message: 'Employee not found' });
  }

  // Check if a file was uploaded
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }

  // Determine if the upload is a profile picture or document (PDF)
  const filePath = `/uploads/${req.file.filename}`;
  const fileType = path.extname(req.file.filename).toLowerCase();

  res
    .status(200)
    .json({ message: 'File uploaded successfully', filePath, fileType });
});

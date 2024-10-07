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

export const updateEmployee = async (req, res) => {
  const userId = req.params.id;
//   console.log("userId:" ,userId)
  console.log("req.body:" ,req.body)
  try {
    const updatedEmployee = await Employee.findOneAndUpdate(
      { userId },
      { $set: req.body },
      { new: true, runValidators: true } // Return updated employee, run validation
    );
    console.log('here0');

    if (!updatedEmployee) {
      return res.status(404).json({ message: 'Employee not found' });
    }
    console.log("employee controller updatedEmployee:", updatedEmployee);
    const visaType = updatedEmployee?.workAuthorization?.visaType;
    console.log('employee controller visaType:', visaType);
    const files = updatedEmployee?.workAuthorization?.files;
    console.log('employee controller files:', files);
    try {
        console.log('here3');
      if (files) {
        console.log('here4');
        await updateVisaStatus(updatedEmployee._id, visaType, files);
        console.log('save succcessfully in employee controller');
      } else {
        console.log('here5');
        await updateVisaStatus(updatedEmployee._id, visaType);
        console.log('save succcessfully without files in employee controller');
      }
    } catch (error) {
      console.error('Error updating visa status:', error.message);
      return res
        .status(500)
        .json({
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

import Employee from '../models/employeeModel.js';
import { updateVisaStatus } from './visaStatusController.js';
import asyncHandler from 'express-async-handler';

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
  const validVisaTypes = ['H1-B', 'L2', 'F1', 'H4'];
  try {
    const updatedEmployee = await Employee.findOneAndUpdate(
      { userId },
      { $set: req.body },
      { new: true, runValidators: true } // Return updated employee, run validation
    );

    if (!updatedEmployee) {
      return res.status(404).json({ message: 'Employee not found' });
    }
    const visaType = updatedEmployee.workAuthorization.visaType;
    if (validVisaTypes.includes(visaType)) {
      try {
        const result = await updateVisaStatus(updatedEmployee._id, visaType);
        // console.log(result.message);
      } catch (error) {
        console.error('Error updating visa status:', error.message);
        return res.status(500).json({ message: 'Error updating visa status', error: error.message });
      }
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

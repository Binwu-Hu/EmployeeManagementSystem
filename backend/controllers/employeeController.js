import Employee from '../models/employeeModel.js';
import asyncHandler from 'express-async-handler';

export const getEmployeeByEmail = async (req, res) => {
  try {
    const employee = await Employee.findOne({ email: req.user.email });
    // console.log('user:', req.user.email);
    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }
    res.status(200).json(employee);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching employee details', error });
  }
};

// @desc    Update employee profile
// @route   PUT /api/employee
export const updateEmployeeProfile = asyncHandler(async (req, res) => {
  const { email } = req.user;

  const employee = await Employee.findOne({ email });

  if (!employee) {
    return res.status(404).json({ message: 'Employee not found.' });
  }

  const {
    firstName,
    lastName,
    middleName,
    preferredName,
    profilePicture,
    address,
    phone,
    ssn,
    dateOfBirth,
    gender,
    documents,
    references,
    emergencyContacts,
  } = req.body;

  employee.firstName = firstName || employee.firstName;
  employee.lastName = lastName || employee.lastName;
  employee.middleName = middleName || employee.middleName;
  employee.preferredName = preferredName || employee.preferredName;
  employee.profilePicture = profilePicture || employee.profilePicture;

  if (address) {
    employee.address.building = address.building || employee.address.building;
    employee.address.street = address.street || employee.address.street;
    employee.address.city = address.city || employee.address.city;
    employee.address.state = address.state || employee.address.state;
    employee.address.zip = address.zip || employee.address.zip;
  }

  if (phone) {
    employee.phone.cellPhone = phone.cellPhone || employee.phone.cellPhone;
    employee.phone.workPhone = phone.workPhone || employee.phone.workPhone;
  }

  employee.ssn = ssn || employee.ssn;
  employee.dateOfBirth = dateOfBirth || employee.dateOfBirth;
  employee.gender = gender || employee.gender;
  employee.documents = documents || employee.documents;

  if (references && Array.isArray(references)) {
    employee.references = references.map((ref) => ({
      firstName: ref.firstName || '',
      lastName: ref.lastName || '',
      middleName: ref.middleName || '',
      phone: ref.phone || '',
      email: ref.email || '',
      relationship: ref.relationship || '',
    }));
  }

  if (emergencyContacts && Array.isArray(emergencyContacts)) {
    employee.emergencyContacts = emergencyContacts.map((contact) => ({
      firstName: contact.firstName || '',
      lastName: contact.lastName || '',
      middleName: contact.middleName || '',
      phone: contact.phone || '',
      email: contact.email || '',
      relationship: contact.relationship || '',
    }));
  }

  const updatedEmployee = await employee.save();

  res.status(200).json({
    message: 'Employee profile updated successfully.',
    employee: updatedEmployee,
  });
});

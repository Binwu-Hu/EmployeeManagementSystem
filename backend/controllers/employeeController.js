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
    reference,
    emergencyContacts,
    workAuthorization,
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

  if (documents) {
    employee.documents.profilePicture =
      documents.profilePicture || employee.documents.profilePicture;
    employee.documents.driverLicense =
      documents.driverLicense || employee.documents.driverLicense;
    employee.documents.workAuthorization =
      documents.workAuthorization || employee.documents.workAuthorization;
  }

  if (reference) {
    employee.reference.firstName =
      reference.firstName || employee.reference.firstName;
    employee.reference.lastName =
      reference.lastName || employee.reference.lastName;
    employee.reference.middleName =
      reference.middleName || employee.reference.middleName;
    employee.reference.phone = reference.phone || employee.reference.phone;
    employee.reference.email = reference.email || employee.reference.email;
    employee.reference.relationship =
      reference.relationship || employee.reference.relationship;
  }

  if (emergencyContacts && Array.isArray(emergencyContacts)) {
    employee.emergencyContacts = emergencyContacts.map((contact, index) => ({
      firstName:
        contact.firstName || employee.emergencyContacts[index]?.firstName || '',
      lastName:
        contact.lastName || employee.emergencyContacts[index]?.lastName || '',
      middleName:
        contact.middleName ||
        employee.emergencyContacts[index]?.middleName ||
        '',
      phone: contact.phone || employee.emergencyContacts[index]?.phone || '',
      email: contact.email || employee.emergencyContacts[index]?.email || '',
      relationship:
        contact.relationship ||
        employee.emergencyContacts[index]?.relationship ||
        '',
    }));
  }

  if (workAuthorization) {
    employee.workAuthorization.visaType =
      workAuthorization.visaType || employee.workAuthorization.visaType;
    employee.workAuthorization.startDate =
      workAuthorization.startDate || employee.workAuthorization.startDate;
    employee.workAuthorization.endDate =
      workAuthorization.endDate || employee.workAuthorization.endDate;
  }

  const updatedEmployee = await employee.save();

  res.status(200).json({
    message: 'Employee profile updated successfully.',
    employee: updatedEmployee,
  });
});

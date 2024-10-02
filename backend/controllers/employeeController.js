import Employee from '../models/employeeModel.js';

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
import { get } from './base';

export const getEmployeeDetailsByEmail = async (email: string) => {
  try {
    const response = await get(`/employee/email/${email}`);
    return response;
  } catch (error) {
    throw new Error(error.message || 'Failed to fetch employee details');
  }
};

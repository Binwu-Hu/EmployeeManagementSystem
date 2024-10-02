import { get, post, patch } from './base';

// Fetch employee details by email
export const fetchEmployeeDetails = () => get('/employee/me');

// Fetch the visa status for a specific employee
export const fetchVisaStatusApi = (employeeId: string) => {
    // console.log("employeeId in fetchVisaStatusAPI", employeeId);
  return get(`/visa-status/${employeeId}`);
};

// Upload visa document (multiple files)
export const uploadVisaDocumentApi = (employeeId: string, fileType: string, files: any[]) => {
  const formData = new FormData();
  // console.log('formData', formData);  
  files.forEach((file) => {
    formData.append('files', file.originFileObj); // Use originFileObj for Ant Design Upload component
  });
  formData.append('fileType', fileType); // E.g., optReceipt, optEAD, i983Form
  return patch(`/visa-status/${employeeId}/upload`, formData, true); // Indicate it's form data
};

// Update the visa document status by HR (approve or reject)
export const updateVisaDocumentStatusApi = (employeeId: string, fileType: string, action: string) => {
  const data = { fileType, action };
  return patch(`/visa-status/${employeeId}/status`, data);
};
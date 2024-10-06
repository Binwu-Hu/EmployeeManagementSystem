import { get, post, patch } from './base';

// Fetch all visa statuses
export const fetchVisaStatusesApi = () => get('/visa-status/all');

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
  files.forEach((file) => {
    formData.append('files', file); // Use originFileObj for Ant Design Upload component
    console.log('file', file);
  });
  formData.append('fileType', fileType); // E.g., optReceipt, optEAD, i983Form
  console.log('formData', formData);
  return post(`/visa-status/upload/${employeeId}`, formData, true); // Indicate it's form data
};

// Update the visa document status by HR (approve or reject)
export const updateVisaDocumentStatusApi = (employeeId: string, fileType: string, action: string, feedback: string) => {
  const data = { fileType, action, feedback };
  return patch(`/visa-status/update/${employeeId}`, data);
};

export const sendNotificationApi = (employeeId: string, fileType: string) => {
  const data = { fileType }; // Send fileType as data payload
  return post(`/visa-status/notify/${employeeId}`, data);
};

// // API call to update visa status
// export const updateVisaStatusApi = (visaStatusId: string, status: string) => {
//   const data = { status };  // Payload containing the new status
//   return patch(`/visa-status/${visaStatusId}/status`, data);  // Use your base API patch function
// };
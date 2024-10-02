const BASE_URL = '/api';

const request = async (url: string, method: string, data?: any, isFormData = false) => {
  const token = localStorage.getItem('token');

  const headers: HeadersInit = {
    'FRONTEND_URL': window.location.origin,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const options: RequestInit = {
    method,
    headers,
  };

  if (isFormData) {
    delete headers['Content-Type']; // Let the browser set the correct Content-Type for FormData
    options.body = data; // Directly assign FormData
  } else if (data) {
    headers['Content-Type'] = 'application/json';
    options.body = JSON.stringify(data);
  }

  const response = await fetch(`${BASE_URL}${url}`, options);
  const responseData = await response.json();

  if (!response.ok) {
    throw new Error(responseData.message || 'Something went wrong');
  }

  return responseData;
};

export const get = (url: string) => request(url, 'GET');
export const post = (url: string, data: any) => request(url, 'POST', data);
export const patch = (url: string, data: any, isFormData = false) => request(url, 'PATCH', data, isFormData);
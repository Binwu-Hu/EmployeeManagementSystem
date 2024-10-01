import { post } from './base';

export const loginUserApi = (data: { email: string; password: string }) => {
  return post('/user/login', data);  // Updated path according to your base API
};

export const signupUserApi = (data: { name: string; email: string; password: string }) => {
  return post('/user/signup', data);  // Updated path
};

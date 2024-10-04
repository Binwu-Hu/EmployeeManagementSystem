import { post } from './base';
export const sendRegistrationLinkApi = (data: { firstName: string; lastName: string; email: string }) => {
  return post('/registration/send', data);
};
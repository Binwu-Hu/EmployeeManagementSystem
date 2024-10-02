import { post } from './base';
export const sendRegistrationLinkApi = (data: { email: string }) => {
  return post('/registration/send', data);
};
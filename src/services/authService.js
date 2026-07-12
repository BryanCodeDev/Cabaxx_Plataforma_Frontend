import api from './api';

export const authService = {
  register(payload) {
    return api.post('/auth/register', payload);
  },
  login(payload) {
    return api.post('/auth/login', payload);
  },
  logout() {
    return api.post('/auth/logout');
  },
  refreshToken(refreshToken) {
    return api.post('/auth/refresh', { refreshToken });
  },
  forgotPassword(email) {
    return api.post('/auth/forgot-password', { email });
  },
  resetPassword(token, password) {
    return api.post('/auth/reset-password', { token, password });
  },
  getMe() {
    return api.get('/auth/me');
  },
};

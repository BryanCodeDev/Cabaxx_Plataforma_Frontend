import api from './api';

export const orderService = {
  checkout(payload) {
    return api.post('/checkout', payload);
  },
  getMyOrders(params) {
    return api.get('/my/orders', { params });
  },
};

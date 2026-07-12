import api from './api';

export const authService = {
  login(credentials) {
    return api.post('/auth/login', credentials);
  },
  register(data) {
    return api.post('/auth/register', data);
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

export const artistService = {
  getArtists(params) {
    return api.get('/artists', { params });
  },
  getArtistBySlug(slug) {
    return api.get(`/artists/${slug}`);
  },
  getArtistStats(id) {
    return api.get(`/artists/${id}/stats`);
  },
};

export const songService = {
  getSongs(artistSlug, params) {
    return api.get(`/artists/${artistSlug}/songs`, { params });
  },
  getSongBySlug(artistSlug, slug) {
    return api.get(`/artists/${artistSlug}/songs/${slug}`);
  },
  registerPlay(songId, data) {
    return api.post(`/songs/${songId}/play`, data);
  },
};

export const eventService = {
  getEvents(artistSlug, params) {
    return api.get(`/artists/${artistSlug}/events`, { params });
  },
  getEventBySlug(artistSlug, slug) {
    return api.get(`/artists/${artistSlug}/events/${slug}`);
  },
  purchaseTicket(ticketId, quantity = 1) {
    return api.post(`/tickets/${ticketId}/purchase`, { quantity });
  },
};

export const postService = {
  getPosts(artistSlug, params) {
    return api.get(`/artists/${artistSlug}/posts`, { params });
  },
  getPostBySlug(artistSlug, slug) {
    return api.get(`/artists/${artistSlug}/posts/${slug}`);
  },
};

export const productService = {
  getProducts(artistSlug, params) {
    return api.get(`/artists/${artistSlug}/products`, { params });
  },
  getProductBySlug(artistSlug, slug) {
    return api.get(`/artists/${artistSlug}/products/${slug}`);
  },
  getCategories(artistSlug) {
    return api.get(`/artists/${artistSlug}/product-categories`);
  },
};

export const albumService = {
  getAlbums(artistSlug, params) {
    return api.get(`/artists/${artistSlug}/albums`, { params });
  },
  getAlbumBySlug(artistSlug, slug) {
    return api.get(`/artists/${artistSlug}/albums/${slug}`);
  },
};

export const videoService = {
  getVideos(artistSlug, params) {
    return api.get(`/artists/${artistSlug}/videos`, { params });
  },
  getVideoBySlug(artistSlug, slug) {
    return api.get(`/artists/${artistSlug}/videos/${slug}`);
  },
};

export const contactService = {
  send(payload) {
    return api.post('/contact', payload);
  },
};

export const orderService = {
  checkout(payload) {
    return api.post('/checkout', payload);
  },
  getMyOrders(params) {
    return api.get('/my/orders', { params });
  },
};

export const paymentService = {
  createPayment({ orderId, amount, currency, provider = 'stripe' }) {
    return api.post('/payments/checkout', { order_id: orderId, amount, currency, provider });
  },
  getPaymentByOrder(orderId) {
    return api.get(`/payments?order_id=${orderId}`);
  },
  getStatus(orderId) {
    return api.get(`/payments/status?order_id=${orderId}`);
  },
};

export const communityService = {
  getComments(params) {
    return api.get('/community/comments', { params });
  },
  createComment(payload) {
    return api.post('/community/comments', payload);
  },
  updateComment(id, payload) {
    return api.put(`/community/comments/${id}`, payload);
  },
  deleteComment(id) {
    return api.delete(`/community/comments/${id}`);
  },
  countComments(params) {
    return api.get('/community/comments/count', { params });
  },
  toggleLike(payload) {
    return api.post('/community/likes', payload);
  },
  countLikes(params) {
    return api.get('/community/likes/count', { params });
  },
  checkUserLikes(payload) {
    return api.post('/community/likes/check', payload);
  },
  toggleFollow() {
    return api.post('/community/follows');
  },
  countFollows(artistId) {
    return api.get(`/community/follows/count?artist_id=${artistId}`);
  },
  checkFollow() {
    return api.get('/community/follows/check');
  },
};

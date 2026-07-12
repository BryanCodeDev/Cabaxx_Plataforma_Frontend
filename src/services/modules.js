import api from './api';

// Convierte un objeto de valores en FormData manejando archivos.
// Solo se adjunta como archivo si el valor es un File; las cadenas (URLs
// existentes) se omiten para no sobrescribir el campo en el backend.
function toFormData(values, fileFields = []) {
  const fd = new FormData();
  Object.entries(values || {}).forEach(([k, v]) => {
    if (v === null || v === undefined) return;
    if (fileFields.includes(k)) {
      if (v instanceof File) fd.append(k, v);
      return;
    }
    if (v === '') return;
    if (typeof v === 'boolean') fd.append(k, v ? '1' : '0');
    else if (Array.isArray(v)) fd.append(k, JSON.stringify(v));
    else fd.append(k, String(v));
  });
  return fd;
}

const wrap = (key) => (res) => res.data.data?.[key] ?? res.data.data;

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
  create(values) {
    return api.post(`/artists/cabaxx/songs`, toFormData(values, ['cover', 'audio'])).then(wrap('song'));
  },
  update(id, values) {
    return api.put(`/artists/cabaxx/songs/${id}`, toFormData(values, ['cover', 'audio'])).then(wrap('song'));
  },
  remove(id) {
    return api.delete(`/artists/cabaxx/songs/${id}`);
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
  create(values) {
    return api.post(`/artists/cabaxx/events`, values).then(wrap('event'));
  },
  update(id, values) {
    return api.put(`/artists/cabaxx/events/${id}`, values).then(wrap('event'));
  },
  remove(id) {
    return api.delete(`/artists/cabaxx/events/${id}`);
  },
};

export const postService = {
  getPosts(artistSlug, params) {
    return api.get(`/artists/${artistSlug}/posts`, { params });
  },
  getPostBySlug(artistSlug, slug) {
    return api.get(`/artists/${artistSlug}/posts/${slug}`);
  },
  create(values) {
    return api.post(`/artists/cabaxx/posts`, values).then(wrap('post'));
  },
  update(id, values) {
    return api.put(`/artists/cabaxx/posts/${id}`, values).then(wrap('post'));
  },
  remove(id) {
    return api.delete(`/artists/cabaxx/posts/${id}`);
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
  create(values) {
    return api.post(`/artists/cabaxx/products`, toFormData(values, ['cover'])).then(wrap('product'));
  },
  update(id, values) {
    return api.put(`/artists/cabaxx/products/${id}`, toFormData(values, ['cover'])).then(wrap('product'));
  },
  remove(id) {
    return api.delete(`/artists/cabaxx/products/${id}`);
  },
};

export const categoryService = {
  list(artistSlug) {
    return api.get(`/artists/${artistSlug}/product-categories`).then((res) => res.data.data?.categories || []);
  },
  create(values) {
    return api.post(`/artists/cabaxx/product-categories`, values).then(wrap('category'));
  },
  update(id, values) {
    return api.put(`/artists/cabaxx/product-categories/${id}`, values).then(wrap('category'));
  },
  remove(id) {
    return api.delete(`/artists/cabaxx/product-categories/${id}`);
  },
};

export const couponService = {
  list(params) {
    return api.get(`/artists/cabaxx/coupons`, { params }).then((res) => res.data.data || []);
  },
  create(values) {
    return api.post(`/artists/cabaxx/coupons`, values).then(wrap('coupon'));
  },
  update(id, values) {
    return api.put(`/artists/cabaxx/coupons/${id}`, values).then(wrap('coupon'));
  },
  remove(id) {
    return api.delete(`/artists/cabaxx/coupons/${id}`);
  },
};

export const galleryAdminApi = {
  list(params) {
    return api.get(`/artists/cabaxx/gallery`, { params }).then((res) => res.data.data || []);
  },
  create(values) {
    return api.post(`/artists/cabaxx/gallery`, toFormData(values, ['file'])).then(wrap('item'));
  },
  remove(id) {
    return api.delete(`/artists/cabaxx/gallery/${id}`);
  },
};

export const orderAdminApi = {
  list(params) {
    return api.get(`/artists/cabaxx/orders`, { params }).then((res) => res.data.data || []);
  },
  updateStatus(id, status) {
    return api.put(`/artists/cabaxx/orders/${id}/status`, { status }).then(wrap('order'));
  },
  remove(id) {
    return api.delete(`/artists/cabaxx/orders/${id}`);
  },
};

export const newsletterSubscribersApi = {
  list(params) {
    return api.get(`/artists/cabaxx/newsletter/subscribers`, { params }).then((res) => res.data.data || []);
  },
  remove(id) {
    return api.delete(`/artists/cabaxx/newsletter/subscribers/${id}`);
  },
};

export const newsletterCampaignsApi = {
  list() {
    return api.get(`/artists/cabaxx/newsletter/campaigns`).then((res) => res.data.data?.campaigns || []);
  },
  create(values) {
    return api.post(`/artists/cabaxx/newsletter/campaigns`, values).then(wrap('campaign'));
  },
  send(id) {
    return api.post(`/artists/cabaxx/newsletter/campaigns/${id}/send`);
  },
};

export const albumService = {
  getAlbums(artistSlug, params) {
    return api.get(`/artists/${artistSlug}/albums`, { params });
  },
  getAlbumBySlug(artistSlug, slug) {
    return api.get(`/artists/${artistSlug}/albums/${slug}`);
  },
  create(values) {
    return api.post(`/artists/cabaxx/albums`, values).then(wrap('album'));
  },
  update(id, values) {
    return api.put(`/artists/cabaxx/albums/${id}`, values).then(wrap('album'));
  },
  remove(id) {
    return api.delete(`/artists/cabaxx/albums/${id}`);
  },
};

export const videoService = {
  getVideos(artistSlug, params) {
    return api.get(`/artists/${artistSlug}/videos`, { params });
  },
  getVideoBySlug(artistSlug, slug) {
    return api.get(`/artists/${artistSlug}/videos/${slug}`);
  },
  create(values) {
    return api.post(`/artists/cabaxx/videos`, values).then(wrap('video'));
  },
  update(id, values) {
    return api.patch(`/artists/cabaxx/videos/${id}`, values).then(wrap('video'));
  },
  remove(id) {
    return api.delete(`/artists/cabaxx/videos/${id}`);
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

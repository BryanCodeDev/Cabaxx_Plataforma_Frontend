import api from './api';

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

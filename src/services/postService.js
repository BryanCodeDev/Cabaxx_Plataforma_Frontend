import api from './api';

export const postService = {
  getPosts(artistSlug, params) {
    return api.get(`/artists/${artistSlug}/posts`, { params });
  },
  getPostBySlug(artistSlug, slug) {
    return api.get(`/artists/${artistSlug}/posts/${slug}`);
  },
};

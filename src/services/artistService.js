import api from './api';

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

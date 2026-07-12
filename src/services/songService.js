import api from './api';

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

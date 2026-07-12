import api from './api';

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

export default songService;

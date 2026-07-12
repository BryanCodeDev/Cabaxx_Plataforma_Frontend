import api from './api';

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

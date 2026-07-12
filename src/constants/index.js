export const API_URL = import.meta.env.VITE_API_URL || '';export const APP_NAME = 'Cabaxx';
export const ARTIST_SLUG = 'cabitaxx'; // primer artista del sistema

export const ROLES = {
  SUPERADMIN: 'superadmin',
  ARTIST_ADMIN: 'artist_admin',
  FAN: 'fan',
  GUEST: 'guest',
};

export const ROUTES = {
  HOME: '/',
  SONGS: '/canciones',
  SONG: '/canciones/:slug',
  EVENTS: '/eventos',
  EVENT: '/eventos/:slug',
  NEWS: '/noticias',
  NEWS_POST: '/noticias/:slug',
  BLOG: '/blog',
  BLOG_POST: '/blog/:slug',
  STORE: '/tienda',
  PRODUCT: '/tienda/:slug',
  GALLERY: '/galeria',
  ALBUMS: '/albumes',
  ALBUM: '/albumes/:slug',
  VIDEOS: '/videos',
  VIDEO: '/videos/:slug',
  CONTACT: '/contacto',
  CART: '/carrito',
  CHECKOUT: '/checkout',
  PAYMENT_SUCCESS: '/pagos/success',
  PAYMENT_FAILURE: '/pagos/failure',
  PAYMENT_PENDING: '/pagos/pending',

  LOGIN: '/login',
  REGISTER: '/register',
  FORGOT_PASSWORD: '/forgot-password',
  RESET_PASSWORD: '/reset-password/:token',

  ACCOUNT: '/mi-cuenta',
  MY_ORDERS: '/mis-pedidos',
  MY_ACCOUNT: '/mi-cuenta',

  ADMIN: '/admin',
  ADMIN_SONGS: '/admin/canciones',
  ADMIN_EVENTS: '/admin/eventos',
  ADMIN_STORE: '/admin/tienda',
  ADMIN_ORDERS: '/admin/pedidos',
  ADMIN_NEWS: '/admin/noticias',
  ADMIN_GALLERY: '/admin/galeria',
  ADMIN_NEWSLETTER: '/admin/newsletter',
  ADMIN_ANALYTICS: '/admin/analiticas',
  ADMIN_SETTINGS: '/admin/configuracion',
  ADMIN_POSTS: '/admin/publicaciones',
  ADMIN_ALBUMS: '/admin/albumes',
  ADMIN_VIDEOS: '/admin/videos',

  SUPERADMIN: '/superadmin',
  SUPERADMIN_ARTISTS: '/superadmin/artistas',
  SUPERADMIN_ONBOARDING: '/superadmin/onboarding',
};

export const PAGINATION = {
  DEFAULT_LIMIT: 12,
  OPTIONS: [12, 24, 48],
};

export const STORAGE_KEYS = {
  ACCESS_TOKEN: 'map_access_token',
  REFRESH_TOKEN: 'map_refresh_token',
  CART: 'map_cart',
  THEME: 'map_theme',
};

# MAP — Master Artist Platform
## Prompts de Desarrollo por Fases
### Producto de MasterCode Company
### Primer artista: Cabitaxx (Juan Esteban Cabas Torres)

---

> **Instrucción de uso:** Estos prompts son acumulativos. Cada uno asume que el anterior ya fue ejecutado. Antes de cada prompt, pega el contexto marcado como "CONTEXTO BASE" para que el modelo no pierda el hilo entre sesiones.

---

## CONTEXTO BASE (pegar siempre al inicio de cada sesión)

```
Estoy desarrollando MAP (Master Artist Platform), un SaaS multi-tenant de MasterCode Company para artistas musicales.

Stack:
- Frontend: React + JSX, Tailwind CSS, React Router DOM v6, Axios, Context API
- Backend: Node.js + Express, MySQL 8, JWT + Refresh Tokens, bcrypt, Multer, Cloudinary, Nodemailer, Helmet, Morgan, CORS, express-validator
- Base de datos: MySQL 8 completamente normalizada, multi-tenant por artist_id
- Arquitectura: Clean Architecture, SOLID, RESTful API
- Sin TypeScript. Sin librerías CSS adicionales. Solo Tailwind utility classes.

Primer artista del sistema: Cabitaxx (nombre real: Juan Esteban Cabas Torres).
Todo el código debe estar preparado para soportar múltiples artistas en el futuro.
```

---

## PROMPT 0 — Arquitectura General

```
Actúa como arquitecto de software senior especializado en plataformas SaaS.

Voy a desarrollar MAP (Master Artist Platform), un SaaS multi-tenant de MasterCode Company para artistas musicales. El primer artista será Cabitaxx (Juan Esteban Cabas Torres), pero toda la arquitectura debe estar preparada para soportar cientos de artistas sin modificar el código.

STACK DEFINIDO:
- Frontend: React + JSX, Tailwind CSS, React Router DOM v6, Axios, Context API
- Backend: Node.js + Express, MySQL 8
- Auth: JWT + Refresh Tokens, bcrypt
- Archivos: Multer + Cloudinary
- Email: Nodemailer
- Seguridad: Helmet, CORS, Morgan, express-validator
- Sin TypeScript. Sin librerías CSS adicionales.

PRINCIPIOS:
- Clean Architecture
- SOLID
- Multi-tenant por artist_id en cada tabla
- RESTful API versionada (/api/v1/)
- Código modular, reutilizable y escalable

QUIERO QUE DISEÑES COMPLETAMENTE:

1. ESTRUCTURA DE CARPETAS DEL FRONTEND
Muéstrame el árbol completo de carpetas y archivos con esta forma:
src/
├── assets/
├── components/
│   ├── common/       (Button, Input, Modal, Card, Badge, Spinner, Table)
│   ├── layout/       (Navbar, Footer, Sidebar, Layout, DashboardLayout)
│   └── ui/           (específicos de dominio)
├── context/          (AuthContext, ArtistContext, CartContext, ThemeContext)
├── hooks/            (useAuth, useArtist, useCart, useFetch, useDebounce)
├── pages/
│   ├── public/
│   ├── auth/
│   ├── dashboard/
│   └── admin/
├── router/
├── services/         (api.js, authService.js, artistService.js, etc.)
├── utils/
└── constants/

Expande y completa cada carpeta con todos los archivos necesarios para el proyecto completo.

2. ESTRUCTURA DE CARPETAS DEL BACKEND
Muéstrame el árbol completo con esta forma:
src/
├── config/           (database.js, cloudinary.js, nodemailer.js, env.js)
├── controllers/      (uno por módulo)
├── routes/           (uno por módulo, versionadas /api/v1/)
├── services/         (lógica de negocio, uno por módulo)
├── repositories/     (acceso a datos, uno por módulo)
├── middlewares/      (auth, roles, validate, upload, errorHandler, logger)
├── models/           (esquemas de referencia, no ORM)
├── utils/
├── helpers/
├── validations/
└── logs/

Expande y completa cada carpeta.

3. MÓDULOS DEL SISTEMA
Lista todos los módulos con su descripción en una tabla:
| Módulo | Descripción | Rutas principales |
Incluye: Auth, Artistas, Canciones, Álbumes, Videos, Eventos, Tienda, Pedidos, Pagos, Noticias, Blog, Galería, Newsletter, Dashboard, Analíticas, SEO, SaaS Admin, Configuraciones, Notificaciones.

4. FLUJO DE AUTENTICACIÓN
Diagrama en texto del flujo completo:
- Registro
- Login
- JWT + Refresh Token
- Roles (superadmin, artist_admin, user, guest)
- Protección de rutas en frontend y backend
- Logout + invalidación de token

5. RELACIONES ENTRE MÓDULOS
Mapa de dependencias en texto:
¿Qué módulos dependen de cuáles? ¿Cuál es el orden correcto de desarrollo?

6. CONVENCIONES DE CÓDIGO
Define las convenciones que se usarán en TODO el proyecto:
- Nombres de archivos (camelCase, PascalCase, kebab-case — cuándo usar cada uno)
- Nombres de funciones y variables
- Estructura de respuestas de la API (success, data, message, errors, pagination)
- Estructura de errores
- Formato de fechas
- Convención de rutas REST

7. VARIABLES DE ENTORNO
Lista completa de todas las variables .env necesarias para frontend y backend.

8. ORDEN DE DESARROLLO RECOMENDADO
Lista priorizada de en qué orden construir los módulos, justificando por qué.

No escribas código todavía. Solo arquitectura, estructura y decisiones de diseño.
Sé exhaustivo. Este documento será la guía de todo el desarrollo.
```

---

## PROMPT 1 — Base de Datos

```
CONTEXTO: [PEGAR CONTEXTO BASE AQUÍ]

Ahora diseña la base de datos completa de MAP.

REGLAS:
- MySQL 8
- Completamente normalizada (3FN mínimo)
- Multi-tenant: todas las tablas de contenido tienen artist_id como FK
- Usa snake_case para nombres de tablas y columnas
- Toda tabla tiene: id (PK, AUTO_INCREMENT), created_at, updated_at
- Tablas de estado tienen además: deleted_at (soft delete)
- Usa ENUM solo para valores que NUNCA cambiarán
- Usa FK con ON DELETE y ON UPDATE explícitos
- Agrega índices en todas las columnas usadas en WHERE, JOIN y ORDER BY

GENERA LAS SIGUIENTES TABLAS EN ORDEN LÓGICO:

GRUPO 1 — SISTEMA Y AUTENTICACIÓN:
- users (id, name, email, password_hash, avatar_url, status, email_verified_at)
- roles (id, name, slug, description)
- permissions (id, name, slug, module, description)
- role_permissions (role_id, permission_id)
- user_roles (user_id, role_id, artist_id) -- un user puede ser admin de varios artistas
- refresh_tokens (id, user_id, token_hash, expires_at, revoked_at, ip_address, user_agent)
- sessions (id, user_id, token_hash, expires_at, ip_address, device_info)
- password_resets (id, email, token_hash, expires_at, used_at)
- email_verifications (id, user_id, token_hash, expires_at)

GRUPO 2 — ARTISTAS (núcleo del multi-tenant):
- artists (id, slug, stage_name, real_name, bio, short_bio, avatar_url, banner_url, genre, country, city, status, verified_at)
- artist_social_links (id, artist_id, platform, url, followers_count, last_synced_at)
- artist_themes (id, artist_id, primary_color, secondary_color, accent_color, font_heading, font_body, dark_mode_default)
- artist_seo (id, artist_id, meta_title, meta_description, keywords, og_image_url, schema_json, robots)
- artist_settings (id, artist_id, key, value, type) -- configuraciones clave-valor
- artist_domains (id, artist_id, domain, ssl_status, is_primary, verified_at)

GRUPO 3 — MÚSICA:
- songs (id, artist_id, title, slug, duration_seconds, lyrics, description, cover_url, audio_url, release_date, status, plays_count, likes_count, is_explicit)
- albums (id, artist_id, title, slug, description, cover_url, release_date, type [single/ep/album], status)
- album_songs (album_id, song_id, track_number, disc_number)
- song_streaming_links (id, song_id, platform, url)
- song_tags (id, song_id, tag)

GRUPO 4 — VIDEO Y MULTIMEDIA:
- videos (id, artist_id, title, slug, description, thumbnail_url, video_url, youtube_id, duration_seconds, views_count, status, published_at)
- gallery_items (id, artist_id, title, description, file_url, file_type [image/video], category, sort_order, status)

GRUPO 5 — EVENTOS:
- events (id, artist_id, title, slug, description, venue_name, venue_address, city, country, lat, lng, start_datetime, end_datetime, timezone, banner_url, status, is_free, capacity)
- tickets (id, event_id, artist_id, name, description, price, currency, quantity_total, quantity_sold, sale_start_at, sale_end_at, status)
- ticket_purchases (id, user_id, ticket_id, quantity, total_price, status, qr_code, used_at)

GRUPO 6 — TIENDA Y ECOMMERCE:
- product_categories (id, artist_id, name, slug, description, image_url, parent_id, sort_order)
- products (id, artist_id, category_id, name, slug, description, price, compare_at_price, currency, sku, stock_quantity, type [physical/digital/ticket], cover_url, status, weight_grams)
- product_images (id, product_id, url, alt_text, sort_order)
- product_variants (id, product_id, name, options_json, price, sku, stock_quantity)
- coupons (id, artist_id, code, type [percent/fixed], value, min_purchase, max_uses, uses_count, expires_at, status)
- orders (id, user_id, artist_id, status, subtotal, discount, shipping, tax, total, currency, coupon_id, notes)
- order_items (id, order_id, product_id, variant_id, quantity, unit_price, total_price, snapshot_json)
- order_shipping (id, order_id, carrier, tracking_number, status, shipped_at, delivered_at, address_json)
- payments (id, order_id, user_id, artist_id, provider, provider_tx_id, amount, currency, status, response_json, paid_at)

GRUPO 7 — COMUNIDAD:
- posts (id, artist_id, user_id, type [blog/news/update], title, slug, content, excerpt, cover_url, status, published_at, views_count)
- post_tags (id, post_id, tag)
- comments (id, user_id, artist_id, reference_id, reference_type, content, status, parent_id)
- likes (id, user_id, artist_id, reference_id, reference_type)
- follows (id, user_id, artist_id, created_at)
- newsletter_subscribers (id, artist_id, email, name, status, subscribed_at, unsubscribed_at, source)
- newsletter_campaigns (id, artist_id, subject, content_html, sent_at, total_sent, total_opened, total_clicked)

GRUPO 8 — NOTIFICACIONES Y LOGS:
- notifications (id, user_id, artist_id, type, title, body, data_json, read_at, sent_at)
- audit_logs (id, user_id, artist_id, action, entity_type, entity_id, old_values_json, new_values_json, ip_address, user_agent)
- error_logs (id, level, message, stack_trace, context_json, resolved_at)

GRUPO 9 — ANALÍTICAS:
- page_views (id, artist_id, user_id, session_id, page_url, referrer, device_type, country, created_at)
- events_tracking (id, artist_id, user_id, event_name, properties_json, created_at)
- song_plays (id, song_id, artist_id, user_id, source, duration_played_seconds, completed, created_at)

PARA CADA TABLA INCLUYE:
1. CREATE TABLE completo con todos los tipos de datos, restricciones y comentarios
2. Índices adicionales (CREATE INDEX)
3. Una línea explicando la decisión de diseño si no es obvia

Al final genera:
- Diagrama de relaciones en texto (ASCII o lista de FK)
- Lista de todas las FK con sus ON DELETE / ON UPDATE
- Script de datos iniciales (INSERT) para: roles, permisos, artista Cabitaxx y usuario superadmin
```

---

## PROMPT 2 — Backend: Setup y Auth

```
CONTEXTO: [PEGAR CONTEXTO BASE AQUÍ]

Ahora construye el backend de MAP. Empieza por el setup completo y el módulo de autenticación.

ESTRUCTURA DE CARPETAS A CREAR:
map-backend/
├── src/
│   ├── config/
│   │   ├── database.js       (pool de conexiones MySQL con mysql2/promise)
│   │   ├── cloudinary.js
│   │   ├── nodemailer.js
│   │   └── env.js            (validación de variables de entorno al inicio)
│   ├── controllers/
│   │   └── auth.controller.js
│   ├── routes/
│   │   ├── index.js          (router principal que monta /api/v1/)
│   │   └── auth.routes.js
│   ├── services/
│   │   └── auth.service.js
│   ├── repositories/
│   │   └── auth.repository.js
│   ├── middlewares/
│   │   ├── auth.middleware.js
│   │   ├── roles.middleware.js
│   │   ├── validate.middleware.js
│   │   ├── errorHandler.middleware.js
│   │   ├── notFound.middleware.js
│   │   └── logger.middleware.js
│   ├── validations/
│   │   └── auth.validation.js
│   ├── utils/
│   │   ├── response.js       (helpers para respuestas estandarizadas)
│   │   ├── jwt.js            (sign, verify, refresh)
│   │   ├── crypto.js         (hash tokens, generar strings aleatorios)
│   │   └── pagination.js
│   ├── helpers/
│   │   └── email.helper.js   (templates de email)
│   └── app.js
├── .env.example
├── .gitignore
├── package.json
└── server.js

REGLAS DE CÓDIGO:
- Usa mysql2/promise con pool de conexiones (NO Sequelize, NO Prisma)
- Patrón: Route → Controller → Service → Repository → DB
- Controllers: solo reciben req/res, llaman al service, devuelven respuesta
- Services: lógica de negocio, llaman al repository
- Repositories: solo SQL, devuelven datos crudos
- Manejo de errores: try/catch en controllers, errores personalizados con clases
- Respuesta estándar exitosa: { success: true, data: {}, message: "", meta: {} }
- Respuesta estándar error: { success: false, message: "", errors: [] }

GENERA EL CÓDIGO COMPLETO DE:

1. server.js
- Puerto desde env
- Conexión a DB antes de levantar servidor
- Mensaje de inicio con versión y puerto

2. src/app.js
- Express app
- Middlewares globales: helmet, cors, morgan, express.json, express.urlencoded
- Montaje de rutas: app.use('/api/v1', router)
- Manejo de 404
- Error handler global

3. src/config/database.js
- Pool con mysql2/promise
- Función testConnection()
- Función query(sql, params) con logs en desarrollo

4. src/config/env.js
- Validar que todas las variables críticas existen al iniciar
- Tirar error descriptivo si falta alguna

5. src/utils/response.js
Exporta estas funciones:
- success(res, data, message, statusCode, meta)
- error(res, message, statusCode, errors)
- paginate(res, data, total, page, limit)

6. src/utils/jwt.js
- generateAccessToken(payload) → expira en 15min
- generateRefreshToken(payload) → expira en 7d
- verifyAccessToken(token)
- verifyRefreshToken(token)

7. src/validations/auth.validation.js
Con express-validator, valida:
- register: name, email, password (mín 8 chars, 1 mayúscula, 1 número), confirmPassword
- login: email, password
- forgotPassword: email
- resetPassword: token, password, confirmPassword

8. src/middlewares/validate.middleware.js
- Lee validationResult y si hay errores devuelve 422 con lista de errores formateada

9. src/middlewares/auth.middleware.js
- verifyToken: extrae Bearer token, verifica, adjunta user al req
- optionalAuth: igual pero no falla si no hay token

10. src/middlewares/roles.middleware.js
- requireRole(...roles): verifica que req.user.role esté en la lista
- requirePermission(permission): verifica permiso específico

11. src/middlewares/errorHandler.middleware.js
- Captura todos los errores
- Distingue entre errores de validación, de negocio y de sistema
- En producción no expone stack traces
- Loguea errores de sistema

12. src/repositories/auth.repository.js
Funciones SQL puras:
- findUserByEmail(email)
- findUserById(id)
- createUser({ name, email, password_hash })
- updateUserById(id, fields)
- saveRefreshToken({ user_id, token_hash, expires_at, ip_address, user_agent })
- findRefreshToken(token_hash)
- revokeRefreshToken(token_hash)
- revokeAllUserRefreshTokens(user_id)
- savePasswordReset({ email, token_hash, expires_at })
- findPasswordReset(token_hash)
- markPasswordResetUsed(token_hash)

13. src/services/auth.service.js
Lógica completa de:
- register({ name, email, password }): hashear password, crear user, enviar email verificación
- login({ email, password }): verificar credenciales, generar tokens, guardar refresh token
- refreshToken(oldRefreshToken): rotar refresh token (invalidar viejo, generar nuevo)
- logout(refreshToken): revocar refresh token
- forgotPassword(email): generar token, enviar email
- resetPassword({ token, password }): verificar token, actualizar password, revocar todos los refresh tokens del user
- verifyEmail(token)

14. src/controllers/auth.controller.js
Endpoints:
- POST /register
- POST /login
- POST /refresh
- POST /logout
- POST /forgot-password
- POST /reset-password
- GET /verify-email/:token
- GET /me (con verifyToken middleware)

15. src/routes/auth.routes.js y src/routes/index.js

16. .env.example con TODAS las variables necesarias comentadas

Incluye comentarios explicativos en el código donde la lógica no sea obvia.
Todo el código debe estar listo para copiar y pegar.
```

---

## PROMPT 3 — Backend: Módulos de Contenido

```
CONTEXTO: [PEGAR CONTEXTO BASE AQUÍ]
El módulo de Auth ya está completo y funcionando.

Ahora construye los módulos de contenido del backend. Sigue exactamente el mismo patrón: Route → Controller → Service → Repository.

GENERA EL CÓDIGO COMPLETO DE LOS SIGUIENTES MÓDULOS:

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
MÓDULO 1: ARTISTAS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Repository (artists.repository.js):
- findAll({ page, limit, status, genre, search })
- findBySlug(slug)
- findById(id)
- create(data)
- update(id, data)
- getStats(artist_id) -- canciones, videos, eventos, seguidores, pedidos totales

Service (artists.service.js):
- getArtists(filters) -- con paginación
- getArtistBySlug(slug) -- incluye social_links, theme, seo
- createArtist(data, adminUserId)
- updateArtist(id, data, files) -- maneja upload de avatar y banner a Cloudinary
- getArtistStats(artist_id)

Controller + Routes:
- GET /api/v1/artists (público, paginado)
- GET /api/v1/artists/:slug (público)
- POST /api/v1/artists (solo superadmin)
- PUT /api/v1/artists/:id (artist_admin o superadmin)
- GET /api/v1/artists/:id/stats (artist_admin o superadmin)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
MÓDULO 2: CANCIONES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Repository:
- findByArtist(artist_id, { page, limit, status, search, album_id })
- findBySlug(artist_id, slug)
- create(data)
- update(id, data)
- incrementPlays(song_id, user_id) -- inserta en song_plays
- getTopSongs(artist_id, limit)

Service:
- getSongs(artist_id, filters)
- getSongBySlug(artist_id, slug) -- incluye streaming_links
- createSong(artist_id, data, files) -- upload cover y audio a Cloudinary
- updateSong(id, artist_id, data, files)
- registerPlay(song_id, user_id, data)

Controller + Routes:
- GET /api/v1/artists/:artist_id/songs (público)
- GET /api/v1/artists/:artist_id/songs/:slug (público)
- POST /api/v1/artists/:artist_id/songs (artist_admin)
- PUT /api/v1/artists/:artist_id/songs/:id (artist_admin)
- DELETE /api/v1/artists/:artist_id/songs/:id (artist_admin, soft delete)
- POST /api/v1/songs/:id/play (público, opcional auth)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
MÓDULO 3: ÁLBUMES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Repository:
- findByArtist(artist_id, filters)
- findBySlug(artist_id, slug) -- incluye canciones con track_number
- create(data)
- update(id, data)
- addSong(album_id, song_id, track_number)
- removeSong(album_id, song_id)
- reorderSongs(album_id, songs_order[]) -- recibe array de {song_id, track_number}

Service + Controller + Routes (mismo patrón)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
MÓDULO 4: EVENTOS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Repository:
- findUpcoming(artist_id, limit)
- findAll(artist_id, filters) -- filtra por ciudad, status, fecha
- findBySlug(artist_id, slug) -- incluye tickets disponibles
- create(data)
- update(id, data)

Service:
- getUpcomingEvents(artist_id)
- getEvents(artist_id, filters)
- getEventBySlug(artist_id, slug)
- createEvent(artist_id, data, files)
- purchaseTicket(user_id, ticket_id, quantity) -- valida stock, crea purchase, genera QR

Controller + Routes (mismo patrón)
- POST /api/v1/tickets/:id/purchase (requiere auth)
- GET /api/v1/tickets/verify/:qr_code (público, para scanner)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
MÓDULO 5: NOTICIAS Y BLOG
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Repository:
- findAll(artist_id, { type, status, page, limit, tag })
- findBySlug(artist_id, slug)
- create(data)
- update(id, data)
- incrementViews(post_id)

Service + Controller + Routes (mismo patrón)
- GET /api/v1/artists/:artist_id/posts (público, filtrable por type=blog|news)
- GET /api/v1/artists/:artist_id/posts/:slug (público)
- POST, PUT, DELETE (artist_admin)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
MÓDULO 6: GALERÍA
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Repository:
- findAll(artist_id, { category, file_type, page, limit })
- create(data)
- updateSortOrder(items[]) -- recibe array de {id, sort_order}
- delete(id, artist_id)

Service:
- getGallery(artist_id, filters)
- uploadItem(artist_id, data, file) -- sube a Cloudinary, detecta tipo automáticamente
- reorderItems(artist_id, items)
- deleteItem(id, artist_id) -- borra de Cloudinary también

Controller + Routes

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
MÓDULO 7: NEWSLETTER
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Repository:
- subscribe({ artist_id, email, name, source })
- unsubscribe(artist_id, email)
- findAll(artist_id, filters)
- saveCampaign(data)
- updateCampaignStats(id, stats)

Service:
- subscribe(artist_id, data) -- verifica duplicado, envía email de bienvenida
- unsubscribe(artist_id, email, token)
- sendCampaign(artist_id, campaign_id) -- envía a todos los activos en lotes de 50

Controller + Routes:
- POST /api/v1/artists/:artist_id/newsletter/subscribe (público)
- GET /api/v1/newsletter/unsubscribe (público, con token en query)
- GET, POST /api/v1/artists/:artist_id/newsletter/campaigns (artist_admin)

PARA CADA MÓDULO:
- Código completo y funcional
- Validaciones con express-validator
- Manejo de errores consistente
- Multer configurado donde se necesita upload
- Comentarios en lógica no obvia
```

---

## PROMPT 4 — Backend: Tienda

```
CONTEXTO: [PEGAR CONTEXTO BASE AQUÍ]
Auth y módulos de contenido ya están completos.

Construye el módulo de Tienda (Ecommerce) completo.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
MÓDULO 1: TIENDA — PRODUCTOS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Repository:
- findAll(artist_id, { category_id, type, status, page, limit, search, min_price, max_price, sort })
- findBySlug(artist_id, slug) -- incluye imágenes y variantes
- create(data)
- update(id, data)
- updateStock(product_id, quantity, operation) -- 'add' o 'subtract'
- getCategories(artist_id)

Service:
- getProducts(artist_id, filters)
- getProductBySlug(artist_id, slug)
- createProduct(artist_id, data, files)
- updateProduct(id, artist_id, data, files)
- manageCoverUpload(files, existingUrl) -- Cloudinary

Controller + Routes:
- GET /api/v1/artists/:artist_id/products (público, con filtros)
- GET /api/v1/artists/:artist_id/products/:slug (público)
- POST /api/v1/artists/:artist_id/products (artist_admin)
- PUT /api/v1/artists/:artist_id/products/:id (artist_admin)
- GET/POST /api/v1/artists/:artist_id/product-categories (público GET, admin POST)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
MÓDULO 2: TIENDA — CARRITO Y PEDIDOS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Nota: El carrito vive en el frontend (localStorage o Context). El backend solo procesa el checkout.

Repository:
- createOrder({ user_id, artist_id, items[], coupon_id, shipping_address })
- findOrdersByUser(user_id, filters)
- findOrdersByArtist(artist_id, filters)
- findOrderById(id)
- updateOrderStatus(id, status)
- validateCoupon(artist_id, code, subtotal) -- devuelve el descuento calculado

Service:
- checkout(user_id, artist_id, { items[], coupon_code, shipping_address })
  Pasos:
  1. Validar que todos los productos existen y tienen stock
  2. Calcular subtotal
  3. Aplicar cupón si existe
  4. Crear la orden
  5. Descontar stock de cada producto
  6. Enviar email de confirmación
  7. Devolver orden creada con total final
- getMyOrders(user_id, filters)
- getArtistOrders(artist_id, filters)
- updateOrderStatus(id, status, artist_id)

Controller + Routes:
- POST /api/v1/checkout (requiere auth)
- GET /api/v1/my/orders (requiere auth)
- GET /api/v1/artists/:artist_id/orders (artist_admin)
- PUT /api/v1/orders/:id/status (artist_admin)
- GET /api/v1/coupons/validate (público, query: ?code=&artist_id=&subtotal=)

REGLAS ADICIONALES:
- Todas las operaciones de stock deben ser atómicas (usar transacciones MySQL)
- Los errores de stock insuficiente deben ser claros: "Solo quedan X unidades de [producto]"
- El checkout debe fallar completamente si cualquier producto no tiene stock (no compra parcial)
```

---

## PROMPT 5 — Frontend: Setup y Sistema de Diseño

```
CONTEXTO: [PEGAR CONTEXTO BASE AQUÍ]
El backend está completo. Ahora construimos el frontend.

Crea el setup completo del frontend y el sistema de diseño de MAP.

SISTEMA DE DISEÑO DE CABITAXX / MAP:
El primer artista es Cabitaxx, artista musical urbano colombiano.
El diseño debe verse al nivel de plataformas como Spotify, Apple Music o Warner Music.
Dark mode por defecto, con opción de light mode.

PALETA DE COLORES (Tailwind custom config):
- primary: #0D0D0D (fondo principal dark)
- surface: #1A1A1A (cards, modales)
- surface-2: #252525 (hover states, inputs)
- accent: #FF3B5C (rojo vibrante — color de Cabitaxx)
- accent-hover: #E0203F
- gold: #FFD700 (para puntos, badges, premium)
- text-primary: #FFFFFF
- text-secondary: #A0A0A0
- text-muted: #606060
- border: #2E2E2E
- success: #22C55E
- warning: #F59E0B
- error: #EF4444

TIPOGRAFÍA (Google Fonts):
- Display/Headings: "Bebas Neue" (impacto, energía — para títulos grandes)
- Body: "Inter" (legible, moderno — para texto)
- Mono: "JetBrains Mono" (para códigos, stats)

GENERA EL CÓDIGO COMPLETO DE:

1. Crear proyecto con Vite:
```bash
npm create vite@latest map-frontend -- --template react
```
Luego instala:
```bash
npm install react-router-dom axios react-helmet-async react-hot-toast
npm install -D tailwindcss postcss autoprefixer
```

2. tailwind.config.js
- Colores custom completos
- Fuentes custom
- Extend con: borderRadius, boxShadow custom ('glow': '0 0 20px rgba(255,59,92,0.4)')
- safelist vacío (no hardcodear clases)

3. index.css
- @import Google Fonts (Bebas Neue, Inter, JetBrains Mono)
- @tailwind directives
- CSS variables globales
- Clases utilitarias custom: .text-gradient (gradient accent), .glass (glassmorphism), .card-hover (scale + shadow on hover)
- Scrollbar custom (dark, delgado)

4. src/constants/index.js
```javascript
export const API_URL = import.meta.env.VITE_API_URL
export const APP_NAME = 'MAP'
export const ARTIST_SLUG = 'cabitaxx' // primer artista
export const ROLES = { SUPERADMIN: 'superadmin', ARTIST_ADMIN: 'artist_admin', FAN: 'fan', GUEST: 'guest' }
export const ROUTES = { /* todas las rutas del sistema */ }
export const PAGINATION = { DEFAULT_LIMIT: 12, OPTIONS: [12, 24, 48] }
```

5. src/services/api.js
- Instancia Axios con baseURL desde env
- Interceptor de request: agrega Authorization header con accessToken del localStorage
- Interceptor de response: si 401 → intenta refresh token → si falla, logout y redirect /login
- Maneja refresh token con cola para evitar múltiples refreshes simultáneos

6. src/services/ (un archivo por módulo)
Crea estos archivos con sus funciones correspondientes:
- authService.js: login, register, logout, refreshToken, forgotPassword, resetPassword, getMe
- artistService.js: getArtists, getArtistBySlug, getArtistStats
- songService.js: getSongs, getSongBySlug, registerPlay
- eventService.js: getEvents, getEventBySlug, purchaseTicket
- postService.js: getPosts, getPostBySlug
- productService.js: getProducts, getProductBySlug, getCategories
- orderService.js: checkout, getMyOrders

7. src/context/AuthContext.jsx
- user, isAuthenticated, isLoading
- login(credentials): llama authService, guarda tokens en localStorage, setea user
- logout(): llama authService.logout, limpia localStorage, redirect /
- register(data)
- updateUser(data): actualiza user en context sin nuevo login

8. src/context/ArtistContext.jsx
- artist, isLoading, error
- loadArtist(slug): carga datos del artista activo
- Al montar: carga automáticamente el artista por ARTIST_SLUG

9. src/context/CartContext.jsx
- items[], total, itemCount
- addItem(product, variant, quantity)
- removeItem(product_id, variant_id)
- updateQuantity(product_id, variant_id, quantity)
- clearCart()
- Persiste en localStorage

10. src/hooks/
- useAuth.js: shortcut para useContext(AuthContext)
- useArtist.js: shortcut para useContext(ArtistContext)
- useCart.js: shortcut para useContext(CartContext)
- useFetch.js: hook genérico con loading, error, data, refetch
- useDebounce.js: debounce de valor con delay configurable
- useLocalStorage.js: get/set con JSON automático

11. src/router/index.jsx
Rutas completas con lazy loading:
- Rutas públicas: /, /canciones, /canciones/:slug, /eventos, /eventos/:slug, /noticias, /noticias/:slug, /blog, /blog/:slug, /tienda, /tienda/:slug, /galeria
- Rutas de auth: /login, /register, /forgot-password, /reset-password/:token, /verify-email/:token
- Rutas protegidas (user): /mi-cuenta, /mis-pedidos
- Rutas admin: /admin, /admin/canciones, /admin/eventos, /admin/tienda, /admin/pedidos, /admin/noticias, /admin/galeria, /admin/newsletter, /admin/analiticas, /admin/configuracion
- ProtectedRoute component: redirige a /login si no está autenticado
- AdminRoute component: redirige si no tiene rol adecuado
- Lazy loading en TODAS las páginas

12. src/components/common/
Componentes base reutilizables. Para cada uno: código JSX completo con Tailwind, props documentadas con comentarios.

Button.jsx:
- Props: variant ('primary'|'secondary'|'ghost'|'danger'|'outline'), size ('sm'|'md'|'lg'), loading (boolean), disabled, fullWidth, onClick, children, type, icon
- primary: fondo accent, hover accent-hover
- secondary: fondo surface-2, borde border
- ghost: transparente, hover surface-2
- Cuando loading: spinner animado, deshabilita click

Input.jsx:
- Props: label, name, type, placeholder, value, onChange, error, hint, required, disabled, icon (left), suffix
- Estados visuales: normal, focus (borde accent), error (borde rojo + mensaje)

Modal.jsx:
- Props: isOpen, onClose, title, children, size ('sm'|'md'|'lg'|'xl'), showCloseButton
- Overlay oscuro, animación de entrada, cierre con Escape y click fuera

Card.jsx:
- Props: children, className, hover (boolean), padding ('sm'|'md'|'lg'), glass (boolean)

Badge.jsx:
- Props: variant ('default'|'accent'|'success'|'warning'|'error'|'gold'), size, children

Spinner.jsx:
- Props: size, color
- Animación CSS pura (no librerías)

Table.jsx:
- Props: columns[{key, label, render}], data[], loading, emptyMessage, onRowClick
- Renderizado genérico basado en columns

Pagination.jsx:
- Props: currentPage, totalPages, onPageChange, showInfo (boolean), total, limit

Toast.jsx:
- Wrapper de react-hot-toast con estilos del sistema de diseño

13. src/components/layout/
Navbar.jsx:
- Logo MAP + nombre artista
- Links: Música, Eventos, Blog, Tienda
- Si autenticado: avatar + dropdown (Mi cuenta, Mis pedidos, Cerrar sesión)
- Si no: botones Login / Unirse
- Mobile: hamburger menu con drawer lateral
- Scroll: cambia de transparente a background oscuro

Footer.jsx:
- Logo + descripción corta
- Links por columnas: Artista, Música, Comunidad, Legal
- Redes sociales del artista (desde ArtistContext)
- Newsletter signup inline
- Copyright

Layout.jsx:
- Navbar + children + Footer
- Helmet con meta tags base

DashboardLayout.jsx:
- Sidebar colapsable + header + children
- Sidebar: links de navegación admin con íconos
- Header: breadcrumb + nombre usuario + logout

Todo el código completo y funcional.
```

---

## PROMPT 6 — Frontend: Home y Páginas Públicas

```
CONTEXTO: [PEGAR CONTEXTO BASE AQUÍ]
Setup del frontend completo. Sistema de diseño listo.

Construye la página Home (Landing Principal) y las páginas públicas de MAP.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
HOME — src/pages/public/Home.jsx
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Debe verse al nivel de Spotify, Apple Music o Warner Music.
Artista: Cabitaxx. Género: urbano/colombiano.

SECCIONES EN ORDEN (todas en el mismo archivo Home.jsx pero importando subcomponentes de src/components/home/):

1. HeroSection.jsx
- Full screen (100vh)
- Background: imagen/video del artista con overlay gradiente oscuro
- Texto principal: "CABITAXX" en Bebas Neue, tamaño enorme
- Subtítulo: género musical
- Botones: "Escuchar Ahora" (accent) y "Ver Eventos"
- Scroll indicator animado (flecha hacia abajo pulsante)
- Partículas o efecto visual de fondo (puro CSS, sin librerías)

2. LatestReleaseSection.jsx
- Título: "Último Lanzamiento"
- Card grande: cover del álbum/single, título, fecha
- Botones de streaming: Spotify, Apple Music, YouTube, Deezer (con íconos SVG inline)
- Contador animado de reproducciones totales

3. FeaturedSongsSection.jsx
- Título: "Canciones"
- Grid de 3-4 canciones destacadas (datos de ArtistContext o API)
- Cada song card: cover, título, duración, botón play (abre link a Spotify)
- Botón "Ver todas" → /canciones

4. UpcomingEventsSection.jsx
- Título: "Próximos Eventos"
- Máximo 3 eventos próximos
- Cada card: fecha grande, ciudad, venue, botón "Conseguir Entradas"
- Si no hay eventos: mensaje "Pronto anunciaremos fechas"
- Botón "Ver todos" → /eventos

5. AboutSection.jsx
- Foto del artista (horizontal o vertical)
- Bio corta del artista (desde ArtistContext)
- Estadísticas animadas: seguidores Spotify, reproducciones totales, años activo, shows realizados
- Botón "Conocer más"

6. GalleryPreviewSection.jsx
- Grid masonry de 6 imágenes (las más recientes de la galería)
- Hover: overlay oscuro con ícono de ampliar
- Lightbox simple al hacer click
- Botón "Ver galería completa"

7. MerchandiseSection.jsx
- Título: "Tienda Oficial"
- Grid de 4 productos destacados
- Cada card: imagen, nombre, precio con formato COP
- Badge "NUEVO" o "AGOTADO" según estado
- Botón "Ver tienda" → /tienda

9. NewsSection.jsx
- Últimas 3 noticias/posts
- Cada card: imagen, categoría badge, título, fecha, excerpt corto
- Botón "Ver todo" → /noticias

10. SocialSection.jsx
- Fila de redes sociales con contadores (desde artist_social_links)
- Links a: TikTok, Instagram, YouTube, Spotify, Facebook
- Estilo: íconos grandes con contador de seguidores debajo

11. NewsletterSection.jsx
- Fondo accent o gradient
- Título: "Sé el Primero en Saberlo"
- Input de email + botón suscribir
- Llama a /api/v1/artists/:artist_id/newsletter/subscribe
- Feedback visual: success/error con toast

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PÁGINAS PÚBLICAS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

src/pages/public/Songs.jsx:
- Grid de canciones con filtros (todos, álbum, año)
- Búsqueda en tiempo real con debounce
- Cada SongCard: cover, título, álbum, duración, links streaming
- Paginación

src/pages/public/SongDetail.jsx:
- Cover grande, título, bio de la canción
- Player de Spotify embebido (iframe)
- Letra de la canción con scroll sincronizable
- Canciones relacionadas al fondo

src/pages/public/Events.jsx:
- Lista y vista mapa (tabs)
- Filtros: ciudad, fecha, tipo
- Cada EventCard: fecha destacada, nombre, venue, ciudad, precio desde, botón entradas

src/pages/public/EventDetail.jsx:
- Banner del evento
- Info completa: fecha, hora, venue, dirección, mapa Google Maps embed
- Tickets disponibles: muestra tiers con precio y cantidad restante
- Formulario de compra (requiere auth, si no → modal login)

src/pages/public/Blog.jsx y BlogDetail.jsx:
- Lista de posts filtrable por tag
- BlogDetail: imagen header, contenido HTML sanitizado, compartir en redes, posts relacionados

src/pages/public/Store.jsx:
- Filtros: categoría, precio, tipo, orden
- Grid de productos con ProductCard
- ProductCard: imagen, nombre, precio, badge de estado, botón "Añadir al carrito"

src/pages/public/ProductDetail.jsx:
- Galería de imágenes con thumbnail selector
- Nombre, precio, descripción
- Selector de variantes (talla, color)
- Selector de cantidad
- Botón "Añadir al carrito" → actualiza CartContext
- Sección de productos relacionados

src/pages/public/Cart.jsx:
- Lista de items del carrito (desde CartContext)
- Modificar cantidad, eliminar
- Input de cupón con validación en tiempo real
- Resumen: subtotal, descuento, envío, total
- Botón "Finalizar Compra" → /checkout

src/pages/public/Checkout.jsx:
- Requiere auth (ProtectedRoute)
- Paso 1: Dirección de envío
- Paso 2: Resumen del pedido
- Paso 3: Confirmación (llama al API checkout, muestra número de orden)

src/pages/public/Gallery.jsx:
- Grid masonry responsive
- Filtros por categoría
- Lightbox con navegación anterior/siguiente
- Soporte para imágenes y videos

ANIMACIONES (puro CSS/Tailwind):
- Fade in on scroll para cada sección (IntersectionObserver)
- Hover effects en cards (scale, shadow)
- Contadores animados (número sube de 0 al valor final)
- Transiciones suaves entre páginas (opacity)

SEO EN CADA PÁGINA (react-helmet-async):
- title, meta description, og:title, og:description, og:image, og:url, twitter:card
```

---

## PROMPT 7 — Frontend: Dashboard Admin

```
CONTEXTO: [PEGAR CONTEXTO BASE AQUÍ]
Home y páginas públicas completas.

Construye el Dashboard Administrativo completo.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PÁGINAS DE USUARIO (Autenticadas)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

src/pages/user/MyAccount.jsx:
- Formulario editar perfil: nombre, avatar (upload), email (no editable)
- Cambiar contraseña
- Preferencias de notificaciones

src/pages/user/MyOrders.jsx:
- Lista de pedidos con estado visual (badge de color)
- Cada row: número, fecha, artículos, total, estado, botón "Ver detalle"
- Modal de detalle: productos, cantidades, dirección, seguimiento

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
DASHBOARD ADMINISTRATIVO
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Usa DashboardLayout con sidebar.
Paleta: mantiene el dark theme pero con superficie ligeramente más clara.

src/pages/admin/Dashboard.jsx (home del admin):
KPIs en cards:
- Reproducciones totales hoy / esta semana / este mes
- Nuevos seguidores hoy / esta semana
- Ventas totales (COP) este mes
- Pedidos pendientes
- Próximo evento (días restantes)

Gráficas (Chart.js o Recharts — el que prefieras):
- Reproducciones por día (últimos 30 días) — línea
- Ventas por día (últimos 30 días) — barras
- Distribución por tipo de producto — dona

Tablas rápidas:
- Últimos 5 pedidos con estado
- Últimas 5 canciones más reproducidas

src/pages/admin/SongsAdmin.jsx:
- Tabla con: cover, título, álbum, reproducciones, likes, estado, acciones
- Botón "Nueva canción" → abre modal formulario
- Modal formulario canción: título, slug (auto-generado), duración, letra, descripción, upload cover, upload audio, fecha lanzamiento, estado, links streaming (Spotify, Apple, YouTube)
- Acciones por fila: editar (abre modal), eliminar (confirma), cambiar estado

src/pages/admin/EventsAdmin.jsx:
- Tabla de eventos con: nombre, fecha, ciudad, capacidad, entradas vendidas, estado
- Formulario crear/editar: datos del evento + creación de tiers de tickets
- Vista de asistentes por evento

src/pages/admin/StoreAdmin.jsx:
- Tabs: Productos | Pedidos | Cupones | Categorías
- Productos: tabla con stock, precio, tipo, estado + modal formulario completo
- Pedidos: tabla con filtros de estado, actualización de estado inline
- Cupones: tabla + formulario crear cupón con validaciones

src/pages/admin/PostsAdmin.jsx:
- Editor de texto rico (usa textarea simple con markdown o integra TipTap si quieres)
- Gestión de noticias y blog en un solo panel con tab type

src/pages/admin/GalleryAdmin.jsx:
- Grid drag-and-drop para reordenar (usa CSS drag API, no librerías externas)
- Upload múltiple de imágenes/videos
- Editar título, descripción, categoría por item

src/pages/admin/NewsletterAdmin.jsx:
- Lista de suscriptores con export CSV (genera el CSV en el frontend desde los datos)
- Crear y enviar campaña: asunto, contenido HTML

src/pages/admin/AnalyticsAdmin.jsx:
- Gráficas detalladas: reproducciones, ventas, fans, tráfico por página
- Filtros de rango de fecha
- Export de datos a CSV

COMPONENTE REUTILIZABLE PARA ADMIN:
src/components/admin/DataTable.jsx:
- Props: columns[], data[], loading, onAdd, onEdit, onDelete, searchable, filters[]
- Búsqueda integrada
- Paginación
- Acciones por fila configurables
- Empty state con ilustración simple SVG

src/components/admin/FormModal.jsx:
- Props: isOpen, onClose, title, children, onSubmit, loading
- Footer con botones Cancelar / Guardar
```

---

## PROMPT 8 — SEO y Optimización

```
CONTEXTO: [PEGAR CONTEXTO BASE AQUÍ]
Todo el sistema está construido. Ahora optimizamos SEO y rendimiento.

OBJETIVO: Lighthouse score > 95 en todas las métricas.

BACKEND:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. src/routes/seo.routes.js
Endpoints públicos para SEO:
- GET /sitemap.xml → genera sitemap dinámico con todas las páginas del artista
- GET /robots.txt → devuelve robots.txt con referencia al sitemap
- GET /api/v1/seo/:artist_slug → devuelve meta tags configurados del artista

2. Sitemap dinámico (sitemap.service.js):
Incluye estas URLs con lastmod y priority:
- / (prioridad 1.0, daily)
- /canciones (0.9, weekly)
- /canciones/:slug (0.8, monthly) — genera una por canción
- /eventos (0.9, daily)
- /eventos/:slug (0.8, weekly) — genera una por evento
- /blog (0.8, weekly)
- /blog/:slug (0.7, monthly) — genera una por post
- /tienda (0.8, weekly)
- /tienda/:slug (0.7, monthly) — genera una por producto
- /galeria (0.7, monthly)

3. Schema.org estructurado para:
- MusicGroup (artista)
- MusicRecording (canción)
- Event (evento)
- Article (blog/noticia)
- Product (producto de tienda)
Genera los JSON-LD completos para cada tipo.

FRONTEND:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. src/components/seo/SEOHead.jsx
Componente reutilizable usando react-helmet-async:
Props: title, description, keywords, image, url, type, schema
- Genera: title, meta description, keywords, canonical, og:*, twitter:*, JSON-LD
- Title format: "[Título] | Cabitaxx" (o "[Título] | MAP" para admin)
- Imagen por defecto: og:image del artista

Úsalo en TODAS las páginas así:
```jsx
<SEOHead
  title="Canciones"
  description="Escucha toda la discografía de Cabitaxx"
  image={artist.og_image_url}
  schema={songListSchema}
/>
```

2. Optimizaciones de rendimiento en cada página:
- Lazy loading de TODAS las imágenes (loading="lazy" + IntersectionObserver)
- Imágenes con width y height explícito para evitar CLS
- Preload de imagen hero en Home
- Prefetch de rutas probables al hover en links de navbar

3. src/utils/performance.js:
```javascript
// Debounce para búsquedas
export const debounce = (fn, delay) => { ... }

// Lazy load de imágenes con IntersectionObserver
export const lazyLoadImages = () => { ... }

// Precargar ruta en hover
export const prefetchRoute = (path) => { ... }

// Formatear números grandes (1.2M, 45K)
export const formatNumber = (n) => { ... }

// Formatear precios COP
export const formatCOP = (amount) => new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(amount)

// Formatear fechas en español
export const formatDate = (date, format) => { ... }
```

4. Code splitting adicional:
En el router, agrupa los imports lazy por módulo:
- Chunk público: Home, Songs, Events, Blog, Store, Gallery
- Chunk user: MyAccount, MyOrders
- Chunk admin: todos los /admin/*

5. Configuración de Vite para producción (vite.config.js):
- Build con chunking manual
- Compresión de assets
- Minificación
- Source maps en desarrollo solamente

6. Service Worker básico (vite-plugin-pwa o manual):
- Cache de assets estáticos
- Cache de respuestas de API GET con revalidación
- Offline fallback page
```

---

## PROMPT 9 — SaaS Multi-Tenant

```
CONTEXTO: [PEGAR CONTEXTO BASE AQUÍ]
El sistema completo está funcionando con Cabitaxx como primer artista.
Ahora convierte MAP en un SaaS completo vendible a cualquier artista.

BACKEND:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. Middleware de tenant resolution (src/middlewares/tenant.middleware.js):
- Resuelve el artista activo de 3 formas (en orden de prioridad):
  a) Header: X-Artist-Slug
  b) Subdominio: cabitaxx.masterartistplatform.com → slug = 'cabitaxx'
  c) Query param: ?artist=cabitaxx (solo para desarrollo)
- Adjunta req.artist a todas las requests
- Si el slug no existe → 404 con mensaje claro
- Cache del artista en memoria (30 segundos) para no consultar DB en cada request

2. Actualizar TODOS los controllers para usar req.artist.id:
- Los controllers ya reciben artist_id del middleware, no de la URL
- Excepción: rutas de superadmin siguen recibiendo artist_id explícito

3. Super Admin — src/routes/superadmin.routes.js:
Endpoints protegidos (solo rol superadmin):
- GET /superadmin/artists → lista todos los artistas con métricas
- POST /superadmin/artists → crear nuevo artista en el sistema
- PUT /superadmin/artists/:id → editar artista
- GET /superadmin/artists/:id/stats → métricas detalladas
- POST /superadmin/artists/:id/activate
- POST /superadmin/artists/:id/deactivate
- POST /superadmin/users/:id/assign-role → asignar rol artist_admin a un user para un artista específico
- GET /superadmin/system/stats → stats globales del sistema

4. Sistema de planes SaaS (src/models/plans.js):
Define 3 planes:
- STARTER: 1 artista, sin tienda, máx 50 canciones
- PRO: 1 artista, con tienda, canciones ilimitadas
- ENTERPRISE: múltiples artistas, soporte prioritario, analíticas avanzadas

Middleware checkPlan.middleware.js:
- Verifica que el plan del artista permite usar el feature solicitado
- Si no → 403 con mensaje "Actualiza tu plan para acceder a [feature]"

FRONTEND:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. Theming dinámico por artista (src/context/ThemeContext.jsx):
- Carga los colores del artista desde ArtistContext
- Inyecta CSS variables en :root dinámicamente:
  ```javascript
  document.documentElement.style.setProperty('--color-accent', artist.theme.primary_color)
  document.documentElement.style.setProperty('--color-secondary', artist.theme.secondary_color)
  ```
- Actualiza el favicon dinámicamente con el logo del artista
- Actualiza el title base del documento

2. src/pages/superadmin/SuperAdminDashboard.jsx:
- Métricas globales: total artistas, total fans, total revenue (si aplica)
- Tabla de artistas con: nombre, plan, fans, canciones, estado, acciones
- Botón "Nuevo Artista" → formulario completo de onboarding

3. src/pages/superadmin/ArtistOnboarding.jsx:
Wizard de 4 pasos para crear un nuevo artista:
- Paso 1: Información básica (nombre, slug, género, país)
- Paso 2: Upload avatar y banner
- Paso 3: Redes sociales
- Paso 4: Configuración de tema (color picker, fuentes)
- Al finalizar: crea el artista, asigna un admin, muestra resumen

4. src/utils/tenant.js:
```javascript
// Detecta el artista activo según el dominio/subdominio actual
export const detectArtistSlug = () => {
  // En desarrollo: usa VITE_ARTIST_SLUG del .env
  // En producción: extrae del subdominio
  const hostname = window.location.hostname
  if (hostname === 'localhost') return import.meta.env.VITE_ARTIST_SLUG
  const parts = hostname.split('.')
  if (parts.length >= 3) return parts[0] // cabitaxx.map.com → cabitaxx
  return import.meta.env.VITE_ARTIST_SLUG // fallback
}
```

5. Actualizar ArtistContext para usar detectArtistSlug() en vez de la constante hardcodeada.

6. src/pages/public/ArtistNotFound.jsx:
- Página 404 elegante para cuando el slug del artista no existe
- "Este artista no tiene una página en MAP"
- Link a la landing principal de MAP

DOCUMENTACIÓN FINAL:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Genera un README.md completo del proyecto con:
- Descripción del proyecto y visión
- Arquitectura de alto nivel (diagrama en texto)
- Requisitos del sistema
- Guía de instalación paso a paso (backend + frontend)
- Variables de entorno necesarias
- Comandos disponibles (dev, build, test)
- Guía para agregar un nuevo artista al sistema
- Convenciones del proyecto
- Roadmap pendiente
```

---

*MAP — Master Artist Platform | MasterCode Company*
*Primer artista: Cabitaxx (Juan Esteban Cabas Torres)*
*Desarrollado con propósito: este proyecto es el primer caso de éxito.*

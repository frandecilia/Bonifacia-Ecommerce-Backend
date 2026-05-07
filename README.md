# Bonifacia · Backend de E-commerce

API REST para una tienda online de productos de aromaterapia y perfumería
(Home Sprays, difusores de auto, difusores de ambiente, perfumes).

> Repo: `frandecilia/Bonifacia-Ecommerce-Backend`
> Rama integradora actual: **`integration/latest`** (creada desde `develop`,
> reúne todos los avances: auth, products, categories, customers, cart, orders).

---

## 1. Stack

- **Runtime**: Node.js
- **Framework HTTP**: Express 5
- **Base de datos**: MongoDB + Mongoose
- **Auth**: JWT (`jsonwebtoken`) + `bcrypt` para hashing
- **CORS**: `cors`
- **Variables de entorno**: `dotenv`
- **Dev**: `nodemon`
- **Gestor de paquetes**: `pnpm` (10.x)

---

## 2. Estructura del proyecto

```
src/
├── server.js                 # bootstrap Express + middlewares + rutas
├── db/
│   └── config.db.js          # conexión a MongoDB (lee process.env.MONGO_ACCESS)
├── routes/
│   ├── index.routes.js       # monta /auth /products /categories /customers /cart /orders
│   ├── auth.routes.js
│   ├── product.routes.js
│   ├── category.routes.js
│   ├── customer.routes.js
│   ├── cart.routes.js
│   └── order.routes.js
├── controllers/              # capa HTTP: parseo de req, respuestas
├── service/                  # lógica de negocio
├── models/                   # esquemas Mongoose: User, Product, Category, Cart, Order
└── middleware/
    ├── auth.middleware.js            # verifica JWT y popula req.user
    └── authorizeRoles.middleware.js  # gate por rol(es)
```

Patrón **routes → middleware (auth/role) → controller → service → model**.

---

## 3. Modelo de dominio

| Modelo     | Campos clave                                                                                       | Notas                                                                  |
|------------|----------------------------------------------------------------------------------------------------|------------------------------------------------------------------------|
| `User`     | name, username, email, password, role (`admin`\|`customer`), phone, address                        | password hasheado con bcrypt; método `comparePassword`.                |
| `Category` | name (único)                                                                                       | Catálogos: Home Spray, Difusor Auto, Difusor Ambiente, Perfume.        |
| `Product`  | name, category (ref), subCategory, description, price, scents[], image, featured, stock           | `featured` alimenta New Arrivals/Slider.                               |
| `Cart`     | user (ref, único), items: [{ product, quantity }]                                                  | Un carrito por usuario.                                                |
| `Order`    | user (ref), items: [{ product, quantity, price }], total, status, shippingAddress                  | status: pending → confirmed → shipped → delivered (o cancelled).       |

---

## 4. Endpoints

Base URL: `/api`

### Auth (`/api/auth`)
| Método | Path        | Auth | Descripción                          |
|--------|-------------|------|--------------------------------------|
| POST   | `/register` | —    | Registro (devuelve user + token).    |
| POST   | `/login`    | —    | Login con email + password.          |
| GET    | `/verify`   | —    | Verifica un token (controller).      |

### Products (`/api/products`)
| Método | Path      | Auth          | Rol     |
|--------|-----------|---------------|---------|
| GET    | `/`       | público       | —       |
| GET    | `/:id`    | público       | —       |
| POST   | `/`       | JWT           | admin   |
| PUT    | `/:id`    | JWT           | admin   |
| DELETE | `/:id`    | JWT           | admin   |

### Categories (`/api/categories`)
Mismo patrón que products: lectura pública, escritura solo `admin`.

### Customers (`/api/customers`) — perfil propio
| Método | Path  | Auth | Rol                |
|--------|-------|------|--------------------|
| GET    | `/me` | JWT  | admin \| customer  |
| PUT    | `/me` | JWT  | admin \| customer  |

### Cart (`/api/cart`) — solo `customer`
| Método | Path                  | Acción                          |
|--------|-----------------------|---------------------------------|
| GET    | `/`                   | Obtener carrito propio.         |
| POST   | `/items`              | Agregar item.                   |
| PUT    | `/items`              | Actualizar cantidad.            |
| DELETE | `/items/:productId`   | Quitar item.                    |
| DELETE | `/`                   | Vaciar carrito.                 |

### Orders (`/api/orders`)
| Método | Path                  | Rol                | Acción                          |
|--------|-----------------------|--------------------|---------------------------------|
| POST   | `/`                   | customer           | Crear orden a partir del carrito. |
| GET    | `/my`                 | customer           | Listar mis órdenes.             |
| PUT    | `/:orderId/status`    | admin \| customer  | Cambiar estado (admin avanza, customer cancela). |

Header de auth en rutas privadas: `Authorization: Bearer <token>`.

---

## 5. Estado actual

**Funcional end-to-end**:
- Registro, login, emisión y verificación de JWT.
- CRUD de productos y categorías (admin).
- Gestión de perfil (`/customers/me`).
- Carrito por usuario (CRUD de items).
- Creación y consulta de órdenes; transición de estado.
- Autorización por roles (`admin`, `customer`).

**Ramas del repo**:
- `main` — commit inicial del backend.
- `feature/auth` — sistema de auth (mergeada a develop vía PR #1).
- `feature/products` — productos + categorías (PR #2).
- `feature/cart-customer` — carrito + perfil (PR #3).
- `feature/order` — órdenes + roles (PR #4).
- `develop` — integra los 4 features anteriores. **Estado más avanzado.**
- `integration/latest` — *(esta rama)* fork de `develop` con este README.

---

## 6. Cómo correrlo localmente

### Requisitos
- Node.js 18+ (recomendado 20 LTS).
- `pnpm` 10 (`npm i -g pnpm`).
- Instancia de MongoDB (local en `mongodb://127.0.0.1:27017` o Atlas).

### Pasos

```bash
# 1. Clonar y ubicarse en la rama integradora
git clone https://github.com/frandecilia/Bonifacia-Ecommerce-Backend.git
cd Bonifacia-Ecommerce-Backend
git checkout integration/latest

# 2. Instalar dependencias
pnpm install

# 3. Crear .env en la raíz (NO commitear, ya está en .gitignore)
```

`.env` mínimo:

```dotenv
PORT=4000
MONGO_ACCESS=mongodb://127.0.0.1:27017/bonifacia
JWT_SECRET=cambia-esto-por-algo-largo-y-random
```

> **Importante**: `src/db/config.db.js` lee la URI desde **`MONGO_ACCESS`**,
> no `MONGO_URI`. La plantilla `dot.env` del repo dice `MONGO_URI` —
> eso es un desfase a corregir (ver §7).

```bash
# 4. Iniciar MongoDB (si es local)
# 5. Levantar el server en modo dev
pnpm dev          # nodemon src/server.js
# o producción
pnpm start
```

Verificar: `GET http://localhost:4000/` debería responder
`Bienvenido a mi API`.

### Probarlo
- Hay colecciones de Postman en `postman/` y `.postman/`.
- Flujo sugerido: `POST /api/auth/register` → guardar token →
  `GET /api/products` → `POST /api/cart/items` → `POST /api/orders`.

---

## 7. Cosas que faltan / mejoras sugeridas

### Bloqueantes para producción
1. **`JWT_SECRET` con fallback hardcodeado** (`'fallback_secret'` en
   `src/service/auth.service.js`). Si la env var no está cargada el
   server arranca igual y firma tokens con un secreto público. Hacer
   que el bootstrap aborte si falta `JWT_SECRET`.
2. **`MONGO_ACCESS` vs `MONGO_URI`** desincronizado entre `config.db.js`
   y `dot.env`. Unificar el nombre.
3. **Sin validación de input** en controllers (campos requeridos, tipos,
   formato de email, fortaleza de password, ObjectId válido). Sumar
   `zod` o `joi` + middleware de validación por ruta.
4. **Sin rate limiting** en `/auth/login` ni `/auth/register`.
   Agregar `express-rate-limit`.
5. **Sin helmet** ni cabeceras de seguridad. CORS está en modo abierto.
   Configurar `cors({ origin: [...] })` con whitelist.

### Calidad de código
6. **`scr/` (con typo)** quedó en disco como carpeta legacy del repo
   anterior — no está trackeada en `develop`, pero conviene borrarla
   localmente para evitar confusión.
7. **`index.html` vacío** en la raíz. Eliminar o reemplazar por un
   placeholder de health-check.
8. **No hay manejo centralizado de errores**. Cada controller hace
   `try/catch` y devuelve 400. Sumar un error-handler middleware
   (`(err, req, res, next)`) y throw `AppError` desde los services.
9. **`bufferTimeoutMS: 2147483647`** y `socketTimeoutMS: 0` en
   `config.db.js` — valores extremos que esconden timeouts reales en
   prod. Volver a defaults sensatos.
10. **Sin paginación** en `GET /products` ni `GET /orders/my`. Agregar
    `?page=&limit=`.
11. **`Order.updateStatus`** acepta `customer` en la ruta pero la
    autorización fina (¿puede el customer hacer cualquier transición
    de estado?) vive en el service — vale validar que el flujo
    permitido sea solo `pending → cancelled` para customer.

### Features que probablemente vienen
12. **Pagos** (Mercado Pago / Stripe) — al crear la orden, hoy se
    asume pago externo / manual.
13. **Imágenes de producto**: hoy `image` es un `String` (URL).
    Falta upload (Cloudinary, S3) y validación.
14. **Stock**: existe el campo pero no se decrementa al confirmar
    orden ni se valida disponibilidad al agregar al carrito.
15. **Tamaños/variantes** del frasco (100ml, 200ml…) — el comentario
    en `Product.js` ya lo marca como pendiente.
16. **Reset / forgot password** y verificación de email.
17. **Documentación OpenAPI/Swagger** (`swagger-jsdoc` + `swagger-ui-express`).

### Infra / DX
18. **Tests**: no hay. Sumar Jest + supertest, al menos para auth y orders.
19. **Linter/formatter**: no hay ESLint ni Prettier configurados.
20. **CI**: ningún workflow. Sumar GitHub Action que corra `pnpm install`
    + lint + tests en cada PR a `develop`.
21. **Dockerfile + docker-compose** (app + Mongo) para que cualquiera
    levante el stack en un comando.
22. **Variables sensibles**: hoy hay un `dot.env` plantilla en el
    historial de `feature/auth` (sin secretos reales, todo comentado).
    Reemplazar por `.env.example` y mantenerlo trackeado.

---

## 8. Resumen ejecutivo

API funcional con los cinco bloques clásicos de un e-commerce
(auth, catálogo, carrito, perfil, órdenes) listos y autorizados por rol.
Para correrlo solo hace falta MongoDB y un `.env` con `MONGO_ACCESS`,
`JWT_SECRET` y `PORT`. Lo más urgente antes de exponerlo es endurecer
auth (quitar fallback del secret, sumar rate-limit, helmet, CORS
restrictivo) y validar inputs. Después: pagos, manejo de stock, upload
de imágenes y tests.

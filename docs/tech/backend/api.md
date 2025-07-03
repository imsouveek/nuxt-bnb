# NuxtBnB API Service

This is the backend API for NuxtBnB — a simplified Airbnb clone built with **Express**, **MongoDB**, and a modular, resource-based architecture. It powers features like authentication, user management, listings, image uploads, availability scheduling, and public search.

---

## Folder Structure

```
server/api/                           # API service root
├── bootstrap                         # Bootstraps models, services, controllers and middleware
├── middleware                        # Auth, query, and CSRF middleware
├── resources                         # RESTful modules (auth, users, homes, etc.)
│   ├── auth
│   ├── bookings
│   ├── homes
│   │   ├── availabilities
│   │   └── reviews
│   ├── images
│   ├── search
│   ├── tokens
│   └── users
├── services                          # Shared services (email, csrf, etc.)
├── tests                             # Jest test suite (scoped by resource)
│   ├── bootstrap                     # Unit tests for db connection
│   ├── jest                          # Setup for unit tests
│   ├── resources
│   │   ├── auth
│   │   ├── bookings
│   │   ├── homes
│   │   │   ├── availabilities
│   │   │   └── reviews
│   │   ├── images
│   │   ├── search
│   │   └── users
│   ├── services                      # Tests for shared services
│   └── utils                         # Stateless utilities for testing
└── utils                             # Stateless helper utilities
```

---

## Bootstrapping

The server initializes via:

```js
bootstrap/index.js
```

This:
- Connects to MongoDB (`connectDb.js`)
- Bootstraps models → services → controllers
- Applies shared middleware (auth, CSRF, query param parsing)

Exports:

```js
export async function bootstrapServer(config)
```

---

## Authentication

- JWT-based access + refresh tokens
- Local auth and Google OAuth supported
- Refresh tokens stored in DB (per user)
- One-time tokens used for uploads and password reset (non-JWT)

---

## CSRF Protection

> NuxtBnB uses a **double-submit cookie strategy**.

Clients must:

1. Call `POST /csrf-token` to receive a signed CSRF cookie
2. Extract the token value (from cookie)
3. Include it in a custom header (`X-CSRF-Token`) in all **unsafe** requests

All `POST`, `PATCH`, and `DELETE` routes are CSRF-protected.

---

## Routes

### Authenticated

| Method | Path                                  | Description                         |
|--------|---------------------------------------|-------------------------------------|
| POST   | `/auth/login`                         | Login                               |
| POST   | `/auth/google-auth`                   | Login with Google                   |
| POST   | `/auth/forgot`                        | Forgot password                     |
| POST   | `/auth/reset`                         | Reset password                      |
| POST   | `/auth/refresh`                       | Refresh auth token                  |
| POST   | `/users/`                             | Create account                      |
| GET    | `/users/`                             | Get profile                         |
| PATCH  | `/users/`                             | Update profile                      |
| DELETE | `/users/`                             | Delete account                      |
| POST   | `/users/token`                        | Generate DB token                   |
| POST   | `/users/logout`                       | Logout current session              |
| POST   | `/users/logoutAll`                    | Logout all sessions                 |
| POST   | `/homes/`                             | Create home                         |
| GET    | `/homes/`                             | Get my homes                        |
| GET    | `/homes/:id`                          | Get specific home                   |
| PATCH  | `/homes/:id`                          | Update home                         |
| DELETE | `/homes/:id`                          | Delete home                         |
| POST   | `/homes/:id/availabilities`           | Set availability                    |
| GET    | `/homes/:id/availabilities`           | Get availability                    |
| DELETE | `/homes/:id/availabilities`           | Remove availability dates           |
| GET    | `/homes/:id/reviews`                  | View reviews (auth)                 |
| POST   | `/images/`                            | Upload image (base64 or URL)        |
| DELETE | `/images/:id`                         | Delete image                        |
| POST   | `/bookings`                           | Create booking                      |
| GET    | `/bookings`                           | List bookings                       |
| GET    | `/bookings/:id`                       | View booking                        |
| PATCH  | `/bookings/:id`                       | Update booking                      |

---

### Public Search (No Auth)

| Method | Path                                     | Description                         |
|--------|------------------------------------------|-------------------------------------|
| GET    | `/search/homes`                          | Search homes                        |
| GET    | `/search/homes/:id`                      | Get public home details             |
| GET    | `/search/homes/:id/owner`                | Get host info                       |
| GET    | `/search/homes/:id/reviews`              | Get public reviews                  |
| GET    | `/search/homes/:id/availabilities`       | View availability calendar          |
| GET    | `/images/:id`                            | Retrieve image (JPEG)               |
| POST   | `/csrf-token`                            | Issue CSRF cookie                   |

---

## Middleware

| File            | Path                         | Purpose                                  |
|-----------------|------------------------------|------------------------------------------|
| `auth.js`       | `middleware/`                | JWT auth validation                      |
| `queryparams.js`| `middleware/`                | Adds `req.queryparams` (sort, limit, etc.) |
| `csrf.js`       | `services/`                  | CSRF cookie + header verification        |

---

## Email Service

Located in:  
```js
server/services/email.js
```

Used for password resets. Powered by `nodemailer` and:

- `SMTP_HOST`
- `SMTP_PORT`
- `SMTP_FROM` (optional)

---

## Testing

> Managed via `./scripts/dev-env` for containerized isolation.

NuxtBnB’s API has **comprehensive test coverage** using `jest` and `supertest`, with isolated Mongo and Mailpit containers.

**Coverage Summary:**

- Statements: 98.76%  
- Branches: 98.79%  
- Functions: 98.10%  
- Lines: 98.73%

Tests validate:

- Schema correctness
- Route behavior and edge cases
- Token issuance + expiry
- Auth flows and permission enforcement

**Run full test suite:**
```bash
./scripts/dev-env test api
```

**Run specific test:**
```bash
./scripts/dev-env test api --jest server/api/tests/bootstrap/connectDb.test.js
```

---

## Environment Variables

| Variable                | Description                                            |
|-------------------------|--------------------------------------------------------|
| `HOST`                  | Server hostname (e.g., `localhost`)                   |
| `NUXT_PORT`             | Port for Nuxt SSR API                                 |
| `API_DB_URL`            | MongoDB connection string                             |
| `API_DB_NAME`           | Database name                                          |
| `SMTP_HOST`             | SMTP server (e.g., Mailpit)                            |
| `SMTP_PORT`             | SMTP port (e.g., 1025)                                 |
| `ACCESS_SECRET`         | JWT access token secret                               |
| `ACCESS_LIFE`           | Access token TTL (e.g., `30s`)                        |
| `REFRESH_SECRET`        | JWT refresh token secret                              |
| `REFRESH_COOKIE`        | Cookie name for refresh token                         |
| `REFRESH_LIFE`          | Refresh token TTL (e.g., `7d`)                        |
| `CSRF_SECRET`           | CSRF token signing secret                             |
| `CSRF_COOKIE`           | CSRF cookie name                                      |
| `CSRF_LIFE`             | CSRF token TTL                                        |
| `CSRF_HEADER`           | Name of CSRF request header                           |
| `PASSWORD_TOKEN_EXPIRY` | Expiry for password reset token                       |
| `IMAGE_TOKEN_EXPIRY`    | Expiry for image upload token                         |
| `GOOGLE_AUTH_CLIENT_ID` | Google OAuth client ID                                |
| `PAYMENT_AUTH_HEADER`   | Custom header used for payment auth                   |
| `PAYMENT_AUTH_KEY`      | API key used for payment service validation           |

---

## Maintainer Notes

- Add new resources under `resources/`
- Extend middleware via `middleware/`
- Boot sequence: `bootstrap/index.js`
- Email logic, token helpers → `services/`
- Public-facing APIs live under `search/`

---

> Built for clarity, modularity, and scaling up without regrets.

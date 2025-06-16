# NuxtBnB — API service

This is the backend API for NuxtBnB, a simplified Airbnb clone built with **Express**, **MongoDB**, and a modular, resource-based architecture. This service powers features such as authentication, user management, home listings, image upload, availability scheduling, and public search.

---

## Folder Structure

```
server/api                      # Api service directory
├── bootstrap                   # Bootstraps models, services, controllers
├── middleware                  # Middlewares for auth and query parameters
├── resources                   # RESTful resources (auth, users, homes, images, search)
│   ├── auth
│   ├── bookings
│   ├── homes
│   │   ├── availabilities
│   │   └── reviews
│   ├── images
│   ├── search
│   ├── tokens
│   └── users
├── services                    # Non-resource services (e.g., email)
├── tests                       # Unit tests directory
│   ├── bootstrap               # Unit tests for mongoose connections and models setup
│   ├── jest                    # Setup for unit tests
│   ├── resources               # Unit tests, factories and fixtures for each resource
│   │   ├── auth
│   │   ├── bookings
│   │   ├── homes
│   │   │   ├── availabilities
│   │   │   └── reviews
│   │   ├── images
│   │   ├── search
│   │   └── users
│   └── utils                   # Stateless utilities for testing
└── utils                       # Stateless helper utilities for api services
```

---

## Bootstrapping

The server is initialized via:

```js
bootstrap/index.js
```

Which does the following:

- Connects to MongoDB using `connectDb.js`
- Builds models → services → controllers
- Injects shared middleware (e.g., auth, query parsing)

Exported entry:

```js
export async function bootstrapServer(config)
```

---

## Authentication

- Uses JWT for access and refresh tokens
- Supports local login, registration, and Google auth (if enabled)
- Refresh tokens are stored with the user
- Upload and password reset use one-time random tokens (not JWT)

---

## Routes
>Note: All POST, PATCH, and DELETE routes are protected by a double-submit CSRF strategy. Clients must first call /csrf-token to receive a signed CSRF cookie, and then include the extracted token in a request header.

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
| POST   | `/users/token`                        | Generate new DB token               |
| POST   | `/users/logout`                       | Logout current session              |
| POST   | `/users/logoutAll`                    | Logout all sessions                 |
| POST   | `/homes/`                             | Create home                         |
| GET    | `/homes/`                             | Get my homes                        |
| GET    | `/homes/:id`                          | Get my home                         |
| PATCH  | `/homes/:id`                          | Update my home                      |
| DELETE | `/homes/:id`                          | Delete my home                      |
| POST   | `/homes/:id/availabilities`           | Set availability                    |
| GET    | `/homes/:id/availabilities`           | Get availability                    |
| DELETE | `/homes/:id/availabilities`           | Remove availability dates           |
| GET    | `/homes/:id/reviews`                  | Read reviews (auth view)            |
| POST   | `/images/`                            | Upload base64 or URL image          |
| DELETE | `/images/:id`                         | Delete image                        |
| POST   | `/bookings`                           | Create booking                      |
| GET    | `/bookings`                           | Get bookings                        |
| GET    | `/bookings/:id`                       | Get specific booking                |
| PATCH  | `/bookings/:id`                       | Update booking                      |

### Public Search (no auth)

| Method | Path                                     | Description                                                                   |
|--------|------------------------------------------|-------------------------------------------------------------------------------|
| GET    | `/search/homes`                          | Search homes by location                                                      |
| GET    | `/search/homes/:id`                      | Get public home details                                                       |
| GET    | `/search/homes/:id/owner`                | Get home owner info                                                           |
| GET    | `/search/homes/:id/reviews`              | Get reviews                                                                   |
| GET    | `/search/homes/:id/availabilities`       | Get availability dates                                                        |
| GET    | `/images/:id`                            | Retrieve image (JPEG)                                                         |
| POST   | `/csrf-token`                            | Set signed CSRF cookie. Required before any POST, PATCH, or DELETE requests   |

---

## Middleware

| File            | Location                    | Purpose                                             |
|-----------------|-----------------------------|-----------------------------------------------------|
| `auth.js`       | `server/api/middleware/`    | JWT authentication middleware                       |
| `queryparams.js`| `server/api/middleware/`    | Parses `limit`, `sort`, etc. into `req.queryparams` |
| `csrf.js`       | `server/api/services/`      | Verifies CSRF token on unsafe requests              |

---

## Email Service

Located in `server/services/email.js`  
Used for:

- Password reset token emails

Uses `nodemailer` and values from config (`SMTP_HOST`, `SMTP_PORT`, etc.)

---

## Testing

> Testing is managed through custom CLI (`./scripts/dev-env`).  to manage the Docker-based development environment. See root README for details.

This backend is fully tested using **Jest** and **supertest**, with isolated test containers for Mongo and Mailpit. The tests are built for maximum coverage so that it can be used for 
1. Refactor with confidence
2. Ensure that edge cases are never broken
3. Identify redundant validations (and remove them)
4. Keep Mongoose schemas safe and expressive

Additional notes:
- `server/tests/` contains the full test suite
- Coverage report
  - Statements: 98.69 %
  - Branches: 98.2 %
  - Functions: 98.07 % 
  - Lines: 98.63 %

To run tests with coverage, use the following command from project root:
```bash
./scripts/dev-env test api
```
or, for specific files:
```bash
./scripts/dev-env test api --jest server/api/tests/bootstrap/connectDb.test.js
```
---

## Environment Variables

Below are the required `.env` variables for the API service:

| Variable                       | Description                                                                 |
|--------------------------------|-----------------------------------------------------------------------------|
| `HOST`                         | Hostname for app server (typically `localhost` in dev)                      |
| `NUXT_PORT`                    | External port exposed by the Nuxt/Express server                            |
| `API_DB_URL`                   | MongoDB connection string (including credentials and host)                  |
| `API_DB_NAME`                  | Name of the MongoDB database                                                |
| `SMTP_HOST`                    | SMTP server hostname (e.g., `mailserver` for Mailpit)                       |
| `SMTP_PORT`                    | SMTP server port (e.g., `1025` for Mailpit)                                 |
| `ACCESS_SECRET`                | Secret used to sign JWT access tokens                                       |
| `ACCESS_LIFE`                  | Access token expiry duration (e.g., `15m`, `30s`)                           |
| `REFRESH_SECRET`               | Secret used to sign refresh tokens                                          |
| `REFRESH_COOKIE`               | Name of the HTTP-only cookie used for storing the refresh token             |
| `REFRESH_LIFE`                 | Refresh token expiry duration (e.g., `1w`, `7d`)                            |
| `CSRF_SECRET`                  | Secret used to sign csrf cookies                                            |
| `CSRF_COOKIE`                  | Name of the cookie used for CSRF                                            |
| `CSRF_LIFE`                    | CSRF token expiry duration (e.g., `1w`, `7d`)                               |
| `CSRF_HEADER`                  | Name of CSRF Header                                                         |
| `PASSWORD_TOKEN_EXPIRY`        | Define duration after which password tokens expire                          |
| `IMAGE_TOKEN_EXPIRY`           | Define duration after which image upload tokens expire                      |
| `GOOGLE_AUTH_CLIENT_ID`        | Client ID for Google OAuth login                                            |


---

## Future Improvements

- Add payment integration (for booking flow)
- Implement structured error classes and logging

---

## Maintainer Notes

- You can extend the backend by adding a new folder under `resources/`
- All bootstrapping happens in `bootstrap/index.js`
- Public-facing APIs live under `search/`
- Any cross-resource or config-based logic (like emails) goes under `services/`

---

> Built for clarity, modularity, and scaling up without regrets.

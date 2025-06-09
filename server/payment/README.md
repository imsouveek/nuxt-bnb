# NuxtBnB — Payment Service

This is the payment service for NuxtBnB, a simplified Airbnb clone built with **Express**, **Prisma**, **Postgres**, and a modular, resource-based architecture with a strategy pattern for supporting multiple payment gateways. This service powers payment integration.

---

## Folder Structure

```
server/payment
├── bootstrap
│   └── prisma
│       ├── generated
│       │   └── prisma-client
│       │       └── runtime
│       └── migrations
│           └── 20250530220419_nuxtbnb_01
├── middleware
├── resources
│   └── orders
├── strategies
├── tests
│   ├── jest
│   └── resources
└── utils
```

---

## Bootstrapping

The server is initialized via:

```js
bootstrap/index.js
```

Which does the following:

- Connects to Postgres using `connectDb.js`
- Uses Prisma ORM for modeling the database
- Builds services → controllers
- Injects shared middleware (e.g., query parsing)

Exported entry:

```js
export async function bootstrapServer(config)
```

---

## Authentication

- TBD - Build authentication for server to server API calls

---

## Routes (Ongoing work)

### Authenticated

| Method | Path                                  | Description                         |
|--------|---------------------------------------|-------------------------------------|
| POST   | `/orders`                             | Create Payment Order                |
| GET    | `/orders`                             | Search Payment Order                |
| GET    | `/orders/:id`                         | Get specific payment order          |


### Public (no auth)
_Note: No unauthenticated public routes are currently exposed._

| Method | Path                                     | Description                   |
|--------|------------------------------------------|-------------------------------|


---

## Middleware

Located in `server/middleware/`:

| File            | Purpose                                             |
|-----------------|-----------------------------------------------------|
| `queryparams.js`| Parses `limit`, `sort`, etc. into `req.queryparams` |

---

### Testing (In Progress)

This backend is fully tested using **Jest** and **supertest**, with isolated test containers for Postgres.

- `server/tests/` contains the full test suite
- xx automated tests across all resources
- Coverage: xx% lines/functions/statements

To run tests with coverage, use the following command from project root:
```bash
./scripts/dev-env test payment
```
---

## Environment Variables

Stored in `.env` files in `tooling` directory. Required keys include:

```env
PORT=3000
PAYMENT_DB_URL=postgres://test:secret@postgres:5432
PAYMENT_DB_NAME=nuxtbnb
RAZORPAY_KEY_ID=xxxxx
RAZORPAY_KEY_SECRET=yyyy
```

---

## Future Improvements

- Add rate limiting middleware
- Improve error handling

---

## Maintainer Notes

- You can extend the backend by adding a new folder under `resources/`
- You can add more payment gateways by adding files under `strategies/` folder
- All bootstrapping happens in `bootstrap/index.js`
- You should define capabilities for this system to be PCI-DSS compliant

---

> Built for clarity, modularity, and scaling up without regrets.

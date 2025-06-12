# NuxtBnB — Payment Service

This is the payment microservice for **NuxtBnB**, a simplified Airbnb clone. It is built with **Express**, **Prisma**, and **PostgreSQL**, following a modular, resource-based architecture with a strategy pattern to support multiple payment gateways.

This service is designed to **separate core application logic from gateway-specific integration**, enabling maintainable and scalable multi-gateway support. Currently supports Razorpay.

---

## Folder Structure

```
server/payment/                 # Payment service directory
├── bootstrap                   # Bootstraps db connection, services, controllers
│   └── prisma                  # Prisma schema and migrations
├── middleware
├── resources                   # RESTful resources (orders, webhooks)
│   ├── orders
│   └── webhooks
├── strategies                  # Gateway orchestration code
│   └── razorpay
├── tests                       # Unit tests directory
│   ├── bootstrap               # Unit tests for Prisma and Postgres connection
│   ├── jest                    # Setup for unit tests
│   └── resources               # Gateway agnostic unit tests and factories for each resource
│       ├── orders
│       ├── testFactories       # Gateway specific factories and verifications
│       │   └── razorpay
│       └── webhooks
└── utils                       # Stateless helper utilities for payment services
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
- Injects shared middleware (e.g., auth, query parsing)

Exported entry:

```js
export async function bootstrapServer(config)
```

---

## Authentication

- Currently, uses key based authentication for service to service. Get and List services for bookings are not authenticated, but this service is expected to be standalone and appropriately secured through infrastructure to protect against unauthorized access and DDoS attacks

---

## Routes 

### Authenticated

| Method | Path                                  | Description                         |
|--------|---------------------------------------|-------------------------------------|
| POST   | `/orders`                             | Create Payment Order                |

### Public (no auth)

| Method | Path                                     | Description                      |
|--------|------------------------------------------|----------------------------------|
| GET    | `/orders`                                | Search Payment Order             |
| GET    | `/orders/:id`                            | Get specific payment order       |
| POST   | `/webhooks/:gateway`                     | Gateway specific webhook handler |
| POST   | `/webhooks/:gateway/client`              | Gateway specific client handler  |

---

## Middleware

Located in `server/middleware/`:

| File            | Purpose                                             |
|-----------------|-----------------------------------------------------|
| `queryparams.js`| Parses `limit`, `sort`, etc. into `req.queryparams` |
| `auth.js`       | Built for key based authentication                  | 

---

### Testing

> Testing is managed through custom CLI (`./scripts/dev-env`).  to manage the Docker-based development environment. See root README for details.

This backend is fully tested using **Jest** and **supertest**, with isolated test containers for Postgres. The tests are built for maximum coverage so that it can be used for 
1. Refactor with confidence
2. Ensure that edge cases are never broken
3. Identify redundant validations (and remove them)

Additional notes:
- `server/tests/` contains the full test suite
- Coverage report
  - Statements: 98.63 %
  - Branches: 94.5 %
  - Functions: 97.82 % 
  - Lines: 99.03 %

To run tests with coverage, use the following command from project root:
```bash
./scripts/dev-env test payment
```
or, for specific files:
```bash
./scripts/dev-env test payment  --jest server/payment/tests/bootstrap/connectDb.test.js
```
---

## Environment Variables

Below are the required `.env` variables for the API service:

| Variable                       | Description                                                                 |
|--------------------------------|-----------------------------------------------------------------------------|
| `PAYMENT_AUTH_HEADER`          | Authentication header for order creation requests from booking service      |
| `PAYMENT_AUTH_KEY`             | Authentication key for order creation requests from booking service         |
| `PAYMENT_DB_URL`               | Postgres connection string (including credentials and host)                 |
| `PAYMENT_DB_NAME`              | Name of the Postgres database                                               |
| `RAZORPAY_KEY_ID`              | Key Id for Razorpay integration                                             |
| `RAZORPAY_KEY_SECRET`          | Key Secret for Razorpay integration                                         |
| `WEBHOOK_SECRET`               | Webhook Secret for Razorpay integration                                     |

---

## Future Improvements

- Implement structured error classes and logging
- Add API usage metrics for payment/order activity
- Evaluate PCI-DSS readiness checklist

---

## Maintainer Notes

- You can extend the backend by adding a new folder under `resources/`
- You can add more payment gateways by adding files under `strategies/` folder
- All bootstrapping happens in `bootstrap/index.js`
- You should define capabilities for this system to be PCI-DSS compliant

---

> Built for clarity, modularity, and scaling up without regrets.

# FAQ — NuxtBnB

Frequently Asked Questions about the NuxtBnB project.

---

## What is this project?

NuxtBnB is a full-featured, production-grade clone of Airbnb, built for learning and experimentation.  
It includes SSR frontend (Nuxt), API and payment services (Express Router + ConnectJS), MongoDB, PostgreSQL, and Razorpay integration — all containerized for local and cloud-based development.

---

## Can I run this on my machine?

Yes. You can run the full stack locally using Docker Compose.  
Start by following the [Setup guide](../general/setup.md).

For cloud-based dev, GitHub Codespaces and VS Code DevContainers are supported.

---

## Can I deploy this to production?

Yes, with some configuration. You’ll need:
- A MongoDB provider (e.g. Atlas)
- A PostgreSQL provider (e.g. Supabase, Render, RDS)
- A container platform (e.g. Fly.io, Render, AWS ECS, GCP Cloud Run)
- Keys and secrets from Razorpay, Google, etc.

The architecture is scalable by design, but assumes you’ll handle:
- Load balancing (via NGINX, ALB, etc.)
- TLS/SSL setup
- Secret management

---

## Is authentication secure?

Yes:
- Passwords are hashed with bcrypt
- Access tokens are short-lived JWTs
- Refresh tokens are stored securely with the user and sent as HTTP-only cookies, and they are recycled with each use
- CSRF protection uses a double-submit cookie strategy
- CORS policies are enforced per environment

Google OAuth is also supported.

---

## Is it tested?

The backend services have deep unit test coverage:
- API: 98.7% coverage (Jest + Supertest + Dockerized Mongo/Mailpit)
- Payment: 99.4% coverage (Jest + Supertest + Dockerized Postgres)

Tests run via a custom CLI using Docker Compose for full service isolation.
The frontend has been tested manually.

---

## What’s with all the CLI scripts?

This project includes custom tooling to improve DX:
- `dev-env`: CLI wrapper around Docker Compose for starting/stopping/testing services
- `envtool`: Tool to merge, split, and mask `.env` files for dev, prod, and Codespaces
- Supports Raspberry Pi development and M1/M2 Macs

---

## Where are images stored?

Images are stored directly in MongoDB as base64 strings.  
For MVP simplicity, no CDN or object storage is used. This will evolve post-MVP.

---

## What’s on the roadmap?

Lots — see the [Roadmap](../product/roadmap.md) for full details.

Highlights:
- Nuxt 4 + TypeScript migration (hybrid setup)
- Monorepo support via Turborepo
- Booking model generalization (room types, rate plans)
- Background jobs and messaging (BullMQ, Kafka)
- Optional Go-based services for indexing and availability

---

## How much would it cost to host?

As of now, hosting on platforms like Fly.io or Render could cost \$20–40/month.  
Hosting on AWS/GCP may cost \$70–90/month depending on setup.

See [Cost Benefit Analysis](../product/cba.md) for break-even math.

---

## Can I contribute?

This is a solo dev project following a personal roadmap.  
Pull requests are not accepted — but issues and suggestions are always welcome!

---

## What’s next?

- Continue working on migration to Nuxt 4 + H3 backend
- Add frontend unit testing
- Scale dev and deploy tooling to support production traffic

Thanks for reading!

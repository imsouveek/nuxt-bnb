# System Architecture

This document provides an architectural overview of **NuxtBnB** — a production-grade, containerized Airbnb clone built for scale, modularity, and real-world engineering practices.

---

## 1. Overview

NuxtBnB follows a **modular service architecture**, with each major concern (e.g., frontend, API, payments) implemented as a loosely coupled service. The stack is fully Dockerized and supports both local development and GitHub Codespaces via DevContainers.

The architecture prioritizes:

- Clean separation of concerns
- Secure, token-based authentication
- Idempotent operations and double-submit CSRF protection
- Pluggable payment gateway support
- High test coverage and isolated environments

---

## 2. High-Level Diagram

```
                   +-----------------------+
                   |      Frontend (Nuxt)  |
                   |  Nuxt 2 / Nuxt 4 App  |
                   +----------+------------+
                              |
                +-------------v-------------+
                |      API Service (Express + MongoDB)     |
                |  Auth, Listings, Bookings, Images, Search |
                +-------------+-------------+
                              |
                +-------------v-------------+
                |  Payment Service (Express + Prisma + PG) |
                |     Order Creation, Webhooks, Strategy   |
                +----------------+-------------------------+
                                 |
                   +-------------v------------+
                   |      Razorpay Gateway     |
                   +--------------------------+
```

---

## 3. Services

| Service         | Description                                                  |
|------------------|--------------------------------------------------------------|
| **Frontend**     | Nuxt app with SSR, layouts, search, booking flow            |
| **API Service**  | ConnectJS + Express Router + Mongoose / MongoDB backend for core app logic                |
| **Payment**      | ConnectJS + Express Router + Microservice with Prisma + PostgreSQL + strategy pattern    |
| **Image Upload** | Base64 or URL uploads; images stored in CDN/local (abstracted) |
| **Dev CLI**      | `dev-env` and `envtool` for unified DX                      |

---

## 4. Tech Stack

| Layer      | Tech Used                            |
|------------|---------------------------------------|
| Frontend   | Nuxt 2 / Nuxt 4, Vuetify, Vuex/Pinia |
| Backend    | Express, Mongoose, H3 (planned)      |
| Payments   | Express, Prisma, PostgreSQL          |
| Auth       | JWT, Google OAuth, CSRF, Cookies     |
| Infra      | Docker Compose, DevContainers        |
| Tooling    | Jest, Supertest, `dev-env`, `envtool`|

---

## 5. Booking & Payment Flow (Simplified)

1. User searches for a home and selects availability
2. Frontend calls `POST /bookings` on the API
3. API creates booking record and responds
4. Frontend initializes payment using Razorpay
5. Payment service creates order (`POST /orders`)
6. Razorpay collects payment, triggers webhook
7. Webhook is verified and booking is marked paid

---

## 6. Dev Environment Tooling

> NuxtBnB includes two powerful internal tools to simplify developer setup:

### `dev-env`
- CLI to manage container lifecycle: start, stop, test, connect, run
- Targets defined in `tooling/dev/targets.json`

### `envtool`
- CLI for merging, splitting, and masking `.env` files
- Supports Codespaces via `--split-sample` and secrets masking

---

## 7. Deployment (Planned)

| Environment | Description                                   |
|-------------|-----------------------------------------------|
| **Local**   | Docker Compose stack with isolated containers |
| **Codespaces** | GitHub-hosted DevContainer for cloud-based dev |
| **K3s**     | Planned deployment to lightweight K8s cluster |
| **Ansible** | Planned for provisioning and updates          |
| **Pulumi**  | Planned for cloud resource management         |

---

> NuxtBnB is designed to evolve — the architecture supports both iterative delivery and long-term scalability.

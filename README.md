# Airbnb Clone – Scalable, Fullstack Booking Platform

This is a full-featured, production-grade clone of Airbnb, built with a strong emphasis on **scalability**, **modern architecture**, and **real-world engineering practices**.

It began as a **Nuxt 2 project**, inspired by the incredible work of **MasteringNuxt** team — whose course content made this project possible. While the project currently runs on Nuxt 2 and Express, the roadmap includes a full migration to **Nuxt 4, H3, TypeScript**, and a **monorepo structure** powered by Turborepo.

This project currently uses a simplified availability structure for MVP purposes. A more generalized model supporting multiple room types, per-day pricing, and multiple rate plans is planned post-MVP. This aligns with real-world OTA models (e.g., OpenTravel) and is noted in the roadmap under Booking Model Generalization. Booking model generalization is deliberately deferred because  
* It adds significant complexity during a 0 -> 1 platform build
* It provides a valuable opportunity to experience and learn from a real-world domain model refactor
* It allows faster exposure to new technologies like Nuxt 4, H3, TypeScript, Zod, and Turborepo — all of which are prioritized in the immediate roadmap

The platform is being designed to support everything you'd expect from a serious property rental system — authentication, listings, image uploads, availability search, and a booking + payment flow — and the roadmap is planned so that this app can scale to **millions of users and 100,000+ properties**. 

This project is also undertaken as a reference project so that I can keep referring back to it when I use certain key technologies. Here are the best practices I follow for this project:-
* Use best practices recommended by the libraries / technologies used - no hacks
* Structure code and use configs so that different services can be broken out to different servers / containers easily
* Build completely using docker containers, including the dev environment. Sure it can be painful at times, but this ensures cloud readiness, clean host system without unnecessary software
* Unit test as much as possible - detailed unit test cases ensure that any major code refactor can be tested in minutes (Need to do this for the frontend)
* Ensure that dev environment can be set up in one or two simple commands
* Strike a balance between "Don't use unnecessary libraries" and "Don't re-invent the wheel"

## Key Technologies (Current and Planned)

- **Frontend**: Nuxt 4 (Nuxt 2 currently), Vue 3 Composition API (Vue 2 currently)
- **Backend**: H3 (Express currently)
- **Database**: MongoDB Atlas with scalable availability modeling
- **Image Uploads**: S3 + signed URLs + async processing
- **Payments**: Stripe or Razorpay
- **Auth**: Email/password + Google OAuth2 (Implemented)
- **Queueing**: Redis + BullMQ, Kafka-ready
- **Search**: Typesense or ElasticSearch
- **Monorepo**: Turborepo with pnpm workspaces 
- **Observability**: Sentry, Logtail, Grafana
- **Testing**: Jest, full backend coverage in progress

## Development CLI (`dev-env`)

During the course of setting up this project, I developed a robust developer CLI (`dev-env`) to streamline local workflows. What began as tooling convenience has evolved into a reusable, professional-grade script that supports platform-aware builds, clean workflows, and minimal developer friction.

### What It Does

- Provides a clean interface to start/stop specific services or the full stack  
- Runs unit tests in isolated containers (`dev-env test api`)  
- Connects interactively to running containers (`dev-env connect app`)  
- Runs tools like ESLint/Prettier inside a utility container (`dev-env run utils npx eslint .`)  
- Auto-detects platform, architecture, and libc (e.g., ARM64 + musl) for consistent image builds across Raspberry Pi, CI, or x86 machines 
- Keeps `node_modules` and `package-lock.json` isolated to containers, ensuring a clean host system (unless explicitly overridden)

### What It Is Not

- Not a replacement for `docker compose` — it builds on top of Compose, not around it. Minimal Compose flags are handled automatically — developers are expected to pass additional Docker/Compose flags explicitly when needed.
- Not opinionated about deployment — staging and CI flows are intentionally kept separate. I will probably build them later into test-env, prod-env scripts
- Not dependent on Node.js, Deno, or any host language runtime — it runs anywhere Docker runs  

### Why This Matters

New developers can get started with a few simple commands.  
Experienced developers can pass any Docker/Compose flags (`--build`, `--rmi`, etc.) to fine-tune behavior.  
This tool helps maintain a clean, reproducible, and platform-independent development experience.

## Env setup
* Step 1: Locate the `tooling/dev/.env.dev.merged.sample`
* Step 2: Update entries with xxxxx. You may need to create Razorpay, GCP accounts and keys
* Step 3: Rename `tooling/dev/.env.dev.merged.sample` to `tooling/dev/.env.dev.merged`

> `envtool` is a lightweight utility script that helps manage `.env` files across services. It can **merge** service-specific `.env` files into a single view, **split** them back into per-service files, and generate masked `.env.*.sample` files for sharing. Run it from `./scripts/envtool`.

* Step 4: Run `./scripts/envtool dev --split`
* Step 5: Verify contents in `tooling/dev/targets.json`
* Step 6: Start the dependency services with the command below
```bash
./scripts/dev-env start services -d
```
* Step 7: Build and start the app with the command below
```bash
./scripts/dev-env start app -d
```
* Step 8: Unit testing can be done using the command below (for test-runner container). Note that unit tests are built so that specific sections of the app can be tested individually
```bash
./scripts/dev-env test api
```

## Project Status

The core MVP is actively under development. Migration to Nuxt 4, H3, and a fully modular monorepo architecture is part of the roadmap and will follow MVP completion.

---

## Infrastructure Needed (For Scale)

To support hundreds of thousands of properties and millions of users, your backend must be cloud-native, fault-tolerant, and autoscaling.

| Component             | Recommendation                                     |
|-----------------------|-----------------------------------------------------|
| App hosting           | Kubernetes (EKS, GKE, DigitalOcean) or AWS ECS with Fargate |
| Load balancing        | AWS ALB, NGINX + autoscaling groups                 |
| Database              | MongoDB Atlas with replica sets + sharding         |
| Cache                 | Redis (Elasticache, Upstash) for rate limits and hot data |
| Queue system          | Redis Streams / BullMQ / Kafka for async jobs      |
| File Storage          | Amazon S3 (signed URLs)                            |
| Search                | ElasticSearch or Meilisearch                       |
| CI/CD                 | GitHub Actions with Docker                         |
| DNS/CDN/TLS           | Cloudflare or AWS CloudFront                       |
| Monitoring            | Prometheus + Grafana or Datadog                    |
| Error Tracking        | Sentry                                              |
| Email Service         | Mailgun, Sendgrid, or Mailpit for test envs        |

---

## External Services to consider in future

| Use Case               | Service Recommendation                          |
|------------------------|--------------------------------------------------|
| Object Storage         | Amazon S3 with lifecycle rules                  |
| Payments               | Stripe (global) or Razorpay (India)             |
| Search                 | ElasticSearch for rich filtering                |
| Image CDN              | Cloudflare Images, Imgix, or Cloudinary         |
| Email and Notifications| Mailgun, Sendgrid                               |
| Logging and Tracing    | Logtail, Datadog, or self-hosted ELK            |
| Queueing               | BullMQ (Redis) or Kafka                         |
| Monitoring             | UptimeRobot, Prometheus, Grafana                |

---

## Code Readiness Assessment (With Priorities)

| Priority | Category                | Readiness | Comments                                   |
|----------|-------------------------|-----------|--------------------------------------------|
| High     | Booking/payments logic  | 0 percent | Currently missing - core to app function   |
| High     | Validation and safety   | 60 percent| Input schema validation is partial         |
| Infra    | Rate limiting           | Handled via infra | To be implemented at reverse proxy or CDN layer |
| Medium   | Image handling          | 50 percent| Move upload to S3 + async resizing         |
| Medium   | Search performance      | 50 percent| Add search index and queue sync            |
| Medium   | Testing coverage        | 60 percent| Foundational but needs broader integration |
| Low      | Architecture            | 90 percent| Very well structured                       |
| Low      | Availability engine     | 90 percent| Epoch diff model is a solid scalable choice|
| Low      | Authentication          | 90 percent| Secure and extensible as is                |
| Medium   | Booking Model           | 50 percent| Generalized room/rate model planned post-MVP |

---

# Development Roadmap

This roadmap tracks functional and architectural development. Infra/config-level tasks are excluded for clarity.

## MVP Development (E2E booking flow)
- [x] Create booking model and schema  
- [x] Implement booking API (create, retrieve, cancel)
- [x] Add custom tooling for easy and intuitive developer experience
- [x] Update Admin Home editor to use Vuex and other Vue patterns     
- [x] Implement Availability save
- [x] Implement Razorpay payments  
- [x] Handle Razorpay webhook with idempotency logic 
- [x] Integrate booking service to payment service
- [ ] Build booking summary / confirmation page  
- [x] Add test coverage for booking and payment
- [x] Deploy to GitHub
- [x] Add CSRF, CORS and other security validations
- [ ] Add support for DevContainers for GitHub Codespaces
- [ ] Build test-env and prod-env scripts to provision UX, API and Payment separately
- [ ] Deploy to K3s cluster
- [ ] Use Ansible for basic cluster maintenance

## Codebase Hardening and Observability
- [ ] Implement central log aggregation (Logtail/ELK/Datadog)  
- [ ] Set up basic alerting rules with Grafana or UptimeRobot  
- [ ] Add application-level insight logs (e.g., booking confirmed)
- [ ] Add Ansible for provision and deploy (now we have many services)   

## Build new Nuxt 4 app
- [ ] Scaffold a new Nuxt 4 app alongside Nuxt 2
- [ ] Set up Vuetify 3, layouts, global styling, runtime config
- [ ] Introduce Pinia state management (per-feature basis)
- [ ] Add Nuxt 4 equivalents for Nuxt 2 modules as needed (auth, Axios, etc.)
- [ ] Deploy Nuxt 4 app to K3s cluster

## Monorepo Migration (Turborepo)
- [ ] Move frontend to apps/frontend/  
- [ ] Move backend to apps/backend/  
- [ ] Extract shared packages/types and utils  
- [ ] Configure pnpm/npm workspaces  
- [ ] Add turbo.json and test/dev/build pipelines
- [ ] Setup Nginx for loadbalancing and routing for running Nuxt 2 / Nuxt 4 in parallel
- [ ] Add Pulumi for provisioning/ networking  

## Backend Migration to H3 and TypeScript
- [ ] Move backend to server/api and replace Express routes  
- [ ] Convert backend codebase to TypeScript 
- [ ] Add AppError class hierarchy for better error handling
- [ ] Add input validation using zod
- [ ] Add access controls for backend API (fetch, implement)  
- [ ] Add shared types for Booking, Home, User models  
- [ ] Rewrite middleware logic (auth, availability checks) for H3  
- [ ] Migrate route tests to support H3 event model  
- [ ] Add AppError class hierarchy for error handling  
- [ ] Version backend routes with /v1/ prefix  
- [ ] Implement audit logging for sensitive actions (e.g., bookings, refunds, deletions)  
- [ ] Add structured logging with winston or pino  
- [ ] Integrate Sentry for error tracking  
- [ ] Add /healthz and /readyz endpoints for monitoring  

## Frontend Refactor for Nuxt 4
- [ ] Add input validation using zod 
- [ ] Use Composition API for all state and logic
- [ ] Implement access controls and api based menu / layouts 
- [ ] Migrate layouts to Nuxt 4 system with definePageMeta  
- [ ] Update data fetching to use useFetch/useAsyncData  
- [ ] Restructure frontend by feature folders (e.g., booking/, auth/)  
- [ ] Write unit tests for major frontend components  

## Async Jobs and Messaging
- [ ] Add BullMQ + Redis for async job support  
- [ ] Add account lockout for brute force login attempts
- [ ] Move image resizing and email sending to background jobs  
- [ ] Create queue-based booking confirmation handler
- [ ] Add Pulumi provisioning
- [ ] Add Ansible playbooks for monitoring / maintenance

## Search and Indexing
- [ ] Push home/availability changes to ElasticSearch or Typesense  
- [ ] Emit Kafka/BullMQ events for indexing  
- [ ] Create worker to sync DB changes with search index  
- [ ] Add Golang services for search
- [ ] Add Pulumi provisioning
- [ ] Add Ansible playbooks for monitoring / maintenance
 
## Image Upload Improvements
- [ ] Switch to signed URL uploads using S3  
- [ ] Add async thumbnail generation after upload  
- [ ] Add self-hosted CDN
- [ ] Add Pulumi provisioning
- [ ] Add Ansible playbooks for monitoring / maintenance

## Final Integration Testing and QA
- [ ] Run end-to-end flow test: search → select → book → pay → confirm  
- [ ] Test critical failure scenarios (network error, payment fail)  
- [ ] Verify data sync across DB, cache, and search index 

## Booking Model Generalization (Room Types, Rate Plans, Inventory) with H3 BFF APIs + GoLang services

- [ ] Introduce room types with inventory and base rate
- [ ] Update availability to use room types and inventory counts
- [ ] Support multiple rate plans per room type
- [ ] Add Golang services for availability, rates and inventory
- [ ] Add Kafka/BullMQ for indexing
- [ ] Update Admin UI to support room types, rate types, and availabiltiy
- [ ] Update booking flow to support room + rate selection
- [ ] Update job queue and search index to use room / rate granularity
- [ ] Implement data migration 
- [ ] Build availability and rates calendar for Admin UI and Search UI 
 
 ## Functional enhancements with H3 BFF APIs + GoLang services
- [ ] [Promotions] Add campaign model and admin UI for promo rules  
- [ ] [Promotions] Apply promotions to booking total at API level  
- [ ] [Promotions] Display discounts/promotions in frontend UI 
- [ ] [OTA Standards] Research OpenTravel spec for availability and booking  
- [ ] [OTA Standards] Design internal APIs to map to OTA-compatible schema  
- [ ] [OTA Standards] Flag third-party-ready fields in models (e.g., cancellationPolicy, taxDetails) 
- [ ] Cancellations

---
## Migration Strategy: Nuxt 2 → Nuxt 4

To modernize the stack while maintaining stability, this project follows a **hybrid migration approach** that allows gradual transition without breaking the working Nuxt 2 app.

### Key Goals
- Migrate incrementally to Nuxt 4, Vue 3 Composition API, and Vuetify 3
- Maintain MVP functionality in Nuxt 2 during the transition
- Introduce H3, TypeScript, and modern layouts page-by-page
- Ensure zero downtime and testability at every step

### Strategy Overview

1. **Create a brand new Nuxt 4 app**
   - Set up in a separate folder or as a Turborepo app (`apps/frontend-nuxt4`)
   - Configure Vuetify 3, layouts, and global styling system
   - Add runtime config for service endpoints

2. **Bridge Nuxt 2 APIs into Nuxt 4**
   - Define service-specific base URLs (e.g., `API_BOOKINGS_URL`, `API_HOMES_URL`)
   - Use those config values across both apps to reduce coupling
   - Use `useFetch` or Axios in Nuxt 4 to consume existing APIs

3. **Route pages based on ownership**
   - Keep existing pages on Nuxt 2
   - Use NGINX or Nuxt middleware to proxy specific routes to Nuxt 2 or Nuxt 4 depending on ownership
   - Example:
     - `/search`, `/home/:id` → Nuxt 4
     - `/profile`, `/admin` → Nuxt 2 (until migrated)

4. **Migrate components and layouts incrementally**
   - Start with low-risk pages (e.g., `SearchPage.vue`, `StaticHome.vue`)
   - Use `<script setup>` and Composition API for all new components
   - Replace Vuetify 2 components with Vuetify 3 alternatives

5. **Preserve backend and service logic**
   - Backend remains Express-based (for now)
   - Migrate route handlers to H3 only after Nuxt 4 frontend stabilizes
   - Use reverse proxy or internal routing to handle service delegation

6. **Switch traffic gradually**
   - As Nuxt 4 gains coverage, cut over more frontend routes
   - Maintain a working Nuxt 2 fallback until full migration is complete
   - Finalize switch when layout, routing, and critical flows are verified

This approach ensures the platform can **continue evolving and scaling** while staying reliable, testable, and MVP-focused.

---

## Summary

**Estimated story points:** 150
# Development Roadmap

This roadmap tracks functional and architectural development. Infra/config-level tasks are excluded for clarity.

### MVP Development (E2E booking flow)
- [x] Create booking model and schema  
- [x] Implement booking API (create, retrieve, cancel)
- [x] Add custom tooling for easy and intuitive developer experience
- [x] Update Admin Home editor to use Vuex and other Vue patterns     
- [x] Implement Availability save
- [x] Implement Razorpay payments  
- [x] Handle Razorpay webhook with idempotency logic 
- [x] Integrate booking service to payment service
- [x] Build booking summary / confirmation page  
- [x] Add test coverage for booking and payment
- [x] Deploy to GitHub
- [x] Add CSRF, CORS and other security validations
- [x] Add a landing page
- [x] Add support for DevContainers for GitHub Codespaces
- [ ] Build test-env and prod-env scripts to provision UX, API and Payment separately
- [ ] Deploy to K3s cluster
- [ ] Use Ansible for basic cluster maintenance

### Codebase Hardening and Observability
- [ ] Implement central log aggregation (Logtail/ELK/Datadog)  
- [ ] Set up basic alerting rules with Grafana or UptimeRobot  
- [ ] Add application-level insight logs (e.g., booking confirmed)
- [ ] Add Ansible for provision and deploy (now we have many services)   

### Build new Nuxt 4 app
- [ ] Scaffold a new Nuxt 4 app alongside Nuxt 2
- [ ] Set up Vuetify 3, layouts, global styling, runtime config
- [ ] Introduce Pinia state management (per-feature basis)
- [ ] Add Nuxt 4 equivalents for Nuxt 2 modules as needed (auth, Axios, etc.)
- [ ] Deploy Nuxt 4 app to K3s cluster

### Monorepo Migration (Turborepo)
- [ ] Move frontend to apps/frontend/  
- [ ] Move backend to apps/backend/  
- [ ] Extract shared packages/types and utils  
- [ ] Configure pnpm/npm workspaces  
- [ ] Add turbo.json and test/dev/build pipelines
- [ ] Setup Nginx for loadbalancing and routing for running Nuxt 2 / Nuxt 4 in parallel
- [ ] Add Pulumi for provisioning/ networking  

### Backend Migration to H3 and TypeScript
- [ ] Move backend to server/api and replace Express routes  
- [ ] Convert backend codebase to TypeScript 
- [ ] Add AppError class hierarchy for better error handling
- [ ] Add input validation using zod
- [ ] Add access controls for backend API (fetch, implement)  
- [ ] Add shared types for Booking, Home, User models  
- [ ] Rewrite middleware logic (auth, availability checks) for H3  
- [ ] Migrate route tests to support H3 event model  
- [ ] Version backend routes with /v1/ prefix  
- [ ] Implement audit logging for sensitive actions (e.g., bookings, refunds, deletions)  
- [ ] Add structured logging with winston or pino  
- [ ] Integrate Sentry for error tracking  
- [ ] Add /healthz and /readyz endpoints for monitoring  

### Frontend Refactor for Nuxt 4
- [ ] Add input validation using zod 
- [ ] Use Composition API for all state and logic
- [ ] Implement access controls and api based menu / layouts 
- [ ] Migrate layouts to Nuxt 4 system with definePageMeta  
- [ ] Update data fetching to use useFetch/useAsyncData  
- [ ] Restructure frontend by feature folders (e.g., booking/, auth/)  
- [ ] Write unit tests for major frontend components  

### Async Jobs and Messaging
- [ ] Add BullMQ + Redis for async job support  
- [ ] Add account lockout for brute force login attempts
- [ ] Move image resizing and email sending to background jobs  
- [ ] Create queue-based booking confirmation handler
- [ ] Add Pulumi provisioning
- [ ] Add Ansible playbooks for monitoring / maintenance

### Search and Indexing
- [ ] Push home/availability changes to ElasticSearch or Typesense  
- [ ] Emit Kafka/BullMQ events for indexing  
- [ ] Create worker to sync DB changes with search index  
- [ ] Add Golang services for search
- [ ] Add Pulumi provisioning
- [ ] Add Ansible playbooks for monitoring / maintenance
 
### Image Upload Improvements
- [ ] Switch to signed URL uploads using S3  
- [ ] Add async thumbnail generation after upload  
- [ ] Add self-hosted CDN
- [ ] Add Pulumi provisioning
- [ ] Add Ansible playbooks for monitoring / maintenance

### Final Integration Testing and QA
- [ ] Run end-to-end flow test: search → select → book → pay → confirm  
- [ ] Test critical failure scenarios (network error, payment fail)  
- [ ] Verify data sync across DB, cache, and search index 

## Booking Model Generalization (Room Types, Rate Plans, Inventory) with H3 BFF APIs + GoLang services

- [ ] Introduce room types with inventory and base rate
- [ ] Update availability to use room types and inventory counts
- [ ] Support multiple rate plans per room type
- [ ] Add Golang services for availability, rates and inventory
- [ ] Add Kafka/BullMQ for indexing
- [ ] Update Admin UI to support room types, rate types, and availability
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

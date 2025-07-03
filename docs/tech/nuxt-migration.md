# Migrating from Nuxt 2 to Nuxt 4

To modernize the stack while maintaining stability, this project follows a **hybrid migration approach** that allows gradual transition without breaking the working Nuxt 2 app.

---

## Key Goals

- Incrementally adopt Nuxt 4, Vue 3 Composition API, and Vuetify 3
- Preserve MVP functionality in Nuxt 2 throughout the transition
- Introduce H3, TypeScript, and modern layouts page-by-page
- Maintain zero downtime and high testability at every step

---

## Strategy Overview

### 1. Create a Brand New Nuxt 4 App

- Scaffold the app in a separate folder or under `apps/frontend-nuxt4` (Turborepo-compatible)
- Set up:
  - Vuetify 3
  - Layouts and global styles
  - Runtime config for service endpoints (e.g., `API_BOOKINGS_URL`, `APP_BASE_URL`)
- Use Vite as the default builder, tuning ports if needed

---

### 2. Bridge Nuxt 2 APIs into Nuxt 4

- Expose service-specific URLs through config (`API_HOMES_URL`, `API_BOOKINGS_URL`, etc.)
- Share `.env` structure across both apps to reduce duplication
- Use `useFetch()` or Axios inside Nuxt 4 to consume existing Express-based APIs

---

### 3. Route Pages Based on Ownership

- Split routing logic by page type:
  - Nuxt 4: `/search`, `/home/:id`, `/landing`
  - Nuxt 2: `/profile`, `/admin`, `/settings` (until migrated)
- Use NGINX reverse proxy **or** shared Nuxt middleware to delegate routes
- Optionally fallback from Nuxt 4 to Nuxt 2 if a route is incomplete

---

### 4. Migrate Components and Layouts Incrementally

- Start with low-risk, isolated pages (e.g., `SearchPage.vue`)
- Use `<script setup>` and Composition API exclusively in Nuxt 4
- Replace Vuetify 2 components with Vuetify 3 counterparts
- Gradually refactor shared components where overlap exists

---

### 5. Preserve Backend Service Logic

- Keep backend Express-based during frontend migration
- Plan to migrate backend APIs to H3 **after** Nuxt 4 stabilizes
- Use internal routing or reverse proxy to route frontend and backend calls correctly

---

### 6. Switch Traffic Gradually

- As Nuxt 4 gains coverage, proxy more routes to it
- Keep Nuxt 2 app as fallback until:
  - Layout system is complete
  - Critical user flows (e.g. booking, login) are fully tested
- Finalize cutover only when confidence is high in Nuxt 4 UX + SSR + build stability

---

This hybrid approach ensures the platform can **evolve safely and incrementally**, while staying testable, scalable, and MVP-ready.

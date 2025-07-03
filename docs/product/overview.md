# Product Overview

This is a full-featured, production-grade clone of Airbnb, built with a strong emphasis on **scalability**, **modern architecture**, and **real-world engineering practices**.

The project began as a **Nuxt 2 app**, inspired by the excellent work of the **MasteringNuxt** team — whose course content laid the foundation. While the current stack includes Nuxt 2 and Express, the roadmap includes a full migration to **Nuxt 4, H3, TypeScript**, and a **Turborepo-powered monorepo**.

---

## MVP Scope

The current booking system uses a simplified availability model to support faster MVP delivery. Key constraints:

- One room type per listing
- Uniform nightly pricing
- No multi-rate plans or per-day overrides

This is intentional, to:
- Avoid overengineering during the 0→1 phase
- Accelerate hands-on work with Nuxt 4, H3, TypeScript, and Zod
- Lay the groundwork for a deliberate domain model refactor post-MVP

---

## Planned Generalization

The roadmap includes **Booking Model Generalization**, which will support:

- Multiple room types per listing
- Per-day pricing (e.g. weekday/weekend)
- Rate plans (e.g. refundable vs non-refundable)

This is aligned with real-world OTA specifications such as **OpenTravel**.

---

## System Goals

The platform is designed to support all core functionality you'd expect from a modern property rental system:

- Authentication and user management
- Listings with image uploads
- Availability search with filters
- Complete booking and payment flow

The architecture is built with long-term scale in mind — capable of supporting **millions of users** and **100,000+ properties**.

---

## Project Philosophy

This project serves as a **reference implementation** — something I revisit to explore modern tools in realistic contexts. Guiding principles include:

- **Follow framework best practices** — no hacks or shortcuts
- **Modular by design** — every major service is containerized and separable
- **Use Docker for everything**, including development, to keep hosts clean
- **Test deeply** — unit tests are comprehensive (frontend test coverage is planned)
- **Streamline onboarding** — full dev setup should require no more than 1–2 commands
- **Stay pragmatic** — avoid reinventing the wheel, but also avoid needless dependencies

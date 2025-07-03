# NuxtBnB — Fullstack Airbnb Clone

NuxtBnB is a production-grade clone of Airbnb with a focus on **scalability**, **modular architecture**, and **real-world engineering practices**.

Built using:
- **Nuxt 2 + Express** (migrating to **Nuxt 4, H3, TypeScript**)
- **MongoDB**, **PostgreSQL**, **Razorpay**, **Docker**

## Getting Started

```bash
cp tooling/dev/.env.dev.merged.sample tooling/dev/.env.dev.merged
./scripts/envtool dev --split
./scripts/dev-env start services -d
./scripts/dev-env start app -d
```

## Testing

```bash
./scripts/dev-env test api
./scripts/dev-env test payment
```

## Documentation

Full docs, architecture, and roadmap: [`/docs`](./docs/index.md)

---

© 2025 Souveek Bose. [MIT License](./LICENSE)

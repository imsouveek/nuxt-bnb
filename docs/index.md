# Project Documentation

Welcome to the **NuxtBnb** documentation — a full-featured, Dockerized Airbnb clone built for **learning**, **self-improvement**, and as a **reference implementation of scalable architecture**.

This documentation is structured to help you:

- Get set up and running locally or in the cloud
- Understand how the project is organized
- Use custom tooling like `dev-env` and `envtool`
- Explore system architecture and implementation details
- Track internal notes and todos

> **Note:** This is a solo developer project. **Pull requests are not accepted**, but issues and suggestions are welcome.

---

## Documentation Structure

Browse by category below, or navigate directly within the `/docs` folder on GitHub:

- [Home](./index.md)
- **General**
  - [Setup](general/setup.md): How to install, configure, and run locally or on Codespaces
  - [Contributing](general/contributing.md): Development philosophy and contribution guidelines
  - [FAQ](general/faq.md): Answers to common questions and known caveats
- **Product**
  - [Overview](product/overview.md): Product functionality, constraints, and modeling decisions
  - [Roadmap](product/roadmap.md): Migration plan, upcoming changes, and long-term goals
  - [Cost Benefit Analysis](product/cba.md): Infrastructure cost estimates and monetization thresholds
- **Technical**
  - [Architecture](tech/architecture.md): System design and modular service breakdown
  - [Nuxt 4 Migration](tech/nuxt-migration.md): Migration strategy to Nuxt 4, H3, and TypeScript
  - **Backend**
    - [API](tech/backend/api.md): Auth, listing, availability, and booking APIs
    - [Payments](tech/backend/payment.md): Razorpay integration and payment service architecture
  - [Scaling](tech/scaling.md): Strategies for scaling to 10M+ users and beyond

---

## Other Resources

- [GitHub Repository](https://github.com/imsouveek/nuxt-bnb)
- [MIT License](../LICENSE)

---

## Contributing

This project is built around a personal roadmap and does **not accept pull requests**.

However, you’re welcome to:
- Open [issues](https://github.com/imsouveek/nuxt-bnb/issues) to report bugs or suggest features
- Fork the repository and adapt it for your own use

---

## Philosophy

This project emphasizes:

- Real-world architecture with modular services
- Developer experience with strong tooling and DX automation
- Scalable foundations using containerized environments

---

Maintained by [Souveek Bose](https://github.com/imsouveek).  
Thanks for checking it out!

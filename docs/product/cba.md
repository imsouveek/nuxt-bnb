# Cost Benefit Analysis

This document estimates monthly infrastructure costs to run **NuxtBnB** in a cloud-native production setup, and calculates how many bookings are needed to break even under a commission-based monetization model.

---

## 1. Infrastructure Assumptions

| Component           | Provider                         | Monthly Estimate |
|---------------------|----------------------------------|------------------|
| **MongoDB (Atlas)** | M10 cluster (~2–4 GB RAM)        | \$30–$40          |
| **Postgres (Payments)** | Supabase / Neon paid tier       | \$10–$20          |
| **Kubernetes (Nuxt + API + Payment)** | DO Kubernetes, Fly.io, or Render Pods | \$30–$50          |
| **Email (SMTP)**    | Mailgun (free) or Mailpit        | ~\$0              |
| **Image Storage**   | Stored in MongoDB GridFS         | \$0–$5            |
| **Monitoring & Logs**| Self-hosted or minimal use      | ~\$0–$10          |

> **Estimated Total**: **\$70–\$125/month**

---

## 2. Break-Even Analysis

Assuming a commission-based model where NuxtBnB earns **5–8%** per booking:

| Avg Booking Value | Commission | Revenue / Booking | Bookings to Break Even (@ $100/mo) |
|-------------------|------------|-------------------|-------------------------------------|
| $100              | 5%         | $5                | 20 bookings                         |
| $100              | 8%         | $8                | 13 bookings                         |
| $150              | 5%         | $7.50             | 14 bookings                         |
| $150              | 8%         | $12               | 9 bookings                          |

---

## 3. Deployment Considerations

- MongoDB Atlas and Supabase/Neon provide managed backups, scaling, and monitoring out of the box.
- Render, Fly.io, or DigitalOcean Kubernetes can host multiple pods (Nuxt, API, Payment) with autoscaling.
- SSL, domains, and reverse proxies can be handled via Cloudflare or NGINX Ingress (optional).

---

## 4. Notes

- Assumes SSO and object storage are **not** needed for MVP.
- Assumes SMTP volume stays under Mailgun’s free tier.
- If moving to image CDN (e.g., Cloudflare R2, S3), add ~$5–$15/month.
- CI/CD, Pulumi, Ansible are assumed to run via GitHub Actions or local.

---

## 5. Summary

With realistic, production-friendly cloud services, NuxtBnB would require:

- **\$70–\$125/month** in infra costs
- Just **9–20 bookings per month** to break even, depending on booking value and commission rate

This setup is ideal for:
- Launching a real MVP
- Running a white-label OTA clone
- Learning full-stack DevOps in production context

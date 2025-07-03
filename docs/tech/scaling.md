# Scaling Strategy

This app is planned to be able to scale to **millions of users** and **100,000+ properties**. To support this, the app backend must be cloud-native, fault-tolerant, and autoscaling. Right now, it can support 10K+ MAU and 1000 properties with the right infrastructure (see [Cost Benefit Analysis](../product/cba.md))

---

## Infrastructure Needed (For Scale)


| Component             | Infrastructure choices                                     |
|-----------------------|-----------------------------------------------------|
| App hosting           | Kubernetes (EKS, GKE, DigitalOcean) or AWS ECS with Fargate |
| Load balancing        | AWS ALB, NGINX + autoscaling groups                 |
| Database              | MongoDB Atlas with replica sets + sharding         |
| Cache                 | Redis (Elasticache, Upstash) for rate limits and hot data |
| Queue system          | Redis Streams / BullMQ / Kafka for async jobs      |
| File Storage          | Amazon S3 (signed URLs)                            |
| Search                | Typesense                       |
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
| Payments               | Stripe (global)             |
| Search                 | ElasticSearch for rich filtering                |
| Image CDN              | Cloudflare Images, Imgix, or Cloudinary         |
| Email and Notifications| Mailgun, Sendgrid                               |
| Logging and Tracing    | Logtail, Datadog, or self-hosted ELK            |
| Queueing               | BullMQ (Redis) or Kafka                         |
| Monitoring             | UptimeRobot, Prometheus, Grafana                |
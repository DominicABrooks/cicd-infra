# CICD-Infra Monorepo Architecture

Welcome to the central repository for our full-stack application and its infrastructure. 

To keep this repository clean and easy to navigate, we have organized our detailed technical documentation into the `docs/` directory.

## Documentation Index

Whether you are onboarding for the first time or looking for specific architectural decisions, please refer to the documents below:

1. **[Architecture & Mental Model](./docs/architecture.md)**
   - Understand the "Factory Pipeline" concept.
   - High-level overview of our AWS Terraform infrastructure.

2. **[Local Development Guide](./docs/local-development.md)**
   - Copy-paste ready commands to spin up the application.
   - Using the `docker-compose` container-first workflow.
   - Using the fast local development (HMR) workflow.

3. **[Testing Strategy](./docs/testing-strategy.md)**
   - Why we use Vitest, Pact, Playwright, and OWASP ZAP.
   - Explanations of contract testing vs E2E testing.

4. **[CI/CD Pipeline & Workflow](./docs/ci-cd-pipeline.md)**
   - A phase-by-phase breakdown of our GitHub Actions pipeline.
   - How Docker images are built, tested, and pushed.
   - Our roadmap for transitioning safely to Kubernetes.

5. **[Backend API & Authentication](./docs/backend-api.md)**
   - Express CRUD API reference with endpoint details.
   - Supabase Auth integration and JWT verification flow.
   - PostgreSQL schema and migration instructions.

6. **[Tradeoffs & Known Concerns](./docs/tradeoffs-and-concerns.md)**
   - Honest documentation of known pain points.
   - Why Docker cache invalidation is slow, and how we mitigate E2E flakiness.

---

### Quick Start

If you just want to get the application running immediately, ensure Docker is installed and run:

```bash
docker-compose up -d --build
```

Then visit `http://localhost:5173`.

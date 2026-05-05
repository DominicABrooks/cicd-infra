# Tradeoffs & Known Concerns

Every architectural decision comes with tradeoffs. This document outlines the known pain points in the current system and why we accepted them.

## 1. Docker Build Slowness in Monorepos

Because we are using a monorepo, changing a file in `packages/shared` invalidates the Docker build cache for *both* the frontend and backend images. 
- **Tradeoff:** We accept slower CI build times when modifying shared code in exchange for the simplicity of having all code in one repository and guaranteed type safety across boundaries.
- **Mitigation:** We use GitHub Actions Docker cache (`type=registry,mode=max`) to speed up subsequent layer builds as much as possible.

## 2. Pact Contract Testing Complexity

Contract testing can be confusing for developers used to traditional end-to-end testing or heavy API mocking.
- **The Rule:** The frontend *writes* the rules (consumer), and the backend *proves* it can follow them (provider). 
- **Pain Point:** If a backend developer changes an API response structure, they cannot simply update the backend test. They must first update the frontend consumer test to expect the new structure, generate the new Pact JSON, and *then* the backend test will pass. 
- **Tradeoff:** This requires more coordination, but completely eliminates the risk of deploying a backend that breaks the frontend.

## 3. Database Migrations (Fragility)

Currently, `docker-compose up` does not automatically seed the database.
- **Pain Point:** Developers must manually ensure their schema is up to date when working on backend endpoints. If you pull `main` and someone added a column, your local environment might break until you run migrations.
- **Future Mitigation:** We plan to add an `init-db` container to `docker-compose.yml` that automatically runs Prisma/TypeORM migrations on startup.

## 4. E2E Flakiness in CI

Playwright tests run against a built container in the GitHub Actions runner environment.
- **Pain Point:** GitHub runners have variable CPU and network latency. If a test assumes a button will appear in exactly 500ms, it might pass locally but fail in CI.
- **Mitigation:** Never use hardcoded `page.waitForTimeout()`. Always rely on `page.waitForSelector` or WebAssertions to ensure tests dynamically wait for elements to appear regardless of runner speed.

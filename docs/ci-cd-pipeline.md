# CI/CD Pipeline & Workflow

Our pipeline (`.github/workflows/deploy.yml`) acts as a strict gatekeeper. Code cannot reach deployment without passing every phase.

## Workflow Phases

### Phase 1: Static Analysis & Testing (`ci` job)
- **Linting & Typechecking:** ESLint and `tsc` run against the frontend and backend. Because we use Turborepo, these steps are heavily cached.
- **Tests:** Unit tests and Pact contract tests run. 
- **Gate:** If the frontend expects an API shape that the backend does not fulfill, the Pact tests fail the build immediately.

### Phase 2: Containerization (`docker-build-push` job)
- **Multi-stage Builds:** We build highly optimized Docker images. The frontend uses a lightweight `nginx:alpine` image to serve static files. The backend uses `node:18-alpine` with all `devDependencies` pruned.
- **Registry:** The images are pushed to GitHub Container Registry (GHCR), tagged with the Git commit SHA (e.g., `ghcr.io/repo-frontend:a1b2c3d`).

### Phase 3: Integration & Security (`e2e` & `security` jobs)
*These jobs run in parallel to save time.*
- **Playwright E2E:** Pulls the exact Docker images just built, spins them up using `docker-compose`, and runs UI tests.
- **OWASP ZAP:** Pulls the frontend Docker image, spins it up, and runs a baseline security scan against `http://localhost`.
- **Gate:** We are testing the *actual artifacts* that will be deployed, guaranteeing parity.

### Phase 4: Provisioning (`terraform` job)
- Runs `terraform apply` against our AWS infrastructure to ensure cloud state is strictly aligned with the repository configurations.

## Future Transition to Kubernetes

Because we have definitively decoupled the **application build cycle** from the **application deployment cycle**, transitioning to Kubernetes is now trivial.

Instead of copying static `dist` artifacts around, we produce immutable, versioned OCI (Docker) images. When we are ready for Kubernetes, our Terraform will provision an EKS cluster, and we simply add a small deployment step to run `kubectl set image deployment/frontend frontend=ghcr.io/repo-frontend:${{ github.sha }}` or deploy via Helm charts in `deploy/helm`. 

The core guarantee remains: **What passes `e2e` and `security` is bit-for-bit identical to what executes in the Kubernetes cluster.**

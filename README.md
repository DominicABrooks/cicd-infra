# Monorepo CI/CD Baseline

This repository has been converted to a monorepo baseline with:
- `apps/frontend` — React/Vite frontend
- `apps/backend` — placeholder backend service
- `packages/shared` — shared package
- `infra/terraform` — Terraform infra definitions
- `deploy/helm` — Helm chart artifacts
- `.github/workflows` — CI/CD pipeline

## Overview

This baseline is built for a monorepo pipeline where:
- affected detection is possible
- frontend and backend workloads are separated
- infrastructure and deployment artifacts live in dedicated folders
- Docker images are built once and reused across environments

## Architecture

- **Monorepo**: npm workspaces
- **Frontend**: React + Vite
- **Backend**: Node placeholder service
- **Shared**: package boundary for shared code
- **Infrastructure**: Terraform in `infra/terraform`
- **Deployment**: Helm chart in `deploy/helm`

## Local Development

### Prerequisites

- [Node.js](https://nodejs.org/) (v18+)
- [Terraform](https://www.terraform.io/downloads) (optional)
- Git

### Setup

```bash
git clone https://github.com/DominicABrooks/cicd-infra.git
cd cicd-infra
npm install
```

### Frontend

```bash
npm run dev:frontend
```

### Backend

```bash
npm run test:backend
npm run build:backend
```

### Testing

```bash
npm run test:frontend
npm run test:frontend:e2e
```

### Terraform

```bash
cd infra/terraform
terraform init
terraform apply
```

## CI/CD Pipeline

The workflow now follows a monorepo-style flow:

1. Checkout
2. Install dependencies
3. Frontend and backend lint/typecheck
4. Frontend and backend unit tests
5. Frontend and backend build
6. Playwright e2e tests
7. Deploy frontend bundle to GitHub Pages

## Project Structure

```
.
├── apps/
│   ├── frontend/          # React/Vite frontend app
│   └── backend/           # backend service placeholder
├── packages/
│   └── shared/            # shared package
├── infra/
│   └── terraform/         # Terraform config
├── deploy/
│   └── helm/              # Helm chart placeholder
├── .github/
│   └── workflows/         # CI/CD config
├── package.json           # monorepo workspace root
├── turbo.json             # monorepo pipeline baseline
└── .gitignore
```

## Notes

- `npm install` at the repo root installs all workspace packages.
- `npm run lint:frontend` and `npm run lint:backend` are currently placeholder commands for the baseline.
- `turbo.json` provides a monorepo pipeline structure for future affected builds.

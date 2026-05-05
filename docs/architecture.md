# Architecture & Mental Model

Welcome to the architectural overview of our monorepo. This document explains how the pieces of our system fit together from a high level.

## The "Factory Pipeline" Mental Model

Think of this repository as a **factory pipeline**. 

1. **`packages/shared`** creates the raw materials (types, shared utilities).
2. **`apps/frontend`** and **`apps/backend`** assemble those materials into two distinct products.
3. **Pact** acts as the quality assurance inspector standing between the two products, making sure they fit together perfectly.
4. **Docker** puts those products into unbreakable shipping crates.
5. **GitHub Actions** tests those crates (using Playwright and ZAP) and then puts them on a shelf (GitHub Container Registry).
6. **Terraform** builds the warehouse (AWS) where those shelves live.

As a developer, your job is just to edit the code in `apps/` and rely on `docker-compose` to replicate the entire factory on your laptop.

## Core Infrastructure

Our infrastructure is strictly managed via Infrastructure as Code (IaC) using Terraform located in `infra/terraform`. 

- **Cloud Provider**: AWS
- **Current Provisioning**: VPC, ECR (Elastic Container Registry), networking.
- **State Management**: Remote backend (S3) with DynamoDB locking to prevent concurrent state corruption.
- **Future Provisioning**: We are laying the groundwork for Amazon EKS (Elastic Kubernetes Service).

By keeping infrastructure separate from application code but within the same monorepo, we ensure that infrastructure changes are version-controlled and tested alongside the application logic they support.

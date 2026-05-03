# CI/CD Infrastructure Demo

A minimal, free CI/CD setup using GitHub + Terraform + GitHub Pages to deploy a static website.

## Overview

This repository demonstrates a complete CI/CD pipeline that:
- Uses Terraform to simulate infrastructure deployment
- Runs automated tests via GitHub Actions
- Deploys a static site to GitHub Pages

## Architecture

- **Repository**: Hosted on GitHub
- **CI/CD**: GitHub Actions (`.github/workflows/deploy.yml`)
- **Infrastructure**: Terraform (minimal null provider)
- **Hosting**: GitHub Pages

## Local Development

### Prerequisites

- [Terraform](https://www.terraform.io/downloads) (optional - for local testing)
- Git

### Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/DominicABrooks/cicd-infra.git
   cd cicd-infra
   ```

2. Initialize Terraform (optional):
   ```bash
   terraform init
   ```

3. Apply Terraform configuration (optional):
   ```bash
   terraform apply
   ```

## CI/CD Pipeline

The pipeline runs automatically on every push to the `main` branch:

1. **Terraform Job**: Initializes and applies Terraform configuration
2. **Deploy Job**: Publishes the static site to GitHub Pages

### Enabling GitHub Pages

1. Go to repository **Settings** > **Pages**
2. Select **"Deploy from a branch"**
3. Choose **gh-pages** branch
4. Click **Save**

Your site will be available at: `https://dominicabrooks.github.io/cicd-infra/`

## Project Structure

```
.
├── index.html              # Static website
├── main.tf                 # Terraform configuration
├── .gitignore             # Git ignore rules
├── README.md              # This file
└── .github/
    └── workflows/
        └── deploy.yml      # GitHub Actions workflow
```

## Files Description

- `index.html`: Simple static page deployed to GitHub Pages
- `main.tf`: Terraform config using null provider to simulate deployment
- `deploy.yml`: GitHub Actions workflow for CI/CD automation

## Cost

This setup is completely free:
- GitHub repository: Free
- GitHub Actions: Free tier included
- GitHub Pages: Free hosting
- Terraform: No cloud resources used
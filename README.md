# CI/CD Infrastructure Demo

A minimal, free CI/CD setup using GitHub + Terraform + GitHub Pages to deploy a React app.

## Overview

This repository demonstrates a complete CI/CD pipeline that:
- Uses Terraform to simulate infrastructure deployment
- Runs unit tests with Vitest
- Runs end-to-end tests with Playwright
- Builds and deploys a React application to GitHub Pages

## Architecture

- **Repository**: Hosted on GitHub
- **CI/CD**: GitHub Actions (`.github/workflows/deploy.yml`)
- **Infrastructure**: Terraform (minimal null provider)
- **Frontend**: React + Vite
- **Unit Testing**: Vitest + React Testing Library
- **E2E Testing**: Playwright
- **Hosting**: GitHub Pages

## Local Development

### Prerequisites

- [Node.js](https://nodejs.org/) (v18+)
- [Terraform](https://www.terraform.io/downloads) (optional - for local testing)
- Git

### Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/DominicABrooks/cicd-infra.git
   cd cicd-infra
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run unit tests:
   ```bash
   npm test
   ```

4. Run e2e tests:
   ```bash
   npm run build
   npm run test:e2e
   ```

5. Build for production:
   ```bash
   npm run build
   ```

6. Initialize Terraform (optional):
   ```bash
   cd infra
   terraform init
   terraform apply
   ```

## CI/CD Pipeline

The pipeline runs automatically on every push to the `main` branch:

1. **Terraform Job**: Initializes and applies Terraform configuration in `infra/`
2. **Deploy Job**: 
   - Installs dependencies
   - Runs unit tests
   - Builds the React app
   - Runs e2e tests against the built app
   - Deploys to GitHub Pages (only if all tests pass)

### Enabling GitHub Pages

1. Go to repository **Settings** > **Pages**
2. Select **"Deploy from a branch"**
3. Choose **gh-pages** branch
4. Click **Save**

Your React app will be available at: `https://dominicabrooks.github.io/cicd-infra/`

## Project Structure

```
.
├── index.html              # Vite entry point
├── package.json            # Node.js dependencies and scripts
├── vite.config.js          # Vite configuration
├── playwright.config.js    # Playwright configuration
├── .gitignore             # Git ignore rules
├── README.md              # This file
├── infra/
│   └── main.tf            # Terraform configuration
├── src/
│   ├── main.jsx           # React app entry
│   ├── App.jsx            # Main component
│   ├── App.css            # Styles
│   └── App.test.jsx       # Vitest unit tests
├── e2e/
│   └── app.spec.js        # Playwright e2e tests
└── .github/
    └── workflows/
        └── deploy.yml      # GitHub Actions workflow
```

## Files Description

- `src/App.jsx`: React component rendering the main heading
- `src/App.test.jsx`: Vitest unit test for the component
- `e2e/app.spec.js`: Playwright e2e test for the deployed app
- `infra/main.tf`: Terraform config using null provider to simulate deployment
- `deploy.yml`: GitHub Actions workflow for CI/CD automation

## Cost

This setup is completely free:
- GitHub repository: Free
- GitHub Actions: Free tier included
- GitHub Pages: Free hosting
- Terraform: No cloud resources used
# Local Development Guide

We use a container-first approach to ensure your local environment exactly matches CI and Production. 

**Prerequisites:** 
- [Node.js](https://nodejs.org/) (v18+)
- [Docker & Docker Compose](https://www.docker.com/)
- [Supabase Account](https://supabase.com/) (Free tier is fine)

---

## 1. Environment Setup (Mandatory)

The application requires Supabase for authentication. You must set up these variables in a `.env` file at the root of the repository:

```bash
# .env (at repo root)
SUPABASE_URL=your_project_url
SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

**Note:** Docker Compose will automatically read these variables from the `.env` file and pass them to the containers.

---

## 2. Option A: The "Just Works" Docker Method (Recommended)

This spins up the frontend, backend, and PostgreSQL database with production parity.

```bash
# 1. Start the entire stack
docker-compose up -d --build

# 2. View logs
docker-compose logs -f backend
```

**Success state:** 
- **Frontend:** `http://localhost:5173` (with Auth UI)
- **Backend API:** `http://localhost:4000`
- **Swagger Docs:** `http://localhost:4000/api-docs`

**Database Migrations:**
Migrations run **automatically** when the backend container starts. You don't need to run any manual commands to set up the schema.

---

## 3. Option B: Local Development Mode (Non-Docker)

Use this if you want native Hot Module Replacement (HMR) and fast Vitest feedback.

```bash
# 1. Install dependencies
npm ci

# 2. Start PostgreSQL locally (or via Docker)
docker-compose up -d db

# 3. Start development servers
npm run dev:frontend
npm run dev:backend
```

### Running Tests
```bash
npm run test:frontend
npm run test:backend
```
*Note: Pact tests use mocks for Supabase and the Database, so they don't require external connectivity.*

---

## 4. Architecture Overview

- **Frontend:** React + Vite + Supabase Client
- **Backend:** Express + Node-Postgres + Supabase Admin (for verification)
- **Database:** PostgreSQL 16
- **Auth:** Supabase JWT (RS256)
- **Validation:** Zod (Request schemas)
- **Documentation:** OpenAPI 3.0 / Swagger UI

# Backend API Reference

The backend is an Express application that provides a full CRUD API for managing items, protected by Supabase Auth. All request inputs are validated with Zod, and the full API is documented via OpenAPI 3.0 / Swagger UI.

---

## Architecture

```
apps/backend/src/
├── config/
│   ├── db.ts           # PostgreSQL connection pool (pg)
│   ├── supabase.ts     # Supabase admin client for JWT verification
│   └── swagger.ts      # OpenAPI/Swagger configuration (swagger-jsdoc)
├── middleware/
│   ├── auth.ts         # requireAuth middleware (validates Bearer tokens)
│   └── validate.ts     # Zod validation middleware factory
├── schemas/
│   └── items.ts        # Zod schemas for item request validation
├── routes/
│   ├── health.ts       # GET /api/health (unauthenticated)
│   └── items.ts        # CRUD routes for /api/items (authenticated)
├── db/
│   └── migrate.ts      # Bootstrap schema migration script
├── index.ts            # Express app entry point
└── pact.test.ts        # Pact provider verification test
```

---

## Swagger / OpenAPI Docs

The backend auto-generates interactive API documentation from `@openapi` JSDoc annotations in the route files.

| URL | Description |
|---|---|
| `http://localhost:4000/api-docs` | Interactive Swagger UI — test endpoints directly in your browser |
| `http://localhost:4000/api-docs.json` | Raw OpenAPI 3.0 JSON spec (importable into Postman, Insomnia, etc.) |

### How It Works
- `swagger-jsdoc` scans all files in `src/routes/*.ts` for `@openapi` JSDoc blocks.
- `swagger-ui-express` serves an interactive UI at `/api-docs`.
- The OpenAPI spec defines the `bearerAuth` security scheme so you can test authenticated endpoints directly from the Swagger UI by clicking "Authorize" and pasting your Supabase JWT.

### Why swagger-jsdoc?
- **Co-located documentation.** The API spec lives alongside the route handler code, so it never drifts out of sync.
- **Zero separate spec file.** No need to maintain a standalone `openapi.yaml` — the spec is generated at runtime from the source code.

---

## Request Validation (Zod)

All incoming request bodies and URL parameters are validated using **Zod** schemas before they reach the route handler.

### How It Works
1. Schemas are defined in `src/schemas/items.ts` as the single source of truth for what constitutes a valid request.
2. The `validate()` middleware in `src/middleware/validate.ts` takes a Zod schema and a source (`body`, `params`, or `query`) and runs `.safeParse()` on the incoming data.
3. If validation fails, the middleware immediately returns a structured `400` response:
   ```json
   {
     "error": "Validation failed",
     "details": [
       { "field": "name", "message": "Name is required" }
     ]
   }
   ```
4. If validation passes, the parsed (and potentially transformed) data replaces the raw request data, so handlers always work with clean, typed input.

### Why Zod?
- **TypeScript-first.** Schemas automatically infer TypeScript types (`z.infer<typeof schema>`), eliminating duplication between runtime validation and compile-time types.
- **Composable.** Schemas can be extended, merged, and reused across routes.
- **Zero dependencies.** Zod has no external dependencies, keeping the bundle size small.

### Current Schemas

**`createItemSchema`**
```typescript
z.object({
  name: z.string().min(1).max(255),
  description: z.string().optional(),
})
```

**`updateItemSchema`**
```typescript
z.object({
  name: z.string().min(1).max(255),
  description: z.string().optional(),
})
```

**`itemIdParamSchema`**
```typescript
z.object({
  id: z.string().uuid(),
})
```

---

## Authentication

We use **Supabase Auth** for authentication. The frontend obtains a JWT from Supabase (via email/password, OAuth, magic link, etc.) and sends it to the backend as a Bearer token.

### How It Works
1. The frontend authenticates the user via `@supabase/supabase-js` and receives an access token.
2. Every request to a protected endpoint includes the header:
   ```
   Authorization: Bearer <supabase_access_token>
   ```
3. The `requireAuth` middleware in `middleware/auth.ts` calls `supabase.auth.getUser(token)` to verify the token server-side.
4. If valid, `req.user` is populated with `{ id, email }` and the request proceeds.
5. If invalid, a `401` is returned immediately.

### Why Supabase Auth?
- **Zero custom auth code.** We don't need to build password hashing, session management, or token rotation ourselves.
- **Multiple providers.** Supabase supports email/password, Google, GitHub, and magic links out of the box.
- **Row-Level Security ready.** When we need fine-grained access control at the database level, Supabase RLS policies are already designed for it.
- **Free tier.** Sufficient for development and early production.

### Required Environment Variables
| Variable | Description |
|---|---|
| `SUPABASE_URL` | Your Supabase project URL (e.g., `https://abc123.supabase.co`) |
| `SUPABASE_SERVICE_ROLE_KEY` | The service role key (server-side only, never expose to the frontend) |

> ⚠️ **Never commit `.env` files.** Copy `.env.example` to `.env` and fill in your values.

---

## Database

We use **PostgreSQL** via the `pg` driver (connection pool).

### Schema
The `items` table is created by the migration script (`src/db/migrate.ts`):

```sql
CREATE TABLE IF NOT EXISTS items (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name        VARCHAR(255) NOT NULL,
  description TEXT,
  user_id     UUID NOT NULL,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_items_user_id ON items(user_id);
```

### Running Migrations
```bash
# Build first (migration script is TypeScript)
npm run build:backend

# Run the migration
npm run --workspace backend db:migrate
```

### Required Environment Variables
| Variable | Description |
|---|---|
| `DATABASE_URL` | PostgreSQL connection string (e.g., `postgresql://postgres:postgres@localhost:5432/cicd_infra`) |

---

## API Endpoints

### Health Check (Unauthenticated)

| Method | Path | Description |
|---|---|---|
| `GET` | `/api/health` | Returns `{ status: "ok", db: "connected" }` if the database is reachable. Returns `503` otherwise. |

### Items CRUD (Authenticated — requires `Authorization: Bearer <token>`)

All item operations are **scoped to the authenticated user**. A user can only see, edit, and delete their own items. All request bodies are validated by Zod before reaching the handler.

| Method | Path | Validated By | Description |
|---|---|---|---|
| `POST` | `/api/items` | `createItemSchema` (body) | Create a new item. Body: `{ name, description }` |
| `GET` | `/api/items` | — | List all items for the authenticated user. |
| `GET` | `/api/items/:id` | `itemIdParamSchema` (params) | Get a single item by ID. |
| `PUT` | `/api/items/:id` | `itemIdParamSchema` (params) + `updateItemSchema` (body) | Update an item. Body: `{ name, description }` |
| `DELETE` | `/api/items/:id` | `itemIdParamSchema` (params) | Delete an item. Returns `204 No Content`. |

### Example: Create an Item
```bash
curl -X POST http://localhost:4000/api/items \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_SUPABASE_TOKEN" \
  -d '{"name": "My Item", "description": "A test item"}'
```

### Example: Validation Error
```bash
curl -X POST http://localhost:4000/api/items \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_SUPABASE_TOKEN" \
  -d '{"name": ""}'
```
Response (`400`):
```json
{
  "error": "Validation failed",
  "details": [
    { "field": "name", "message": "Name is required" }
  ]
}
```

### Legacy Endpoint
| Method | Path | Description |
|---|---|---|
| `GET` | `/api/hello` | Returns `{ message: "Hello from Backend" }`. Kept for Pact contract compatibility. |

---

## Local Development with Docker Compose

The `docker-compose.yml` at the repository root spins up:
- **PostgreSQL** on port `5432`
- **Backend** on port `4000`
- **Frontend** on port `5173`

```bash
# Start everything
docker-compose up -d --build

# View backend logs
docker-compose logs -f backend
```

The backend container automatically connects to the `db` service via the internal Docker network using the connection string `postgresql://postgres:postgres@db:5432/cicd_infra`.

FROM node:22-alpine AS builder

WORKDIR /app

# Copy root configurations
COPY package*.json ./
COPY turbo.json ./
COPY tsconfig.json ./

# Copy source code
COPY apps/backend/ apps/backend/
COPY packages/ packages/

# Install dependencies and build
RUN npm ci
RUN npm run build:backend

# Prune dev dependencies for a smaller runtime footprint
RUN npm prune --omit=dev

# Production stage
FROM node:22-alpine AS runner

WORKDIR /app
ENV NODE_ENV=production

# Copy strictly what's needed to run
COPY package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/packages ./packages
COPY --from=builder /app/apps/backend/package.json ./apps/backend/package.json
COPY --from=builder /app/apps/backend/dist ./apps/backend/dist

EXPOSE 4000
CMD ["sh", "-c", "node apps/backend/dist/db/migrate.js && node apps/backend/dist/index.js"]

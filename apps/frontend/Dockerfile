FROM node:22-alpine AS builder

WORKDIR /app

# Copy root configurations and workspaces
COPY package*.json ./
COPY turbo.json ./
COPY tsconfig.json ./

# Copy source code
COPY apps/frontend/ apps/frontend/
COPY packages/ packages/

# Install dependencies
RUN npm ci

ARG VITE_SUPABASE_URL
ARG VITE_SUPABASE_ANON_KEY
ENV VITE_SUPABASE_URL=$VITE_SUPABASE_URL
ENV VITE_SUPABASE_ANON_KEY=$VITE_SUPABASE_ANON_KEY

# Build the frontend
RUN npm run build:frontend

# Production stage using lightweight NGINX
FROM nginx:alpine AS runner

# Copy the built output from builder
COPY --from=builder /app/apps/frontend/dist /usr/share/nginx/html

# Copy custom nginx.conf for SPA routing and API proxying
COPY apps/frontend/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]

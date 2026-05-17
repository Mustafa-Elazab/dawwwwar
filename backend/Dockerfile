# ─── Build Stage ───────────────────────────────────────────────────
FROM node:20-alpine AS build

WORKDIR /app

# Install dependencies first (better caching)
COPY package*.json ./
RUN npm ci

# Copy source and config
COPY . .

# Build the app
RUN npm run build

# ─── Production Stage ──────────────────────────────────────────────
FROM node:20-alpine AS production

WORKDIR /app

# Install only production dependencies
COPY package*.json ./
RUN npm ci --only=production

# Copy built artifacts
COPY --from=build /app/dist ./dist

# Standard entrypoint
CMD ["node", "dist/main"]

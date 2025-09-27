# Multi-stage build for Node.js application
FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
WORKDIR /app

# Copy package files
COPY package*.json ./
# Install dependencies
RUN npm ci --only=production && npm cache clean --force

# Development dependencies for building
FROM base AS build-deps
WORKDIR /app
COPY package*.json ./
RUN npm ci

# Build stage
FROM build-deps AS build
WORKDIR /app

# Copy source code
COPY . .
COPY prisma ./prisma/

# Generate Prisma client
RUN npx prisma generate

# Build the application
RUN npm run build

# Development stage
FROM build-deps AS development
WORKDIR /app

# Copy source code
COPY . .
COPY prisma ./prisma/

# Generate Prisma client
RUN npx prisma generate

# Expose port
EXPOSE 5000

# Development command
CMD ["npm", "run", "dev"]

# Production stage
FROM base AS production
WORKDIR /app

# Create non-root user for security
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy built application
COPY --from=build --chown=nextjs:nodejs /app/dist ./dist
COPY --from=build --chown=nextjs:nodejs /app/node_modules ./node_modules
COPY --from=build --chown=nextjs:nodejs /app/package*.json ./
COPY --from=build --chown=nextjs:nodejs /app/prisma ./prisma

# Switch to non-root user
USER nextjs

# Expose port
EXPOSE 5000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:5000/health || exit 1

# Start the application
CMD ["npm", "start"]
# Multi-stage build for user-service
FROM node:18-alpine AS base

# Set working directory
WORKDIR /app

# Copy package files for dependency installation
COPY package*.json ./
COPY tsconfig*.json ./

# Copy workspace configuration
COPY services/user-service/package*.json ./services/user-service/
COPY packages/core-utils/package*.json ./packages/core-utils/
COPY packages/db-models/package*.json ./packages/db-models/

# Install dependencies
RUN npm ci --only=production && npm cache clean --force

# Build stage
FROM base AS builder

# Copy source code
COPY services/user-service/ ./services/user-service/
COPY packages/ ./packages/

# Install dev dependencies for building
RUN npm ci

# Build TypeScript
RUN npm run build

# Production stage
FROM node:18-alpine AS production

# Create app user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nodejs -u 1001

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./
COPY services/user-service/package*.json ./services/user-service/
COPY packages/core-utils/package*.json ./packages/core-utils/
COPY packages/db-models/package*.json ./packages/db-models/

# Install only production dependencies
RUN npm ci --only=production && npm cache clean --force

# Copy built application from builder stage
COPY --from=builder --chown=nodejs:nodejs /app/services/user-service/dist ./services/user-service/dist
COPY --from=builder --chown=nodejs:nodejs /app/packages ./packages

# Switch to non-root user
USER nodejs

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/health', (res) => { process.exit(res.statusCode === 200 ? 0 : 1) })" || exit 1

# Start the application
CMD ["node", "services/user-service/dist/index.js"]

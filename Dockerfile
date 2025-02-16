# Base image for building dependencies
FROM node:20-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package files separately to leverage caching
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy the rest of the app's source code
COPY . .

# Create a "dist" folder with the production build
RUN npm run build

# Production stage
FROM node:20-alpine AS prod

# Set working directory
WORKDIR /app

# Copy built assets and dependencies from builder
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/.env ./

# Install only production dependencies
RUN npm ci --omit=dev

# Expose port
EXPOSE 3000

# Start the app
CMD ["npm", "run", "start:prod"]

# Development stage
FROM node:20-alpine AS dev

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install all dependencies (including dev dependencies)
RUN npm install

# Copy the rest of the app's source code
COPY . .

# Expose port
EXPOSE 3000

# Start the app in dev mode
CMD ["npm", "run", "start:dev"]
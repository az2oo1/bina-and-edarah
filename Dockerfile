FROM node:20-alpine AS builder

# Install system dependencies required by Prisma and other native modules
RUN apk add --no-cache openssl libc6-compat

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY patch-xlsx.cjs ./
COPY prisma ./prisma/

# Install dependencies
RUN npm ci --no-audit --no-fund

# Copy application code
COPY . .

# Generate Prisma client and build the app
RUN npx prisma generate
RUN npm run build

# Production image
FROM node:20-alpine AS runner

# Install system dependencies required by Prisma and other native modules
RUN apk add --no-cache openssl libc6-compat

WORKDIR /app

ENV NODE_ENV=production
# Define a default database URL that maps to the `/data` volume
ENV DATABASE_URL="file:/data/dev.db"

# Copy necessary files from builder
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/uploads ./uploads


# Expose port
EXPOSE 3000

# Start script
# This pushes schema changes to the db before starting the app
CMD npx prisma db push && npm start

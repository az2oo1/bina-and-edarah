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
RUN apk add --no-cache openssl libc6-compat curl

WORKDIR /app

ENV NODE_ENV=production
# Define a default database URL that maps to the `/data` volume
ENV DATABASE_URL="postgresql://postgres:postgres@localhost:5432/bina_db?schema=public"

# Copy necessary files from builder
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/uploads ./uploads

# Copy and prepare the entrypoint script
COPY docker-entrypoint.sh ./docker-entrypoint.sh
RUN chmod +x ./docker-entrypoint.sh


# Expose port
EXPOSE 3000

# Entrypoint: creates/syncs DB schema with retries, then starts the app.
CMD ["/app/docker-entrypoint.sh"]

# Bina and Edarah

Full-stack real estate platform built with React, Vite, Express, and Prisma.

## Tech Stack

- Frontend: React + Vite + TypeScript
- Backend: Express + TypeScript
- Database ORM: Prisma
- Primary Database: PostgreSQL

## Prerequisites

- Node.js 20+
- npm 10+
- PostgreSQL 15+ (for local development)

## Environment Variables

Create a `.env` file in the project root.

Required:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/bina_db?schema=public"
```

Recommended:

```env
JWT_SECRET="replace-with-a-strong-secret"
APP_URL="http://localhost:3000"
GEMINI_API_KEY="your-gemini-api-key"

# Optional SMTP (email notifications)
SMTP_HOST=""
SMTP_PORT="587"
SMTP_USER=""
SMTP_PASS=""
SMTP_FROM="no-reply@example.com"

# Optional OTP webhook
WHATOMATE_WEBHOOK_URL=""
```

Notes:

- `DATABASE_URL` is required because Prisma datasource uses PostgreSQL.
- `GEMINI_API_KEY` is optional unless you use Gemini-related features.

## Local Development

1. Install dependencies:

```bash
npm install
```

2. Generate Prisma client:

```bash
npx prisma generate
```

3. Push schema to your local database:

```bash
npx prisma db push
```

4. Start development server:

```bash
npm run dev
```

The app runs at http://localhost:3000.

## Docker (Recommended for Quick Start)

This repo includes `docker-compose.yml` for app + PostgreSQL.

1. Set your Gemini key in your shell (optional):

```bash
set GEMINI_API_KEY=your-gemini-api-key
```

2. Start containers:

```bash
docker compose up -d
```

3. Open:

http://localhost:3000

To stop:

```bash
docker compose down
```

To stop and remove data volumes:

```bash
docker compose down -v
```

## Build and Run (Production Mode)

```bash
npm run build
npm start
```

## Available Scripts

- `npm run dev`: Run Express + Vite in development mode
- `npm run build`: Generate Prisma client, build frontend, bundle backend
- `npm start`: Run bundled server from `dist/server.cjs`
- `npm run preview`: Preview Vite frontend build
- `npm run lint`: Type-check project with TypeScript
- `npm run clean`: Remove build artifacts

## Default Admin Fallback

If the database has no admin users yet, the server logs fallback credentials at startup:

- Username: `admin`
- Password: `admin`

Change credentials immediately after first login.

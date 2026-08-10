# Bina and Edarah (بناء وإدارة)

Full-stack real estate and property management platform built with React 19, Vite, Express, Prisma, CockroachDB, and RustFS S3 Object Storage.

---

## Tech Stack

- **Frontend:** React 19 + Vite + Tailwind CSS + Framer Motion + Lucide Icons
- **Backend:** Express + TypeScript + Socket.IO (Real-time engine)
- **Database:** CockroachDB (PostgreSQL-compatible distributed DB) via Prisma ORM
- **Object Storage:** RustFS / S3-compatible high-performance storage (Videos, Assets, Images)
- **Integrations:** Google Gemini AI, Authentica (Saudi SMS/OTP Gateway), IMAP Inbound Email Sync

---

## Prerequisites

- **Node.js:** 20+
- **npm:** 10+
- **Docker & Docker Compose:** (Recommended for running full stack)

---

## Environment Variables

Create a `.env` file in the project root (see [`.env.example`](file:///c:/Users/abdul/Documents/GitHub/bina-and-edarah/.env.example)):

```env
# Application URL & Secret
APP_URL="http://localhost:3000"
JWT_SECRET="bina-edara-jwt-secret-key-1337"

# Database Connection (CockroachDB / PostgreSQL)
DATABASE_URL="postgresql://root@localhost:26257/bina_db?sslmode=disable"

# S3 / RustFS Object Storage
S3_ENDPOINT="http://localhost:9000"
S3_BUCKET="bina-assets"
S3_ACCESS_KEY="rustfsaccesskey"
S3_SECRET_KEY="rustfssecretkey"
S3_REGION="us-east-1"

# AI Integration
GEMINI_API_KEY="your-gemini-api-key"

# Authentica Saudi SMS & WhatsApp Gateway
AUTHENTICA_API_KEY="$2y$10$qtRuMVdslBE8aQDUvWoiJuPYCRYt/mw95knxkg5d9WfnfYcZrKrSG"
AUTHENTICA_ENABLED="true"
AUTHENTICA_METHOD="sms"

# Webhooks & SEO
WHATOMATE_WEBHOOK_URL="https://hook.us2.make.com/your-webhook-url"
INDEXNOW_KEY=""
```

---

## Docker Quick Start (Recommended)

The included [`docker-compose.yml`](file:///c:/Users/abdul/Documents/GitHub/bina-and-edarah/docker-compose.yml) starts the entire ecosystem: App, CockroachDB, and RustFS Storage.

### 1. Start all containers:
```bash
docker compose up -d
```

### 2. Services and Ports:
- **Web Application:** [http://localhost:3000](http://localhost:3000)
- **CockroachDB Dashboard:** [http://localhost:8080](http://localhost:8080)
- **RustFS S3 API:** `http://localhost:9000`
- **RustFS Web Console:** [http://localhost:9001](http://localhost:9001)

### 3. Stop containers:
```bash
docker compose down
```

To stop and remove data volumes:
```bash
docker compose down -v
```

---

## Admin Account & Password Reset

### Default Credentials (On Empty DB)
When initialized with an empty database:
- **Username:** `admin`
- **Password:** `admin`

### Resetting Admin Password via Terminal
If you cannot log in or need to generate a new randomized secure password:

#### Inside Docker:
```bash
docker compose exec app npm run reset-admin
```

#### In Interactive Running Terminal:
Type `reset` directly in the console where the server is running and press **Enter**:
```text
reset
```

#### In Local Development:
```bash
npm run reset-admin
```

*(You can also specify a username, e.g. `npm run reset-admin myuser` or `reset myuser` in terminal).*

---

## Local Development (Without Docker)

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Generate Prisma Client:**
   ```bash
   npx prisma generate
   ```

3. **Synchronize DB Schema:**
   ```bash
   npx prisma db push
   ```

4. **Start Development Server:**
   ```bash
   npm run dev
   ```
   Runs Express + Vite at [http://localhost:3000](http://localhost:3000).

---

## Available Scripts

- `npm run dev`: Run Express + Vite in development mode
- `npm run build`: Generate Prisma client, build frontend assets with Vite, and bundle backend + CLI with esbuild
- `npm start`: Run the bundled production server (`dist/server.cjs`)
- `npm run reset-admin`: Randomize and reset the admin account password
- `npm run preview`: Preview the production Vite build
- `npm run lint`: Run TypeScript type-checking (`tsc --noEmit`)
- `npm test`: Run automated test suite
- `npm run clean`: Remove build artifacts

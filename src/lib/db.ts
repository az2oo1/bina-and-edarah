import { execSync } from 'child_process';
import type { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';
import { createRequire } from 'module';

const require = createRequire(import.meta.url || __filename);

let client: any = null;
let isInitialized = false;

function getCurrentProvider(schemaPath: string): string {
  if (!fs.existsSync(schemaPath)) return "";
  try {
    const content = fs.readFileSync(schemaPath, "utf-8");
    const match = content.match(/provider\s*=\s*"([^"]+)"/);
    return match ? match[1] : "";
  } catch (err) {
    return "";
  }
}

function initializeDatabase() {
  if (isInitialized) return;
  isInitialized = true;

  console.log("Initializing database connection...");

  let databaseUrl = process.env.DATABASE_URL || "";
  let usePostgres = false;

  if (databaseUrl.startsWith("postgresql://") || databaseUrl.startsWith("postgres://")) {
    // A PostgreSQL DATABASE_URL is configured: always honor it. The connectivity
    // check below is informational only — we never silently fall back to SQLite
    // when PostgreSQL is explicitly requested (that would corrupt the schema).
    usePostgres = true;
    try {
      const parsed = new URL(databaseUrl);
      const host = parsed.hostname;
      const port = parsed.port ? parseInt(parsed.port, 10) : 5432;

      console.log(`Checking PostgreSQL connectivity at ${host}:${port}...`);
      execSync(`node -e "const net = require('net'); const client = net.createConnection({ host: '${host}', port: ${port}, timeout: 2000 }, () => { client.end(); process.exit(0); }); client.on('error', () => process.exit(1)); client.on('timeout', () => process.exit(1));"`, { stdio: 'ignore' });

      console.log("PostgreSQL is reachable.");
    } catch (err) {
      console.warn("PostgreSQL is not reachable yet — will still use the configured PostgreSQL DATABASE_URL.");
    }
  } else if (!databaseUrl) {
    // If no DATABASE_URL, check local postgres port 5432
    try {
      console.log("No DATABASE_URL set. Checking for local PostgreSQL at localhost:5432...");
      execSync(`node -e "const net = require('net'); const client = net.createConnection({ host: 'localhost', port: 5432, timeout: 2000 }, () => { client.end(); process.exit(0); }); client.on('error', () => process.exit(1)); client.on('timeout', () => process.exit(1));"`, { stdio: 'ignore' });
      
      databaseUrl = "postgresql://postgres:postgres@localhost:5432/bina_db?schema=public";
      process.env.DATABASE_URL = databaseUrl;
      console.log("Found local PostgreSQL. Using default connection string.");
      usePostgres = true;
    } catch (err) {
      console.log("No local PostgreSQL found. Falling back to SQLite.");
    }
  } else {
    console.log("Using non-PostgreSQL DATABASE_URL directly.");
  }

  // 1. Copy the correct schema file
  const prismaDir = path.resolve(process.cwd(), "prisma");
  const activeSchemaPath = path.join(prismaDir, "schema.prisma");
  const currentProvider = getCurrentProvider(activeSchemaPath);

  let schemaChanged = false;

  if (usePostgres) {
    console.log("Using PostgreSQL mode.");
    if (currentProvider !== "postgresql") {
      const postgresSchemaPath = path.join(prismaDir, "schema_postgresql.prisma");
      if (fs.existsSync(postgresSchemaPath)) {
        fs.copyFileSync(postgresSchemaPath, activeSchemaPath);
        schemaChanged = true;
      }
    }
  } else {
    console.log("Using SQLite mode.");
    if (currentProvider !== "sqlite") {
      const sqliteSchemaPath = path.join(prismaDir, "schema_sqlite.prisma");
      if (fs.existsSync(sqliteSchemaPath)) {
        fs.copyFileSync(sqliteSchemaPath, activeSchemaPath);
        schemaChanged = true;
      }
    }
    
    // Set SQLite fallback URL if not set or is postgres url
    if (!process.env.DATABASE_URL || process.env.DATABASE_URL.startsWith("postgres")) {
      const sqlitePath = fs.existsSync("/data") ? "/data/dev.db" : path.join(prismaDir, "dev.db");
      process.env.DATABASE_URL = `file:${sqlitePath}`;
      console.log(`SQLite database file path: ${sqlitePath}`);
    }
  }

  // Check if @prisma/client package is generated
  const clientGeneratedPath = path.resolve(process.cwd(), "node_modules", "@prisma", "client");
  const hasClient = fs.existsSync(clientGeneratedPath);

  // 2. Synchronize schema and generate client dynamically if schema changed or client doesn't exist
  try {
    console.log("Pushing database schema via Prisma...");
    execSync("npx prisma db push --accept-data-loss", { stdio: "inherit" });
    
    if (schemaChanged || !hasClient) {
      console.log("Generating Prisma client...");
      execSync("npx prisma generate", { stdio: "inherit" });
    } else {
      console.log("Skipped client generation since schema provider is unchanged.");
    }
    console.log("Database initialized successfully.");
  } catch (err) {
    console.error("Database schema sync or client generation failed:", err);
    if (usePostgres) {
      // PostgreSQL was explicitly requested — never silently switch to SQLite.
      // Surface the error so the misconfiguration is obvious.
      console.error("PostgreSQL is configured but schema sync failed. Check DATABASE_URL and that the database is running.");
    }
  }
}

function getPrismaClient() {
  if (client) return client;
  initializeDatabase();
  const { PrismaClient } = require("@prisma/client");
  client = new PrismaClient({
    log: ["error", "warn"],
  });
  return client;
}

export const prisma = new Proxy({}, {
  get(target, prop) {
    const activeClient = getPrismaClient();
    const value = activeClient[prop];
    if (typeof value === "function") {
      return value.bind(activeClient);
    }
    return value;
  },
}) as unknown as PrismaClient;

const globalForPrisma = global as unknown as { prisma: any };
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

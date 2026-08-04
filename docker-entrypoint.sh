#!/bin/sh
set -e

MAX_RETRIES=15
RETRY_DELAY=5

echo "[entrypoint] Syncing database schema..."

for i in $(seq 1 $MAX_RETRIES); do
  # Generate only the SQL diff (what is missing from the DB vs the schema)
  # and pipe it directly into prisma db execute.
  # - If the DB is empty:  full CREATE TABLE SQL is generated and executed.
  # - If tables exist:     the diff is empty (no-op, exits 0).
  # This is idempotent and works correctly with CockroachDB.
  if npx prisma migrate diff \
      --from-schema-datasource prisma/schema.prisma \
      --to-schema-datamodel   prisma/schema.prisma \
      --script \
    | npx prisma db execute --schema=prisma/schema.prisma --stdin; then
    echo "[entrypoint] ✅ Database schema is ready."
    break
  fi

  if [ "$i" -eq "$MAX_RETRIES" ]; then
    echo "[entrypoint] ❌ ERROR: Schema sync failed after $MAX_RETRIES attempts. Exiting."
    exit 1
  fi

  echo "[entrypoint] ⏳ Attempt $i/$MAX_RETRIES failed. Retrying in ${RETRY_DELAY}s..."
  sleep "$RETRY_DELAY"
done

echo "[entrypoint] 🚀 Starting application..."
exec npm start

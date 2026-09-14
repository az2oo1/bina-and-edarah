#!/bin/sh
set -e

MAX_RETRIES=15
RETRY_DELAY=5

echo "[entrypoint] Syncing database schema..."

export NPM_CONFIG_UPDATE_NOTIFIER=false

for i in $(seq 1 $MAX_RETRIES); do
  # Generate only the SQL diff (what is missing from the DB vs the schema)
  DIFF_SQL=$(npx --no-update-notifier prisma migrate diff \
      --from-schema-datasource prisma/schema.prisma \
      --to-schema-datamodel   prisma/schema.prisma \
      --script 2>/dev/null || true)

  if [ -z "$DIFF_SQL" ]; then
    echo "[entrypoint] ✅ Database schema is up to date (no changes)."
    break
  fi

  echo "[entrypoint] Applying schema updates..."
  # Apply diff with a timeout so a stalled DDL job never hangs container startup
  if echo "$DIFF_SQL" | timeout 15 npx --no-update-notifier prisma db execute --schema=prisma/schema.prisma --stdin; then
    echo "[entrypoint] ✅ Database schema is ready."
    break
  fi

  if [ "$i" -eq "$MAX_RETRIES" ]; then
    echo "[entrypoint] ⚠️ Schema sync could not complete within $MAX_RETRIES attempts. Continuing to start application..."
    break
  fi

  echo "[entrypoint] ⏳ Attempt $i/$MAX_RETRIES failed or timed out. Retrying in ${RETRY_DELAY}s..."
  sleep "$RETRY_DELAY"
done

echo "[entrypoint] 🚀 Starting application..."
exec npm start

#!/usr/bin/env sh
set -e
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
set -a
# shellcheck disable=SC1091
. "$ROOT/.env"
set +a

export NODE_ENV=development
export DATABASE_URL="postgresql://${POSTGRES_USER:-comam}:${POSTGRES_PASSWORD}@localhost:5432/${POSTGRES_DB:-comam}"
export REDIS_URL="redis://:${REDIS_PASSWORD}@localhost:6379"
export S3_ENDPOINT="http://localhost:9000"

# Next.js prioriza apps/web/.env.local sobre variables del shell
mkdir -p "$ROOT/apps/web"
cat > "$ROOT/apps/web/.env.local" <<EOF
# Generado por scripts/dev-local.sh — no editar a mano
DATABASE_URL=${DATABASE_URL}
REDIS_URL=${REDIS_URL}
S3_ENDPOINT=${S3_ENDPOINT}
AUTH_SECRET=${AUTH_SECRET}
NEXT_PUBLIC_APP_URL=http://localhost:3000
EOF

rm -rf "$ROOT/apps/web/.next"

exec pnpm --filter web dev "$@"

#!/usr/bin/env sh
set -e
cd "$(dirname "$0")/.."

pnpm --filter @comam/db migrate
pnpm --filter @comam/db seed

echo "Migraciones y seed completados."

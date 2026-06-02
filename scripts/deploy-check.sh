#!/usr/bin/env sh
set -e
docker compose config >/dev/null
echo "docker-compose.yml válido"
pnpm build
echo "Build OK"

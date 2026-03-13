#!/usr/bin/env bash
set -euo pipefail

IMAGE="fpindej/netrock-web"
DEFAULT_TAG=$(node -p "require('./packages/web/package.json').version")
TAG="${1:-$DEFAULT_TAG}"

TAGS="-t ${IMAGE}:${TAG}"
if [ "${TAG}" != "latest" ]; then
  TAGS="${TAGS} -t ${IMAGE}:latest"
fi

echo "Building and pushing ${IMAGE}:${TAG} (linux/amd64)..."
docker buildx build --platform linux/amd64 ${TAGS} --push .

echo "Done. Deploy on VPS:"
echo "  cd /var/apps/netrock-cli && docker compose pull && docker compose up -d"

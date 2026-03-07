#!/usr/bin/env bash
set -euo pipefail

IMAGE="fpindej/netrock-web"
TAG="${1:-latest}"

echo "Building ${IMAGE}:${TAG}..."
docker build -t "${IMAGE}:${TAG}" -t "${IMAGE}:latest" .

echo "Pushing ${IMAGE}:${TAG}..."
docker push "${IMAGE}:${TAG}"
if [ "${TAG}" != "latest" ]; then
  docker push "${IMAGE}:latest"
fi

echo "Done. Deploy on VPS:"
echo "  cd /var/apps/netrock-cli && docker compose pull && docker compose up -d"

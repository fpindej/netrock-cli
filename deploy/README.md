# VPS Deployment

Copy `docker-compose.yml` and `.env` to `/var/apps/netrock-cli/` on your server.

```bash
# On the VPS
cd /var/apps/netrock-cli
docker compose pull
docker compose up -d
```

The site will be available on the port configured in `.env` (default: 8080).
Put a reverse proxy (Caddy, nginx, Traefik) in front for HTTPS.

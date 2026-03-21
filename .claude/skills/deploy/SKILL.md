---
description: Build and deploy the web UI to Docker Hub
user-invocable: true
---

# /deploy

Builds and pushes the Docker image, then provides the VPS update command.

## Steps

1. Verify on `main` branch (warn if not)
2. Verify no uncommitted changes
3. Verify tests pass: `pnpm test && pnpm build`
4. Run the deploy script:

   ```bash
   bash scripts/deploy.sh
   ```

   This builds `fpindej/netrock-web:{version}` + `:latest` and pushes to Docker Hub.

5. Report the deployed version and VPS command:
   ```
   cd /var/apps/netrock-cli && docker compose pull && docker compose up -d
   ```

## Rules

- Never deploy with failing tests
- If there are generator-facing changes, version must be bumped first (use `/bump-version`)

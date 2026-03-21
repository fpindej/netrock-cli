---
description: Run full verification (backend build+test, frontend test+lint+check)
user-invocable: true
---

# /verify

Run the full post-change verification pipeline. Report the result of each step. If any step fails, stop and show the errors.

## Backend (run when `src/backend/` changed)

```bash
dotnet build src/backend/MyProject.slnx && dotnet test src/backend/MyProject.slnx -c Release
```

<!-- @feature frontend -->

## Frontend (run when `src/frontend/` changed)

```bash
cd src/frontend && pnpm run test && pnpm run format && pnpm run lint && pnpm run check
```

<!-- @end -->

If unsure which stack changed, run both. Fix all failures before reporting success.

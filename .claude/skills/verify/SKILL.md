---
description: Run full verification (tests, build, type-check)
user-invocable: true
---

# /verify

Run the verification pipeline. Report each step's result. Stop on first failure.

```bash
# Core tests + build
pnpm --filter @netrock/core exec vitest run && pnpm --filter @netrock/core build

# Web type-check
pnpm --filter @netrock/web check

# Full build (both packages)
pnpm build
```

Fix all failures before reporting success. Loop until green.

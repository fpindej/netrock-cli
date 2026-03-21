---
description: Sync template files from the source netrock repo
user-invocable: true
argument-hint: '[PR number or description]'
---

# /sync-templates

Syncs template files from the source project (fpindej/netrock) into this generator's `templates/` directory.

The source repo is at `~/source/web-app-template`.

## Steps

1. **Identify what to sync**: If a PR number is given, fetch the PR diff with `gh pr view` / `gh pr diff` from `fpindej/netrock`. Otherwise, ask the user.

2. **Copy files** from source to `templates/`:
   - Root files (`.gitignore`, `CLAUDE.md`, `.claude/`) map to `templates/` directly
   - `src/backend/...` maps to `templates/src/backend/...`
   - `src/frontend/...` maps to `templates/src/frontend/...`

3. **Preserve @feature markers**: This is critical.
   - Before copying a `templated: true` file, read the existing template version
   - After copying, compare: if markers were lost, restore them manually
   - For non-templated files, direct copy is safe
   - When in doubt, check the manifest: `grep` for the file path in `packages/core/src/manifests/`

4. **Register new files** in the relevant manifest (`packages/core/src/manifests/*.ts`):
   - Set `templated: true` for files containing `@feature` markers
   - Determine which manifest based on the feature the file belongs to

5. **Add @feature markers** to new files if they contain feature-specific content:
   - Auth-specific code: `# @feature auth` / `# @end` or `<!-- @feature auth -->` / `<!-- @end -->`
   - Frontend-specific: `@feature frontend`
   - Check existing template files for patterns

6. **Update snapshots**: `pnpm --filter @netrock/core exec vitest run --update`

7. **Verify**: `pnpm test && pnpm build`

8. Commit: `feat(templates): sync {description} from netrock PR #{number}`

## Key Rules

- NEVER lose existing `@feature` markers - they are the core value of this generator
- Non-templated files can be copied directly
- Always run tests after sync - snapshot failures reveal missed markers
- `Directory.Packages.props` is `templated: true` (has @feature markers) - never direct copy

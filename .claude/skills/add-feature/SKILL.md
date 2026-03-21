---
description: Scaffold a new generator feature (definition, manifest, templates)
user-invocable: true
argument-hint: '<feature-id> <feature-name>'
---

# /add-feature

Scaffolds a new feature for the netrock generator following the checklist in CLAUDE.md.

## Steps

1. **Define the feature** in `packages/core/src/features/definitions.ts`:
   - Add to the `featureDefinitions` array
   - Set id, name, description, details, dependencies, group
   - Set `required: false`, `defaultEnabled: false` unless told otherwise

2. **Create the manifest** at `packages/core/src/manifests/{feature-id}.ts`:
   - Follow the pattern from existing manifests (e.g., `email.ts`, `jobs.ts`)
   - Export a `register{Feature}Manifest()` function
   - List all template files with correct `templated` flags

3. **Register the manifest** in `packages/core/src/manifests/index.ts`:
   - Import and call the register function in `registerAllManifests()`

4. **Add template files** to `templates/`:
   - Use `MyProject` as the namespace placeholder
   - Add `@feature` markers in existing cross-cutting template files

5. **Update snapshots**: `pnpm --filter @netrock/core exec vitest run --update`

6. **Verify**: `pnpm test && pnpm build`

7. **Add CI matrix entry** in `.github/workflows/ci.yml` if testable independently

## Checklist

After implementation, verify:

- Feature in `featureDefinitions` with correct deps
- Manifest lists all files with correct `templated` flags
- Manifest registered in index.ts
- Template files exist in `templates/`
- No residual `@feature` markers in non-templated files
- `pnpm test` passes (snapshots updated)
- `pnpm build` passes

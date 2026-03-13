# CLAUDE.md

Netrock CLI - TypeScript monorepo that generates .NET 10 Clean Architecture projects from templates.

```
packages/core   Pure TS engine: feature graph, template processor, namespace substitution
packages/web    SvelteKit static UI: feature picker, preset grid, ZIP download
packages/cli    (future) CLI interface
scripts/        generate.ts (interactive), generate-ci.ts (CI), audit.ts (matrix verification), deploy.sh
templates/      846 template files - the .NET project skeleton with @feature conditional markers
```

## Hard Rules

- Prettier formatting enforced (tabs, single quotes, no trailing commas, 100 char width)
- Strict TypeScript: `noUnusedLocals`, `noUnusedParameters`, `noUncheckedIndexedAccess`
- ESM only (`"type": "module"`) - all imports use `.js` extensions
- pnpm only - never npm or yarn
- No em dashes - never use `---` anywhere. Use `-` or rewrite.
- No emojis anywhere
- Atomic commits: `type(scope): imperative description`. No `Co-Authored-By` lines.
- No dead code - remove unused imports, variables, files in the same commit

## Template System

- `@feature <id>` / `@end` comment markers gate content by feature
- Supports `//`, `#`, `<!-- -->` comment styles
- Negation: `@feature !id` includes content when feature is disabled
- Files marked `templated: true` in manifests get marker processing
- Files that become empty after processing are excluded from output
- `MyProject` is the namespace placeholder, replaced during generation

## Verification

```bash
# After any change to packages/core
pnpm test && pnpm build

# After any change to packages/web
pnpm --filter @netrock/web check

# Full check
pnpm test && pnpm build && pnpm check

# Audit feature combinations (slow - generates + builds + tests .NET projects)
pnpm tsx scripts/audit.ts
```

## Adding a Feature

1. Define in `packages/core/src/features/definitions.ts` (id, deps, group)
2. Create manifest in `packages/core/src/manifests/<feature>.ts` (file list + templated flags)
3. Register in `packages/core/src/manifests/index.ts`
4. Add template files to `templates/`
5. Gate cross-cutting content with `@feature` markers in existing templates
6. Add CI matrix entry in `.github/workflows/ci.yml`

## Key Files

| File                                               | Purpose                                    |
| -------------------------------------------------- | ------------------------------------------ |
| `packages/core/src/features/definitions.ts`        | Feature definitions with dependency graph  |
| `packages/core/src/manifests/`                     | Per-feature file lists and templated flags |
| `packages/core/src/engine/processor.ts`            | `@feature` marker processing logic         |
| `packages/core/src/engine/generator.ts`            | Main generation entry point                |
| `packages/core/src/presets/index.ts`               | Minimal, Standard, Full presets            |
| `packages/web/src/lib/stores/generator.svelte.ts`  | Reactive UI state                          |
| `packages/web/src/lib/components/StackStep.svelte` | Feature picker + preset grid               |
| `.github/workflows/ci.yml`                         | Unit tests + dotnet build/test matrix      |
| `scripts/deploy.sh`                                | Docker build + push to Docker Hub          |

## Web UI Design Rules

All changes to `packages/web` must follow these rules. Do not ask - just enforce them.

### Responsiveness

- Every UI change must work on phones (320px), tablets (768px), and desktops (1280px+)
- Test all screen orientations conceptually - no horizontal overflow, no clipped content
- Use Tailwind responsive prefixes (`sm:`, `md:`, `lg:`) for breakpoint-specific sizing

### Touch Targets

- Minimum **44px** touch target on all interactive elements (buttons, links, toggles) on mobile
- Use `min-h-[44px]` on mobile, `sm:min-h-0` on desktop for compact mode
- Invisible hit areas (transparent rects) are acceptable for SVG elements

### Visual Standards

- Dark theme only - all colors from `app.css` theme variables
- No white flash - inline `background` on `<html>` for instant dark paint
- No browser default focus rings - use custom `focus-visible` styles with accent color
- Monospace font (`font-mono`) for labels, stats, and technical text
- Touch-friendly spacing on mobile, compact on desktop

### Anime.js

- Use `animate` and `stagger` from `animejs` (v4 named exports, not default)
- Easing names: `outCubic`, `inCubic`, `outQuad`, `outExpo` (no `ease` prefix)
- Entrance animations: stagger + opacity + translateX/Y
- Step transitions: slide + fade (200-300ms)

### Before Shipping

- Verify touch targets with pixel math: `(element_size_in_svg_units * render_scale) >= 44px`
- Verify no content clipping on 320px viewport
- Run `pnpm build` + `pnpm --filter @netrock/web check` (0 errors, 0 warnings)
- Update version + CHANGELOG.md for feature changes

## Template Sync

Templates are synced manually from `fpindej/netrock` (the source project). When syncing:

- Copy files, then add `@feature` markers for conditional sections
- Update the relevant manifest's file list
- Run `pnpm test` to verify engine, then `pnpm tsx scripts/audit.ts` for integration

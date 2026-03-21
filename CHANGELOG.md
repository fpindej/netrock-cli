# Changelog

All notable changes to the netrock generator will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/).

## [0.9.2] - 2026-03-21

### Added

- `devops-engineer` agent for infrastructure implementation (Dockerfiles, Aspire, CI/CD, env vars)
- Agent escalation pattern: implementation agents stop and report to orchestrator after 3 failed attempts on out-of-scope issues
- Review conflict handling: `/address-review` now flags contradictory comments for user judgment
- Infra delegation pattern and autonomous behavior trigger in generated CLAUDE.md

### Fixed

- All 19 procedural skills now properly invocable (replaced `disable-model-invocation` with `user-invocable: true` and descriptions)
- Skill frontmatter standardized to `user-invocable` (hyphen) per Claude Code docs
- `security-reviewer` model changed from `sonnet` to `inherit` (matches session model)

## [0.9.1] - 2026-03-21

### Changed

- Backend: .NET 10.0.3 to 10.0.5 (framework, EF tools)
- Backend: Microsoft.Extensions.Caching.Hybrid, Http.Resilience, ServiceDiscovery 10.3.0 to 10.4.0
- Backend: Npgsql.EntityFrameworkCore.PostgreSQL 10.0.0 to 10.0.1
- Backend: OpenTelemetry.Instrumentation.AspNetCore 1.15.0 to 1.15.1
- Backend: Scalar.AspNetCore 2.13.2 to 2.13.9
- Backend: AWSSDK.S3 3.7.510.14 to 3.7.511.1
- Backend: Microsoft.Extensions.TimeProvider.Testing 10.3.0 to 10.4.0
- Frontend: @inlang/paraglide-js 2.13.2 to 2.15.0
- Frontend: @sveltejs/kit 2.53.4 to 2.55.0
- Frontend: svelte 5.53.8 to 5.53.12
- Frontend: typescript-eslint 8.57.0 to 8.57.1

## [0.9.0] - 2026-03-21

### Added

- Claude Code rules files in generated projects: backend-api, database, infrastructure, testing patterns (quick-reference for orchestrator)
- Frontend Svelte rules file (included when SvelteKit frontend is selected)
- `/verify` skill for running full backend build+test and frontend test+lint+check
- `/address-review` skill for reading, evaluating, and addressing PR review comments
- Claude Code permissions in generated projects (42 allow rules, 30 deny rules with cross-platform coverage)
- `settings.local.json.example` for user-specific permission overrides
- Delegation Rule in generated CLAUDE.md (orchestrator delegates `src/` code to specialized agents)
- Stop-quality-gate hook now warns when session ends on main/master branch

### Fixed

- Shell injection vulnerability in auto-format hook (replaced `execSync` string interpolation with `execFileSync` args array)
- Validate-bash hook now catches `git checkout -- .` variant (broadened regex)
- Validate-bash hook blocks `npm install` (enforces pnpm-only)
- Feature-gated `@feature` markers on auth-specific content in rules files (authorization, seeding, test auth)
- Feature-gated `@feature frontend` on frontend testing rules and verify skill frontend section

## [0.8.3] - 2026-03-14

### Added

- Collapsible FAQ on step 1 with 9 community-sourced questions (swappability, ABP comparison, multitenancy, AI transparency, SvelteKit BFF, and more)
- Aspire dashboard opens without login token after setup (scoped env var in setup scripts)
- Aspire dashboard token note in generated CLAUDE.md

### Fixed

- Binary files (favicons, icons) separated from text template engine - no more UTF-8 corruption
- Template favicons now match brand colors in generated projects

## [0.8.2] - 2026-03-14

### Fixed

- Binary files (favicons, icons) no longer corrupted in generated projects - separated from text template engine entirely
- Generator now has clean text-only contract; binary files pass through as raw bytes with path substitution only

### Changed

- `GeneratedProject` now has `files` (text) and `binaryFiles` (Uint8Array) as separate arrays
- `TemplateSource` interface gains `getBinaryFile()` method
- `TemplateEntry` gains optional `binary` flag for manifest declarations
- Vite plugin exports `textFiles` and `binaryFiles` as separate maps

## [0.8.1] - 2026-03-14

### Fixed

- Generated projects now ship with brand-colored favicons by default (were still using old generic ones)

## [0.8.0] - 2026-03-14

### Added

- SEO fundamentals in generated projects: server-generated robots.txt with feature-gated disallow rules, dynamic sitemap.xml endpoint, OG/Twitter Card/canonical meta tags in root layout
- Full favicon set matching brand colors (16, 32, ICO, apple-touch-icon, android-chrome 192/512)
- OG preview image for social sharing (1200x630)
- Sitemap.xml, robots.txt, canonical URLs, JSON-LD structured data, and keywords meta on the generator site
- Per-page SEO meta on Why and Changelog pages
- Web UI design rules codified in CLAUDE.md (touch targets, responsiveness, anime.js conventions)

### Changed

- robots.txt in generated projects is now a server route (dynamic origin for absolute sitemap URL)
- Webmanifest colors updated to dark theme (#1b1917)
- Generator site meta description rewritten to mention specific features
- Twitter card upgraded to summary_large_image
- New-page skill updated with sitemap step

### Fixed

- Deduplicated Routing using directive in Program.cs (CS0105 warnings with admin + jobs + oauth)
- i18n cleanup keys in dashboard dev guide now reference per-feature file paths

## [0.7.0] - 2026-03-13

### Added

- 3-step wizard layout replacing infinite scroll (Name, Stack, Download)
- anime.js step transitions (slide + fade), value card stagger, tech pill entrance animations
- Sticky download button in bottom bar on step 3
- Value proposition cards on step 1: What is this, Why use this, API-first, No strings attached
- Hover tooltips on dependency graph nodes (desktop only, @media hover:hover)
- OAuth provider count on graph node label when enabled (e.g. "OAuth 4/10")
- Auto-expand feature cards and scroll to OAuth when enabling from graph
- WizardProgress component with animated step indicators
- Per-feature i18n gating: frontend files skip when frontend is disabled (netrock PR #446)
- Web UI design rules in CLAUDE.md (touch targets, responsiveness, anime.js conventions)

### Changed

- Feature cards collapsed by default under expandable toggle
- Before You Ship section dynamically adapts to selected features (no more hardcoded MailPit/MinIO)
- Email checklist item gated by email feature instead of auth
- Bottom bar shows contextual actions per step (next, review, download)
- Removed Shepherd.js guided tour (redundant with wizard flow)
- Deduplicated Routing using directive in Program.cs template

### Fixed

- Hero title "netrock" typewriter animation clipping on mobile (8ch instead of 100%)
- SSR white flash on initial load (inline dark background on html element)
- Frontend i18n files leaking into backend-only builds
- Duplicate CS0105 warnings when admin + jobs + oauth all enabled

## [0.6.0] - 2026-03-13

### Added

- Guided tour (Shepherd.js + anime.js) - 10-step interactive walkthrough of the generator
- Tour auto-starts on first visit, replayable via floating button in bottom right
- Tour highlights OAuth provider selection, Before You Ship checklist (auto-opens), and scrolls back to top on completion
- Custom dark-theme tooltip styling with accent glow and anime.js entrance transitions

### Changed

- Tour tooltips clamp to viewport width on narrow phones (no overflow on 320px screens)
- Tour button touch targets meet 44px minimum on mobile, compact 34px on desktop

## [0.5.1] - 2026-03-13

### Added

- "Click nodes to toggle" hint and "Full stack / API only" architecture indicator on the dependency graph
- Changelog link in the desktop header navigation

### Fixed

- Hero title "netrock" clipped to "ne" on mobile due to typewriter animation using percentage max-width instead of ch units
- Setup script @feature markers used wrong comment syntax (// instead of #) causing markers to leak into generated output
- MailPit and MinIO packages included in generated projects even without email or file-storage features
- Fluid.Core and MailKit version definitions gated by auth instead of email in Directory.Packages.props

## [0.5.0] - 2026-03-13

### Added

- Email (SMTP) as an independent feature - SMTP service, Liquid template rendering, and base layout can be used standalone for contact forms or notifications without requiring authentication
- 15 features with 960 valid combinations (up from 14/1,824)

### Changed

- Auth now depends on email - auth-specific templates (verify-email, reset-password, invitation) stay in auth, generic email infrastructure is independent
- Aspire orchestration is now required and always included - removed 31 conditional markers from 10 template files
- Simplified "before you ship" section and generator notes (Aspire is always available)

## [0.4.0] - 2026-03-13

### Added

- Interactive dependency graph visualization with animated edges and flowing data particles
- Click graph nodes to toggle features directly, synced with the card picker
- Animated stat counters in the review section (feature count and file count)
- anime.js v4 for entrance stagger animations, edge draw-in, and node toggle pulse effects

### Changed

- Graph nodes meet 44px touch target minimum on mobile via invisible hit areas
- Custom focus-visible styling replaces browser default focus ring on graph nodes

## [0.3.0] - 2026-03-13

### Added

- Dashboard widget components from netrock PR #445 - account status, quick actions, welcome guide, developer guide
- Feature-gated dashboard: auth enables personalized greeting and user widgets, admin adds admin quick action and grid layout, 2fa adds two-factor status row
- 48 new i18n keys (EN + CS) for dashboard content
- DeveloperGuide card always included - collapsible quick start reference for generated projects

### Changed

- Dashboard page is now templated with `@feature` markers instead of a static stub
- Without auth, dashboard shows static header and developer guide only

## [0.2.1] - 2026-03-13

### Added

- Collapsible file tree - folders expand/collapse with chevron indicators and file counts
- Changelog version navigator - sticky bar with scroll-tracked active version

### Changed

- File tree touch targets sized for mobile (34px min-height on folders)
- Changelog version badges sized for mobile (36px min-height)
- Long file/folder names truncate instead of overflowing on small screens
- Footer CTA card spacing improved (was flush against footer border)

## [0.2.0] - 2026-03-13

### Added

- Optional authentication - generate projects with or without auth, frontend adapts automatically
- "What's included" expandable details on every feature card
- Contextual notes that adapt to your selection (e.g., frontend without auth, audit without admin)
- 36-combination audit matrix covering backend build, frontend build, type-check, and test pass for every valid feature combination

### Changed

- Frontend feature gating across 64 template files - auth pages, profile, settings, admin, and layout components are cleanly excluded when auth is disabled
- Backend `JobsController` and tests properly gated behind auth when admin endpoints require permissions
- `v1.d.ts` API types now templated to match selected features
- `permissions.test.ts` assertions gated by feature so tests pass for all combinations

## [0.1.0] - 2026-03-13

### Added

- Web generator with 14 backend features and dependency graph validation
- SvelteKit frontend generation with feature-gated components
- Preset grid: Minimal, Standard, Full
- Per-provider OAuth selection (Google, GitHub, Microsoft)
- Client-side ZIP download with namespace substitution
- Shareable configuration links
- Interactive setup scripts with port selection and seed user configuration
- Claude docs and modular agent team as optional features
- Aspire orchestration support with compose publisher
- "Why netrock?" page

### Changed

- Centralized route constants with admin RBAC registry (synced from netrock PR #444)
- Frontend selection is independent of backend feature toggles
- Dashboard moved to dedicated /dashboard route with root redirect

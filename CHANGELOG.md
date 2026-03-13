# Changelog

All notable changes to the netrock generator will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/).

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

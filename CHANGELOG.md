# Changelog

All notable changes to the netrock generator will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/).

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

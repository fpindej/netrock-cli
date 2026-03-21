---
description: Bump version in both packages and update CHANGELOG.md
user-invocable: true
argument-hint: '[major|minor|patch] [description]'
---

# /bump-version

Bumps the version in both `packages/core/package.json` and `packages/web/package.json` (they must always match), and adds an entry to CHANGELOG.md.

## Steps

1. Read the current version from `packages/core/package.json`
2. Determine the bump type from the argument (default: patch). Follow the versioning table in CLAUDE.md.
3. Calculate the new version
4. Update `version` in both:
   - `packages/core/package.json`
   - `packages/web/package.json`
5. Add a new section at the top of CHANGELOG.md (after the header) with today's date
   - Use the format: `## [X.Y.Z] - YYYY-MM-DD` with Added/Changed/Fixed subsections
   - If the user provided a description, use it. Otherwise, review `git log` since the last tag/version and summarize.
   - Focus on what users experience (see CLAUDE.md "What goes in the changelog")
6. Commit: `chore: bump to {version}`

## Rules

- Both package.json versions MUST match after the bump
- Never bump for internal refactoring, snapshot updates, CI changes, or CLAUDE.md edits
- Changelog entries focus on generated project changes and web UI changes

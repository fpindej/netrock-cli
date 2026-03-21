---
description: Create a pull request for the current branch
user-invocable: true
argument-hint: '[base branch]'
---

# /create-pr

Creates a pull request for the current branch.

## Steps

1. Check `git status` - commit any uncommitted changes first
2. Verify NOT on main
3. Review all commits on this branch: `git log main..HEAD --oneline`
4. Push: `git push -u origin $(git branch --show-current)`
5. Create PR with `gh pr create`:
   - Title: Conventional Commit format, under 70 chars
   - Base: argument if provided, otherwise `main`
   - Body format:

```
## Summary
- Bullet points summarizing the changes

## Test plan
- [ ] `pnpm test` passes
- [ ] `pnpm build` passes
- [ ] [Additional checks relevant to the changes]
```

6. Report the PR URL

## Rules

- Squash-and-merge only
- No Co-Authored-By lines

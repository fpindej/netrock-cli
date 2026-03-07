# Agent Guidelines

> Hard rules and verification commands are in [`CLAUDE.md`](CLAUDE.md) - always loaded.

## Architecture

```
Backend API (.NET :8080)
    ├── PostgreSQL
# @feature jobs
    ├── Hangfire (PostgreSQL-backed)
# @end
# @feature file-storage
    ├── MinIO (S3-compatible file storage)
# @end
# @feature aspire
    ├── MailPit (local email testing via Aspire)
    └── OpenTelemetry → Aspire Dashboard (local) / OTLP endpoint (production)
# @end
```

| Layer | Technology |
|---|---|
| **Framework** | .NET 10 / C# 13 |
| **Data** | PostgreSQL + EF Core |
| **Cache** | HybridCache (in-process L1) |
# @feature auth
| **Auth** | JWT in HttpOnly cookies + permission claims |
| **Authorization** | `[RequirePermission]` + role hierarchy |
# @end
| **Validation** | FluentValidation + Data Annotations |

### Backend - Clean Architecture

```
WebApi → Application ← Infrastructure
              ↓
           Domain
All layers reference Shared (Result, ErrorType, ErrorMessages)
```

| Layer | Responsibility |
|---|---|
| **Shared** | `Result`/`Result<T>`, `ErrorType`, `ErrorMessages`, `PhoneNumberHelper`. Zero deps. |
| **Domain** | Entities (`BaseEntity`). Zero deps. |
| **Application** | Interfaces, DTOs (Input/Output), service contracts. |
| **Infrastructure** | EF Core, Identity, HybridCache, service implementations. All `internal`. |
| **WebApi** | Controllers, middleware, validation, request/response DTOs. Entry point. |
| **HealthProbe** | Minimal console app used as Docker health check binary (`/health/live`). |

## Code Quality

- Public methods read like a table of contents - delegate to well-named private methods.
- Extract duplication only when intent is identical and a change to one copy always means the same change to others.
- Design for testability: small focused methods, constructor injection, pure logic where possible.
- Don't wrap framework types just to mock them - use integration tests instead.

## Security

**Security is the highest priority.** When convenience and security conflict, choose security.

| Principle | Practice |
|---|---|
| Restrictive by default | Deny access, block origins, strip headers - open selectively |
| Defense in depth | Validate frontend AND backend. Auth in middleware AND controllers. |
| Least privilege | Minimum data and permissions in tokens, cookies, responses |
| Fail closed | If validation/token/origin check fails - reject. Never fall through. |
| Secrets never in code | Always `.env` or environment variables |

# @feature auth
When building features: think about abuse first, validate all input on backend, sanitize output, protect mutations with auth + CSRF, log security events.
# @end
# @feature audit
Audit significant actions via `IAuditService.LogAsync`.
# @end

# @feature auth
**PII compliance is non-negotiable.** Never expose emails, phone numbers, or usernames to callers without `users.view_pii` permission. PII masking happens server-side via `PiiMasker` / `WithMaskedPii` - never rely on frontend hiding. Never log PII in plain text (use structured logging with masking). Never include PII in URLs, tokens, or error messages. Self-view exemption: users always see their own unmasked data.
# @end

## Git Workflow

**Commit continuously and atomically.** Every logically complete unit of work gets its own commit immediately - don't batch up changes.

Format: `type(scope): lowercase imperative description` - max 72 chars, no period.

```
feat(auth): add refresh token rotation
fix(profile): handle null phone number in validation
test(auth): add login integration tests
```

One commit = one logical change that could be reverted independently.

**Avoid committing broken code.** Run verification before each commit. If it fails, fix and re-run - keep the main branch green.

**Split large features into stacked PRs.** If a feature touches many files or layers, break it into reviewable chunks (e.g., backend models, then API endpoints, then frontend). Each PR targets the previous PR's branch via `--base`. This keeps reviews focused and mergeable. See `/create-pr` for the mechanics.

### Labels (Issues & PRs)

| Label | When |
|---|---|
| `backend` | Changes touch `src/backend/` |
| `security` | Vulnerabilities, hardening, auth features |
| `feature` | New capabilities |
| `bug` | Fixing incorrect behavior |
| `documentation` | Docs, AGENTS.md, session notes |

## Error Handling

| Layer | Strategy |
|---|---|
| Backend services | `Result.Failure(ErrorMessages.*, ErrorType.*)` |
| Backend exceptions | `KeyNotFoundException` - 404, `PaginationException` - 400, unhandled - 500 |
| Backend middleware | `ExceptionHandlingMiddleware` - `ProblemDetails` (RFC 9457) |

Error messages flow: Backend `ErrorMessages.*` - `Result.Failure()` - `ProblemFactory.Create()` - `ProblemDetails.detail`.

## Breaking Changes

The backend API is public-facing and may serve unknown consumers. Treat every API contract change with the same care as a published library. When modifying existing code (not creating new), follow these rules.

### What Counts as a Breaking Change

| Layer | Breaking change |
|---|---|
| **Domain entity** | Renaming/removing a property, changing a type |
| **Application interface** | Changing a method signature, renaming/removing a method |
| **Application DTO** | Renaming/removing a field, changing nullability |
| **WebApi endpoint** | Changing route, method, request/response shape, status codes |
| **WebApi response DTO** | Renaming/removing a property, changing type or nullability |

### Safe Strategies

1. **Prefer additive changes** - add new fields/endpoints rather than removing or renaming
2. **Same-PR migration** - if a breaking change is needed, update all consumers in the same PR
3. **V2 endpoint** - for significant changes, create `api/v2/{feature}/{action}` alongside v1
4. **Deprecate then remove** - mark as obsolete in one PR, remove in a follow-up

### Pre-Modification Checklist

1. Check [FILEMAP.md](FILEMAP.md) for impact
2. Search for all usages: `grep -r "InterfaceName\|MethodName" src/`
3. Document the breaking change in the commit body

# @feature aspire
## Local Development

```bash
dotnet run --project src/backend/MyProject.AppHost
```

Aspire is the sole local development workflow. It starts all infrastructure as containers and launches the API. The Aspire Dashboard URL appears in the console.

Behavioral config (log levels, rate limits, JWT lifetimes, CORS, seed users) lives in `appsettings.Development.json`. Infrastructure connection strings are injected by Aspire via environment variables.
# @end

| File | Purpose |
|---|---|
| `appsettings.json` | Base/production defaults (placeholder values) |
| `appsettings.Development.json` | Dev overrides (generous JWT, debug logging, seed users, permissive rate limits) |
| `deploy/envs/production-example/` | Production template |
| `deploy/docker-compose.yml` | Base service definitions (production only) |
| `deploy/docker-compose.production.yml` | Production overlay |

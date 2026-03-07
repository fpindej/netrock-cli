# Backend Conventions (.NET 10 / C# 13)

## Project Structure

```
src/backend/
├── MyProject.Shared/              # Result, ErrorType, ErrorMessages (zero deps)
├── MyProject.Domain/Entities/     # Business entities (BaseEntity)
├── MyProject.Application/         # Interfaces, DTOs, service contracts
│   ├── Features/{Feature}/I{Feature}Service.cs
│   ├── Features/{Feature}/Dtos/{Operation}Input.cs, {Entity}Output.cs
│   ├── Identity/IUserService.cs, IUserContext.cs
│   └── Identity/Constants/AppRoles.cs, AppPermissions.cs
├── MyProject.Infrastructure/      # Implementations (all internal)
│   ├── Features/{Feature}/Services/, Configurations/, Extensions/
│   └── Persistence/MyProjectDbContext.cs
# @feature aspire
├── MyProject.ServiceDefaults/     # Aspire shared: OTEL, service discovery, resilience
├── MyProject.AppHost/             # Aspire orchestrator (local dev only)
# @end
└── MyProject.WebApi/              # Entry point
    ├── Features/{Feature}/{Feature}Controller.cs, {Feature}Mapper.cs
    ├── Features/{Feature}/Dtos/{Operation}/{Operation}Request.cs + Validator
    ├── Authorization/             # RequirePermission, PermissionPolicyProvider
    └── Shared/                    # ApiController, ProblemFactory, ValidationConstants
```

## C# Conventions

### Access Modifiers

| Item | Modifier |
|---|---|
| Domain entities, Application interfaces/DTOs | `public` |
| Infrastructure services, EF configs, mappers | `internal` |
| WebApi controllers, request/response DTOs | `public` |

### Key Rules

- **Nullability**: `string.Empty` for required, `string?` for optional. Express nullability in the type system.
- **Collections**: Prefer `IReadOnlyList<T>` on public interfaces. Avoid exposing `List<T>` or `T[]` directly.
- **Time**: `TimeProvider` registered as `TimeProvider.System` singleton.
- **NuGet**: To add a package: `<PackageVersion Include="Pkg" Version="X.Y.Z" />` in `Directory.Packages.props`, `<PackageReference Include="Pkg" />` in `.csproj`.

## Entity Definition

New entities should extend `BaseEntity` (provides `Id`, `CreatedAt/By`, `UpdatedAt/By`, `IsDeleted`, `DeletedAt/By` - all set by `AuditingInterceptor` automatically) and use `BaseEntityRepository<T>` for data access. Aggregate roots can layer on top of `BaseEntity`.

Rules:
- Private setters, enforce invariants through methods
- Protected parameterless ctor for EF Core
- Derived entity ctor sets `Id = Guid.NewGuid()` (via `protected init`)
- Boolean naming: `Is*`/`Has*` in C#, prefix-free column names via `HasColumnName`
- Soft delete via `entity.SoftDelete()` / `entity.Restore()` - never set `IsDeleted` directly

# @feature audit
## Audit Trail

`AuditEvent` is append-only, does NOT extend `BaseEntity`. No FK on `UserId` (users are hard-deleted). Fire-and-forget logging - failures never break operations.

```csharp
// Prefer AuditActions constants over raw strings for consistency and refactorability
await auditService.LogAsync(AuditActions.AdminAssignRole, userId: callerId,
    targetEntityType: "User", targetEntityId: targetId,
    metadata: JsonSerializer.Serialize(new { role = input.Role }), ct: cancellationToken);
```

Always serialize metadata with `JsonSerializer.Serialize` - never string interpolation (JSON injection risk).
# @end

## EF Core

Configurations inherit `BaseEntityConfiguration<T>` (`public abstract`), override `ConfigureEntity`. Mark derived configurations `internal`. Auto-discovered via `ApplyConfigurationsFromAssembly()`.

- Default `public` schema. Named schemas only for existing grouped features (e.g., `"auth"`).
- `.HasComment()` on all enum columns documenting values.
- Seeding: roles via `AppRoles.All` (reflection), permissions via `SeedRolePermissionsAsync()`.

Migration command:
```bash
dotnet ef migrations add {Name} \
  --project src/backend/MyProject.Infrastructure \
  --startup-project src/backend/MyProject.WebApi \
  --output-dir Persistence/Migrations
```

## Result Pattern

```csharp
// Success
return Result<Guid>.Success(entity.Id);

// Static message - prefer ErrorMessages constants for consistency and reuse
return Result.Failure(ErrorMessages.Admin.UserNotFound, ErrorType.NotFound);

// Runtime values go in server-side logs, never in client responses
logger.LogWarning("Operation failed for user '{UserId}': {Errors}", userId, errors);
return Result.Failure(ErrorMessages.Admin.DeleteFailed);
```

| ErrorType | HTTP | When |
|---|---|---|
| *(omit - default)* | 400 | Validation / business rule failures |
| `ErrorType.Unauthorized` | 401 | Auth / token failures |
| `ErrorType.Forbidden` | 403 | Authenticated but insufficient privileges |
| `ErrorType.NotFound` | 404 | Entity not found |

Controller: `ProblemFactory.Create(result.Error, result.ErrorType)` for failures.

## Service Pattern

1. **Application**: `public interface I{Feature}Service` + `record` DTOs (Input/Output)
2. **Infrastructure**: `internal class {Feature}Service(deps...) : I{Feature}Service` - primary ctor, `IOptions<T>` for config
3. **DI extension**: C# 13 `extension(IServiceCollection)` syntax, called from `Program.cs`

## DTO Naming

| Layer | Pattern | Example |
|---|---|---|
| WebApi Request | `{Operation}Request` | `LoginRequest` |
| WebApi Response | `{Entity}Response` | `UserResponse` |
| Application Input | `{Operation}Input` | `RegisterInput` |
| Application Output | `{Entity}Output` | `UserOutput` |

Mappers: `internal static class {Feature}Mapper` with extension methods (`request.ToInput()`, `output.ToResponse()`).

WebApi response DTOs: classes with `init` properties and `[UsedImplicitly]` from JetBrains.Annotations.

## Controller Conventions

- Authenticated endpoints extend `ApiController` (`[Authorize]`, route `api/v1/[controller]`)
- Public endpoints use `ControllerBase` directly (route `api/[controller]`)
- Include `/// <summary>`, `[ProducesResponseType]` per status code, and `CancellationToken` as last param for complete OpenAPI docs and graceful cancellation
- Never `/// <param name="cancellationToken">` - it leaks into OAS `requestBody.description`
- File uploads: `[FromForm]` with `IFormFile`, `[Consumes("multipart/form-data")]`, `[RequestSizeLimit(bytes)]`
- Error responses: use `ProblemFactory.Create()` to ensure consistent RFC 9457 ProblemDetails format
- Success responses: `Ok(response)`, `Created(string.Empty, response)`
- `[ProducesResponseType]` without `typeof(...)` on error codes (400, 401, 403, 404, 429) - ASP.NET auto-types as ProblemDetails

## Validation

FluentValidation auto-discovered from WebApi assembly. Co-locate validators with request DTOs.

| Rule Type | Convention |
|---|---|
| New passwords | `MinimumLength(6)` + lowercase + uppercase + digit rules |
| Existing passwords | `NotEmpty()` + `MaximumLength(255)` only |
| Optional fields | `.When(x => !string.IsNullOrEmpty(x.Field))` |
| URL fields | `Uri.TryCreate` + restrict to `http`/`https` schemes |
| Shared patterns | Extract to `ValidationConstants.cs` |

## Error Messages

- Client-facing messages are centralized as `const string` in `ErrorMessages.cs` nested classes
- Runtime values (role names, user IDs, framework errors): log server-side via `ILogger`, never in `Result.Failure()`
- Identity errors: log `.Description` server-side, return a static `ErrorMessages` constant to the client
- To add: create `const string` in `ErrorMessages.cs` nested class. Dynamic values go in logs, not in Result.

# @feature auth
## Authorization

### Permission System

Atomic permissions via `[RequirePermission("permission.name")]` on controller actions. Permissions stored as role claims, embedded in JWT as `"permission"` claims.

- `AppPermissions.cs`: constants discovered via reflection (`AppPermissions.All`)
- `PermissionAuthorizationHandler`: SuperAdmin bypass - claim match - deny
- Never class-level `[Authorize(Roles)]` on controllers using permissions
- To add a role: add `public const string` to `AppRoles.cs` - reflection discovers it, seeding picks it up automatically.

### Role Hierarchy

`SuperAdmin` (3) > `Admin` (2) > `User` (1) > Custom (0). Enforced by Admin service:
- Cannot manage users at/above your rank
- Cannot assign/remove roles at/above your rank
- Cannot modify your own roles, lock yourself, or delete yourself

Permission changes on a role - invalidate refresh tokens + rotate security stamps + clear cache for all affected users.
# @end

## Repository Pattern

`IBaseEntityRepository<T>` provides CRUD with automatic soft-delete filtering (global query filter). Open generic registration covers basic entities.

Custom repositories: extend `IBaseEntityRepository<T>` in Application, implement in Infrastructure with `BaseEntityRepository<T>`. Avoid exposing `IQueryable` across layer boundaries.

Pagination: `Paginate(int pageNumber, int pageSize)` extension on `IQueryable<T>` returns `IQueryable<T>` (applies `Skip`/`Take`).

## Caching

`HybridCache` (.NET built-in) provides L1 in-process caching with stampede protection. Keys defined in `CacheKeys` constants. `UserCacheInvalidationInterceptor` auto-clears user cache on entity changes. `NoOpHybridCache` is registered when caching is disabled.

# @feature file-storage
## File Storage

`IFileStorageService` - generic S3-compatible interface (`Upload`, `Download`, `Delete`, `Exists`). Implementation: `S3FileStorageService` (works with MinIO locally, any S3-compatible provider in production).

**Configuration:** `FileStorageOptions` in `appsettings.json` / env vars. `ForcePathStyle = true` for MinIO compatibility.

**Uploading files from a controller:**
1. Accept `IFormFile` via `[FromForm]` + `[Consumes("multipart/form-data")]` + `[RequestSizeLimit]`
2. Read to `byte[]` in the controller
3. Pass to the service for validation/processing
4. Store via `fileStorageService.UploadAsync(key, data, contentType, ct)`

**Storage keys:** Use `{feature}/{id}.{ext}` pattern (e.g., `avatars/{userId}.webp`).
# @end

# @feature auth
## Email Templates

Transactional emails use [Fluid](https://github.com/sebastienros/fluid) (Liquid) templates rendered by `IEmailTemplateRenderer`. Templates are embedded resources compiled once and cached.

**3-file pattern** per email in `Infrastructure/Features/Email/Templates/`:
- `{name}.liquid` - HTML body fragment (injected into `_base.liquid`)
- `{name}.subject.liquid` - Subject line (plain text)
- `{name}.text.liquid` - Plain text alternative (optional but recommended)

**Model records** in `Application/Features/Email/Models/EmailTemplateModels.cs` - properties auto-map to snake_case Liquid variables.
# @end

## OpenAPI

- `/// <summary>` on every controller action and DTO property
- `[ProducesResponseType]` declares all possible status codes per action
- `EnumSchemaTransformer` auto-documents enum values
- Scalar UI at `/scalar/v1` (development only)

## Options Pattern

```csharp
public sealed class {Name}Options
{
    public const string SectionName = "{Section}";

    /// <summary>Gets or sets the ...</summary>
    [Required]
    public string Value { get; init; } = string.Empty;
}
```

Register with `BindConfiguration`, `ValidateDataAnnotations`, `ValidateOnStart`.

## Testing

| Project | Tests | Dependencies |
|---|---|---|
| `Unit.Tests` | Pure logic (Shared, Domain, Application) | None - no mocks, no DI |
| `Component.Tests` | Service business logic | `TestDbContextFactory` (InMemory), `NSubstitute`, `IdentityMockHelpers` |
| `Api.Tests` | Full HTTP pipeline (routes, auth, status codes) | `CustomWebApplicationFactory`, `TestAuthHandler` |
| `Architecture.Tests` | Layer deps, naming, visibility | NetArchTest |

## Hosting

`HostingOptions` controls `ForceHttps` (default true - required behind TLS proxy) and `ReverseProxy` trust (trusted networks/proxies for `X-Forwarded-For`).

# @feature aspire
## Aspire (Local Development Orchestration)

**Two projects** support .NET Aspire for local development:

### ServiceDefaults (`MyProject.ServiceDefaults`)

Shared Aspire project providing OpenTelemetry (logging, metrics, tracing, OTLP export), service discovery, and HTTP resilience. Called via `builder.AddServiceDefaults()` in `Program.cs`. Degrades gracefully when not running under Aspire.

### AppHost (`MyProject.AppHost`)

Aspire orchestrator for local development. Launches all infrastructure as containers.

**Run**: `dotnet run --project src/backend/MyProject.AppHost`

### Logging: Serilog - OpenTelemetry

Serilog bridges to OpenTelemetry via the ServiceDefaults `AddOpenTelemetry()` logger provider. With `writeToProviders: true`, Serilog forwards logs to all registered `ILoggerProvider` instances including the OTEL one - no separate Serilog OTEL sink needed.
# @end

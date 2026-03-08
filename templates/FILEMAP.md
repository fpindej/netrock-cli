# File Map - Change Impact Reference

Quick-reference for "when you change X, also update Y" and "where does X live?"

> **Rule:** Before modifying any existing file listed here, trace its impact row. If a change affects downstream files, update them in the same commit (or same PR at minimum).

---

## Top 5 Most Common Changes

| Change | Must also update |
|---|---|
| **Add/change domain entity property** | EF config - migration - Application DTOs - WebApi DTOs - mapper |
| **Add backend endpoint** | Controller + DTOs + validator + mapper |
| **Change WebApi response DTO** | Mapper, `Api.Tests/Contracts/ResponseContracts.cs` |
# @feature auth
| **Add permission** | `AppPermissions.cs` - `[RequirePermission]` - seed in `ApplicationBuilderExtensions` |
# @end
| **Add NuGet package** | `Directory.Packages.props` (version) + `.csproj` (reference) |

---

## Change Impact Tables

### Backend Changes

| When you change... | Also update... |
|---|---|
| **Domain entity** (add/rename property) | EF configuration, migration, Application DTOs, WebApi DTOs, mapper |
| **Domain entity** (add enum property) | EF config (`.HasComment()`), `EnumSchemaTransformer` handles the rest automatically |
| **`ErrorMessages.cs`** (Shared - add/rename constant) | Service that uses it |
| **`Result.cs`** (Shared - change pattern) | Every service + every controller that matches on `Result` |
| **Application interface** (change signature) | Infrastructure service implementation, controller calling the service |
| **Application DTO** (add/rename/remove field) | Infrastructure service, WebApi mapper, WebApi request/response DTO |
| **Infrastructure EF config** (change mapping) | Run new migration |
| **`MyProjectDbContext`** (add DbSet) | Run new migration |
| **Infrastructure service** (change behavior) | Verify controller still maps correctly, verify error messages still apply |
| **Infrastructure Options class** | `appsettings.json`, `appsettings.Development.json`, `deploy/envs/production-example/api.env`, DI registration |
| **DI extension** (new service registration) | `Program.cs` must call the extension |
| **WebApi controller** (change route/method) | API consumers |
| **WebApi request DTO** (add/rename/remove property) | Validator, mapper |
| **WebApi response DTO** (add/rename/remove property) | Mapper, `Api.Tests/Contracts/ResponseContracts.cs` |
| **WebApi validator** (change rules) | Consider matching client validation UX |
| **`Program.cs`** (change middleware order) | Test full request pipeline - order matters for auth, CORS, rate limiting; update `CustomWebApplicationFactory` if new services need mocking |
| **`Directory.Packages.props`** (change version) | `dotnet build` to verify compatibility |
| **`Directory.Build.props`** (change TFM/settings) | All projects in solution |
| **`BaseEntity.cs`** | `BaseEntityConfiguration`, `AuditingInterceptor`, all entities |
| **`BaseEntityConfiguration.cs`** | All entity configurations that extend it |
| **`CustomWebApplicationFactory.cs`** (change mock setup) | All API integration tests that depend on factory mocks |
| **`appsettings.Testing.json`** (change test config) | `CustomWebApplicationFactory` behavior; all API integration tests |
# @feature file-storage
| **`FileStorageOptions`** (change S3/MinIO config) | `appsettings.json`, `deploy/envs/production-example/compose.env`, `deploy/docker-compose.yml`, `appsettings.Testing.json` |
# @end
# @feature auth
| **`EmailOptions`** (change config shape) | `appsettings.json`, `appsettings.Development.json`, `appsettings.Testing.json`, `deploy/envs/production-example/api.env`, `ServiceCollectionExtensions` (email DI), `EmailOptionsValidationTests` |
| **`IEmailService`** (change sending contract) | `NoOpEmailService`, `SmtpEmailService`, `CustomWebApplicationFactory` |
| **`IEmailTemplateRenderer`** (change rendering contract) | `FluidEmailTemplateRenderer`, `TemplatedEmailSender`, `FluidEmailTemplateRendererTests` |
| **`ITemplatedEmailSender`** (change send-safe contract) | `TemplatedEmailSender`, all services calling `SendSafeAsync()`, `TemplatedEmailSenderTests` |
| **`EmailTemplateModels.cs`** (add/rename model record) | Matching `.liquid` templates, `FluidEmailTemplateRenderer.CreateOptions()`, services that construct the model, `FluidEmailTemplateRendererTests` |
| **`.liquid` email template** (change variable/layout) | Matching model record in `EmailTemplateModels.cs`, `_base.liquid` if layout change, `FluidEmailTemplateRendererTests` |
| **`_base.liquid`** (shared email layout) | All rendered HTML emails, `FluidEmailTemplateRendererTests` layout assertions |
| **`FluidEmailTemplateRenderer`** (change rendering/caching logic) | `FluidEmailTemplateRendererTests`, `TemplatedEmailSender` |
| **`TemplatedEmailSender`** (change render+send wrapping) | `TemplatedEmailSenderTests`, services calling it |
# @end
# @feature file-storage
| **`IFileStorageService`** (change upload/download contract) | `S3FileStorageService`, any service using file storage |
# @end
# @feature avatars
| **`IImageProcessingService`** (change avatar processing) | `ImageProcessingService`, `UserService.UploadAvatarAsync` |
| **`ApplicationUser.HasAvatar`** (change avatar flag) | `UserOutput`, `AdminUserOutput`, `UserResponse`, `AdminUserResponse`, `UserMapper`, `AdminMapper` |
| **Avatar endpoints** (`PUT/DELETE/GET`) | `UploadAvatarRequest`, `UploadAvatarRequestValidator`, `UserMapper` |
# @end
# @feature audit
| **`AuditActions.cs`** (add action constant) | Service that logs it |
| **`AuditEvent` entity** (change fields) | `AuditEventConfiguration`, `AuditService`, Application DTOs (`AuditEventOutput`), WebApi DTOs, `AuditMapper` |
# @end
| **`HybridCache`** (change caching usage) | `NoOpHybridCache`, `UserCacheInvalidationInterceptor`, all services using `HybridCache`, `CustomWebApplicationFactory` mock |
| **`CacheKeys.cs`** (Application - rename/remove key) | All services referencing the changed key, `UserCacheInvalidationInterceptor` |
| **`CachingOptions`** (Infrastructure - change config shape) | `appsettings.json`, `appsettings.Development.json`, `deploy/envs/production-example/api.env` |
# @feature auth
| **`ICookieService`** (Application - change cookie contract) | `CookieService`, `AuthenticationService`, `UserService` |
| **`CookieNames`** (Application - rename/remove cookie name) | `AuthController`, `AuthenticationService`, `UserService` |
| **`IUserService`** (Application/Identity - change user service contract) | `UserService`, `UsersController`, `CustomWebApplicationFactory` mock |
| **`IUserContext`** (Application/Identity - change context contract) | `UserContext`, `AuthenticationService`, `UserService`, `AuditingInterceptor`, `UsersController`, `AdminController` |
| **`EmailTemplateNames.cs`** (Application - add/rename template name) | Services constructing `SendSafeAsync()` calls, matching `.liquid` template files |
# @end
| **Test fixture** (change shared helper) | All tests using that fixture |
# @feature auth
| **`AppRoles.cs`** (add role) | Role seeding picks up automatically; consider what permissions to seed for the new role |
| **`AppPermissions.cs`** (add permission) | Seed in `ApplicationBuilderExtensions.SeedRolePermissionsAsync()`, add `[RequirePermission]` to endpoints |
| **`PiiMasker.cs`** (change masking rules) | `AdminMapper.WithMaskedPii` extensions, `PiiMaskerTests`, `AdminMapperPiiTests` |
| **`RequirePermission` attribute** (add to endpoint) | Remove any class-level `[Authorize(Roles)]`; ensure permission is defined in `AppPermissions.cs` |
| **`RoleManagementService`** (change role behavior) | Verify system role protection rules, check security stamp rotation |
# @end
# @feature jobs
| **`IRecurringJobDefinition`** (add new job) | Register in `ServiceCollectionExtensions.AddJobScheduling()`, job auto-discovered at startup |
| **Job scheduling config** (`ServiceCollectionExtensions.AddJobScheduling`) | `Program.cs` must call `AddJobScheduling()` and `UseJobScheduling()` |
# @end
| **`RateLimitPolicies.cs`** (add/rename constant) | `RateLimiterExtensions.cs` policy registration, `RateLimitingOptions.cs` config class, `appsettings.json` section, `[EnableRateLimiting]` attribute on controllers |
| **`RateLimitingOptions.cs`** (add/rename option class) | `RateLimiterExtensions.cs`, `appsettings.json`, `appsettings.Development.json` |
| **`RateLimiterExtensions.cs`** (add policy) | Requires matching constant in `RateLimitPolicies.cs` and config in `RateLimitingOptions.cs` |
| **`HostingOptions.cs`** (change hosting config shape) | `HostingExtensions.cs`, `appsettings.json`, `appsettings.Development.json`, `deploy/docker-compose.yml` |
| **`HostingExtensions.cs`** (change middleware behavior) | `Program.cs` |
| **`Dockerfile`** (backend - change build/publish steps) | `.dockerignore`, verify published files don't include dev/test config |
| **`MyProject.WebApi.csproj`** (add appsettings file) | If non-production: add `CopyToPublishDirectory="Never"` and matching `rm -f` in `Dockerfile` |
| **Route constraint** (add/modify in `Routing/`) | `Program.cs` constraint registration, route templates using that constraint |
| **`HealthCheckExtensions.cs`** (change endpoints/checks) | `deploy/docker-compose.yml` healthcheck URLs |
# @feature aspire
| **New infrastructure dependency** (DB, cache, storage, etc.) | `MyProject.AppHost/Program.cs` (add resource + `.WithReference()`/`.WithEnvironment()`), `deploy/docker-compose.yml` (add service), `deploy/envs/` (add env vars) |
| **Connection string config** (change format/name) | Verify `MyProject.AppHost/Program.cs` environment variable mapping still works, `deploy/envs/` env files |
| **`MyProject.ServiceDefaults/Extensions.cs`** | All projects referencing ServiceDefaults, `Program.cs` `AddServiceDefaults()` call |
| **`MyProject.AppHost/Program.cs`** | Verify resource names match `ConnectionStrings:*` and `WithEnvironment` keys match `appsettings.json` option paths |
# @end
| **`ProblemDetailsAuthorizationHandler`** | `ProblemDetails` shape, `ErrorMessages.Auth` constants, `Program.cs` registration |
| **OpenAPI transformers** | Regenerate types to verify; check Scalar UI |
# @feature captcha
| **`CaptchaOptions`** (Infrastructure - Captcha config) | `appsettings.json`, `appsettings.Development.json`, `appsettings.Testing.json`, `TurnstileCaptchaService`, `ServiceCollectionExtensions` |
| **`TurnstileCaptchaService`** (Infrastructure - Captcha service) | `ICaptchaService` interface, `CaptchaOptions`, `AuthController` captcha gate |
# @end

---

## Key Files Quick Reference

Files that are frequently referenced in impact tables above. For anything not listed here, use Glob/Grep - the codebase follows predictable naming patterns documented in the convention skills.

### Backend Naming Patterns

```
src/backend/MyProject.{Layer}/
  Shared:          Result.cs, ErrorType.cs, ErrorMessages.cs, PhoneNumberHelper.cs
  Domain:          Entities/{Entity}.cs
  Application:     Features/{Feature}/I{Feature}Service.cs
                   Features/{Feature}/Dtos/{Operation}Input.cs, {Entity}Output.cs
                   Features/{Feature}/Persistence/I{Feature}Repository.cs
# @feature auth
                   Features/Email/EmailTemplateNames.cs
                   Identity/IUserService.cs, IUserContext.cs
                   Identity/Constants/AppRoles.cs, AppPermissions.cs
# @end
                   Caching/Constants/CacheKeys.cs
# @feature auth
                   Cookies/ICookieService.cs, Constants/CookieNames.cs
# @end
                   Persistence/IBaseEntityRepository.cs
  Infrastructure:  Features/{Feature}/Services/{Feature}Service.cs
                   Features/{Feature}/Configurations/{Entity}Configuration.cs
                   Features/{Feature}/Extensions/ServiceCollectionExtensions.cs
                   Persistence/MyProjectDbContext.cs
  WebApi:          Features/{Feature}/{Feature}Controller.cs
                   Features/{Feature}/{Feature}Mapper.cs
                   Features/{Feature}/Dtos/{Operation}/{Operation}Request.cs
                   Features/{Feature}/Dtos/{Operation}/{Operation}RequestValidator.cs
# @feature auth
                   Authorization/RequirePermissionAttribute.cs (+ handler, provider, requirement)
                   Authorization/ProblemDetailsAuthorizationHandler.cs
# @end
                   Routing/{Name}RouteConstraint.cs
                   Shared/RateLimitPolicies.cs
                   Program.cs
```

# @feature auth
### Email Template Patterns

```
src/backend/MyProject.Application/Features/Email/
  IEmailTemplateRenderer.cs                         Rendering interface (Render<TModel>)
  ITemplatedEmailSender.cs                          Safe render+send interface (SendSafeAsync)
  Models/EmailTemplateModels.cs                     Model records (one per template)
  EmailTemplateNames.cs                             Template name constants (kebab-case)
  IEmailService.cs                                  Sending interface
  EmailMessage.cs                                   Message envelope DTO
src/backend/MyProject.Infrastructure/Features/Email/
  Services/FluidEmailTemplateRenderer.cs            Fluid-based renderer (singleton, cached)
  Services/TemplatedEmailSender.cs                  Render+send wrapper (swallows failures)
  Services/SmtpEmailService.cs                      MailKit SMTP sender (when Enabled)
  Services/NoOpEmailService.cs                      Dev/test no-op sender (when disabled)
  Templates/_base.liquid                            Shared HTML email layout (header, card, footer)
  Templates/{name}.liquid                           HTML body fragment
  Templates/{name}.text.liquid                      Plain text variant (optional)
  Templates/{name}.subject.liquid                   Subject line
  Options/EmailOptions.cs                           FromName, FrontendBaseUrl config
  Extensions/ServiceCollectionExtensions.cs         DI registration (AddEmailServices)
```
# @end

# @feature jobs
### Job Scheduling Patterns

```
src/backend/MyProject.Infrastructure/Features/Jobs/
  IRecurringJobDefinition.cs                          Interface for recurring jobs
  RecurringJobs/{JobName}Job.cs                       Recurring job implementations
  Models/PausedJob.cs                                 Persisted pause state entity
  Configurations/PausedJobConfiguration.cs            EF config - hangfire.pausedjobs
  Services/JobManagementService.cs                    Admin API service (DB-backed pause)
  Options/JobSchedulingOptions.cs                     Configuration (Enabled, WorkerCount)
  Extensions/ServiceCollectionExtensions.cs           DI registration
  Extensions/ApplicationBuilderExtensions.cs          Middleware + job registration + pause restore
src/backend/MyProject.Application/Features/Jobs/
  IJobManagementService.cs                            Admin API interface
  Dtos/RecurringJobOutput.cs, ...                     Job DTOs
src/backend/MyProject.WebApi/Features/Admin/
  JobsController.cs                                   Admin job endpoints
  JobsMapper.cs                                       DTO mapping
  Dtos/Jobs/                                          Response DTOs
```
# @end

### Test Naming Patterns

```
src/backend/tests/
  MyProject.Unit.Tests/
    {Layer}/{ClassUnderTest}Tests.cs             Unit tests (pure logic)
  MyProject.Component.Tests/
    Fixtures/TestDbContextFactory.cs             InMemory DbContext factory
    Fixtures/IdentityMockHelpers.cs              UserManager/RoleManager mock setup
    Services/{Service}Tests.cs                   Service tests (mocked deps)
  MyProject.Api.Tests/
    Fixtures/CustomWebApplicationFactory.cs      WebApplicationFactory config
    Fixtures/TestAuthHandler.cs                  Fake auth handler
    Contracts/ResponseContracts.cs               Frozen response shapes for contract testing
    Controllers/{Controller}Tests.cs             HTTP integration tests
    Validators/{Validator}Tests.cs               FluentValidation tests
  MyProject.Architecture.Tests/
    DependencyTests.cs                           Layer dependency rules
    NamingConventionTests.cs                     Class naming enforcement
    AccessModifierTests.cs                       Visibility rules
```

### Singleton Files (no pattern - memorize these)

| File | Why it matters |
|---|---|
| `src/backend/MyProject.WebApi/Program.cs` | DI wiring, middleware pipeline |
| `src/backend/MyProject.Infrastructure/Persistence/MyProjectDbContext.cs` | DbSets, migrations |
| `src/backend/MyProject.Shared/ErrorMessages.cs` | All static error strings |
# @feature auth
| `src/backend/MyProject.Application/Identity/Constants/AppRoles.cs` | Role definitions |
| `src/backend/MyProject.Application/Identity/Constants/AppPermissions.cs` | Permission definitions (reflection-discovered) |
# @end
| `src/backend/MyProject.Application/Caching/Constants/CacheKeys.cs` | Cache key constants (used across services) |
# @feature auth
| `src/backend/MyProject.Application/Features/Email/EmailTemplateNames.cs` | Email template name constants |
# @end
| `src/backend/MyProject.WebApi/Shared/RateLimitPolicies.cs` | Rate limit policy name constants |
| `src/backend/Directory.Packages.props` | NuGet versions (never in .csproj) |
| `deploy/envs/production-example/` | Production env template - `cp -r` to `deploy/envs/production/` |
| `deploy/docker-compose.yml` | Base service definitions (production only) |
| `deploy/docker-compose.production.yml` | Production overlay |
# @feature aspire
| `src/backend/MyProject.ServiceDefaults/Extensions.cs` | Aspire shared: OTEL, service discovery, HTTP resilience defaults |
| `src/backend/MyProject.AppHost/Program.cs` | Aspire orchestrator: local dev infrastructure |
# @end
| `src/backend/MyProject.WebApi/appsettings.Testing.json` | Test environment config |
| `src/backend/tests/MyProject.Api.Tests/Fixtures/CustomWebApplicationFactory.cs` | Test host configuration for API tests |

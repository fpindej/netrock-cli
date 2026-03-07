# MyProject

Generated with [netrock](https://netrock.dev) - a .NET API project generator.

## Prerequisites

- [.NET 10 SDK](https://dotnet.microsoft.com/download/dotnet/10.0)
// @feature aspire
- [Docker](https://docs.docker.com/get-docker/) (required for Aspire orchestration)
// @end
// @feature !aspire
- [PostgreSQL](https://www.postgresql.org/) (running instance required)
// @end

## Quick start

// @feature aspire
The easiest way to run this project is with .NET Aspire, which starts PostgreSQL, MinIO, Mailpit, and the API for you:

```bash
dotnet run --project src/backend/MyProject.AppHost
```

The Aspire dashboard opens automatically. From there you can access the API, pgAdmin, Mailpit, and MinIO console.

// @end
// @feature !aspire
```bash
# Make sure PostgreSQL is running, then update the connection string in
# src/backend/MyProject.WebApi/appsettings.Development.json

dotnet build src/backend/MyProject.slnx
dotnet run --project src/backend/MyProject.WebApi
```

// @end
Alternatively, run the setup script which checks prerequisites and starts the project:

```bash
# macOS / Linux
chmod +x setup.sh && ./setup.sh

# Windows (PowerShell)
.\setup.ps1
```

## Run tests

```bash
dotnet test src/backend/MyProject.slnx
```

## What's included

// @feature auth
- **Authentication** - JWT + refresh tokens, registration, login, email verification, password reset
// @end
// @feature 2fa
- **Two-factor auth** - TOTP-based 2FA with recovery codes
// @end
// @feature oauth
- **OAuth** - External login with Google, GitHub, Microsoft, and more
// @end
// @feature captcha
- **Captcha** - Cloudflare Turnstile on registration and password reset
// @end
// @feature jobs
- **Background jobs** - Hangfire scheduling with PostgreSQL storage
// @end
// @feature file-storage
- **File storage** - S3/MinIO abstraction
// @end
// @feature avatars
- **Avatars** - User avatar uploads with image processing
// @end
// @feature audit
- **Audit trail** - Security event logging
// @end
// @feature admin
- **Admin panel** - User and role management
// @end
// @feature aspire
- **Aspire** - .NET Aspire for local dev orchestration with OpenTelemetry
// @end

## Project structure

```
src/backend/
  MyProject.Domain/           Domain entities
  MyProject.Shared/           Cross-cutting: Result, errors, helpers
  MyProject.Application/      Use cases, interfaces, DTOs
  MyProject.Infrastructure/   EF Core, services, external integrations
  MyProject.WebApi/           Controllers, middleware, configuration
  MyProject.ServiceDefaults/  OpenTelemetry, health checks, resilience
// @feature aspire
  MyProject.AppHost/          Aspire orchestration (local dev)
// @end
  tests/                      Architecture, unit, and integration tests
```

## Configuration

Key settings are in `src/backend/MyProject.WebApi/appsettings.json`. Development overrides are in `appsettings.Development.json`.

// @feature auth
### Seed users

Configure initial users via environment variables or `appsettings.json`:

```json
{
  "Seed": {
    "Users": [
      { "Email": "admin@example.com", "Password": "YourPassword123!", "Role": "SuperAdmin" }
    ]
  }
}
```

// @end
## Adding migrations

The project ships without EF Core migrations. On first run in development, the database schema is created automatically. When you're ready to manage schema changes:

```bash
cd src/backend
dotnet ef migrations add Initial --project MyProject.Infrastructure --startup-project MyProject.WebApi
```

## Learn more

- [netrock](https://github.com/fpindej/netrock) - The original template this was generated from
- [netrock-cli](https://github.com/fpindej/netrock-cli) - The generator source code
- [Discord](https://discord.gg/5rHquRptSh) - Community and support

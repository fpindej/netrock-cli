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

Run the setup script to configure ports, initialize git, and verify your environment:

```bash
# macOS / Linux
chmod +x setup.sh && ./setup.sh

# Windows (PowerShell)
.\setup.ps1
```

The setup script will:
// @feature aspire
- Check prerequisites (.NET SDK, Docker)
- Let you choose a base port for the service stack
// @end
// @feature !aspire
- Check prerequisites (.NET SDK, PostgreSQL)
// @end
- Optionally initialize a git repository with an initial commit
- Build the solution and run tests

// @feature aspire
### Manual start

If you prefer to skip the setup script:

```bash
dotnet run --project src/backend/MyProject.AppHost
```

The Aspire dashboard opens automatically. From there you can access the API, pgAdmin, Mailpit, and MinIO console.

// @end
// @feature !aspire
### Manual start

```bash
# Make sure PostgreSQL is running, then update the connection string in
# src/backend/MyProject.WebApi/appsettings.Development.json

dotnet build src/backend/MyProject.slnx
dotnet run --project src/backend/MyProject.WebApi
```

// @end
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

// @feature aspire
### Port allocation

Ports are configured in `src/backend/MyProject.AppHost/appsettings.json`. The setup script can change these for you. All infrastructure ports (pgAdmin, PostgreSQL, MinIO, Mailpit) are derived from the base port automatically.

// @end
// @feature auth
### Seed users

Development seed users are configured in `appsettings.Development.json`:

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

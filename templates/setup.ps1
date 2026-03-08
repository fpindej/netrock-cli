$ErrorActionPreference = "Stop"

# ─────────────────────────────────────────────────────────────────────────────
# Helpers
# ─────────────────────────────────────────────────────────────────────────────
function Write-Step($msg) { Write-Host "`n> $msg" -ForegroundColor Cyan }
function Write-Ok($msg) { Write-Host " v " -ForegroundColor Green -NoNewline; Write-Host $msg }
function Write-Warn($msg) { Write-Host " ! " -ForegroundColor Yellow -NoNewline; Write-Host $msg }
function Write-Fail($msg) { Write-Host " x " -ForegroundColor Red -NoNewline; Write-Host $msg }
function Write-Sub($msg) { Write-Host "  -> " -ForegroundColor DarkGray -NoNewline; Write-Host $msg }
function Write-Header($msg) {
    Write-Host ""
    Write-Host "============================================================" -ForegroundColor Cyan
    Write-Host "  $msg" -ForegroundColor Cyan
    Write-Host "============================================================" -ForegroundColor Cyan
}

function Show-Checklist {
    param(
        [string[]]$Options,
        [bool[]]$Defaults
    )

    $selected = [bool[]]::new($Options.Length)
    for ($i = 0; $i -lt $Options.Length; $i++) {
        $selected[$i] = $Defaults[$i]
    }

    $firstDraw = $true

    while ($true) {
        if (-not $firstDraw) {
            $linesUp = $Options.Length + 3
            for ($j = 0; $j -lt $linesUp; $j++) {
                [Console]::SetCursorPosition(0, [Console]::CursorTop - 1)
                Write-Host (" " * [Console]::WindowWidth) -NoNewline
                [Console]::SetCursorPosition(0, [Console]::CursorTop)
            }
        }
        $firstDraw = $false

        Write-Host ""
        Write-Host "  Press 1-$($Options.Length) to toggle, Enter to confirm:" -ForegroundColor White
        Write-Host ""

        for ($i = 0; $i -lt $Options.Length; $i++) {
            $num = $i + 1
            if ($selected[$i]) {
                Write-Host "  " -NoNewline
                Write-Host "[$num] v" -ForegroundColor Green -NoNewline
                Write-Host " $($Options[$i])"
            } else {
                Write-Host "  " -NoNewline
                Write-Host "[$num] o" -ForegroundColor DarkGray -NoNewline
                Write-Host " $($Options[$i])" -ForegroundColor DarkGray
            }
        }

        $key = [Console]::ReadKey($true)

        if ($key.Key -eq "Enter") {
            Write-Host ""
            return $selected
        }

        $num = 0
        if ([int]::TryParse($key.KeyChar.ToString(), [ref]$num) -and $num -ge 1 -and $num -le $Options.Length) {
            $selected[$num - 1] = -not $selected[$num - 1]
        }
    }
}

# ─────────────────────────────────────────────────────────────────────────────
# Header
# ─────────────────────────────────────────────────────────────────────────────
$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $scriptDir

$startTime = Get-Date

Write-Header "MyProject - Project Setup"

# ─────────────────────────────────────────────────────────────────────────────
# Prerequisites
# ─────────────────────────────────────────────────────────────────────────────
Write-Step "Checking prerequisites..."

$errors = 0

try {
    $version = dotnet --version 2>$null
    Write-Ok ".NET SDK $version"
} catch {
    Write-Fail ".NET SDK not found - install from https://dotnet.microsoft.com/download/dotnet/10.0"
    $errors++
}

// @feature aspire
try {
    $null = docker --version 2>$null
    $null = docker info 2>$null
    if ($LASTEXITCODE -eq 0) {
        Write-Ok "Docker (running)"
    } else {
        Write-Fail "Docker installed but not running - start Docker Desktop"
        $errors++
    }
} catch {
    Write-Fail "Docker not found - install from https://docs.docker.com/get-docker/"
    $errors++
}
// @end

// @feature !aspire
try {
    $null = psql --version 2>$null
    Write-Ok "PostgreSQL client (psql)"
} catch {
    Write-Warn "PostgreSQL client (psql) not found - make sure PostgreSQL is running and accessible"
}
// @end

if ($errors -gt 0) {
    Write-Host ""
    Write-Host "$errors issue(s) found. Fix them and re-run this script." -ForegroundColor Red
    exit 1
}

Write-Ok "All prerequisites met"

// @feature aspire
# ─────────────────────────────────────────────────────────────────────────────
# Port Configuration
# ─────────────────────────────────────────────────────────────────────────────
Write-Step "Port configuration"

Write-Host ""
Write-Host "  Default port allocation" -ForegroundColor White
Write-Host "  ────────────────────────────────────"
Write-Host "  Frontend:       " -NoNewline; Write-Host "5173" -ForegroundColor Cyan
Write-Host "  API:            " -NoNewline; Write-Host "8080" -ForegroundColor Cyan
Write-Host "  pgAdmin:        5176   Postgres: 5177" -ForegroundColor DarkGray
# // @feature file-storage
Write-Host "  MinIO:          5178   Console:  5179" -ForegroundColor DarkGray
# // @end
# // @feature auth
Write-Host "  MailPit SMTP:   5180   HTTP:     5181" -ForegroundColor DarkGray
# // @end
Write-Host "  Infrastructure ports are derived from the base port." -ForegroundColor DarkGray
Write-Host ""

$portInput = Read-Host "  Base port [5173]"
if ([string]::IsNullOrWhiteSpace($portInput)) { $portInput = "5173" }

$basePort = 5173
if ([int]::TryParse($portInput, [ref]$basePort) -and $basePort -ge 1024 -and $basePort -le 65527) {
    # valid
} else {
    Write-Host "  Invalid port (must be 1024-65527). Using default 5173." -ForegroundColor Yellow
    $basePort = 5173
}

$frontendPort = $basePort
$apiPort = $basePort + 2

Write-Host ""
Write-Host "  Port allocation" -ForegroundColor White
Write-Host "  ────────────────────────────────────"
Write-Host "  Frontend:       " -NoNewline; Write-Host "$frontendPort" -ForegroundColor Cyan
Write-Host "  API:            " -NoNewline; Write-Host "$apiPort" -ForegroundColor Cyan
Write-Host "  pgAdmin:        $($basePort + 3)   Postgres: $($basePort + 4)" -ForegroundColor DarkGray
# // @feature file-storage
Write-Host "  MinIO:          $($basePort + 5)   Console:  $($basePort + 6)" -ForegroundColor DarkGray
# // @end
# // @feature auth
Write-Host "  MailPit SMTP:   $($basePort + 7)   HTTP:     $($basePort + 8)" -ForegroundColor DarkGray
# // @end
// @end

# ─────────────────────────────────────────────────────────────────────────────
# Options Checklist
# ─────────────────────────────────────────────────────────────────────────────
// @feature aspire
$results = Show-Checklist `
    -Options @("Create initial database migration", "Initialize git repository and commit", "Build and run tests", "Launch Aspire after setup") `
    -Defaults @($true, $true, $true, $true)
$doMigration = $results[0]
$doGit = $results[1]
$doBuild = $results[2]
$doAspire = $results[3]
// @end

// @feature !aspire
$results = Show-Checklist `
    -Options @("Create initial database migration", "Initialize git repository and commit", "Build and run tests") `
    -Defaults @($true, $true, $true)
$doMigration = $results[0]
$doGit = $results[1]
$doBuild = $results[2]
$doAspire = $false
// @end

# ─────────────────────────────────────────────────────────────────────────────
# Summary
# ─────────────────────────────────────────────────────────────────────────────
Write-Header "Summary"

// @feature aspire
Write-Host ""
Write-Host "  Ports" -ForegroundColor White
Write-Host "  ────────────────────────────────────"
Write-Host "  Frontend:         " -NoNewline; Write-Host "$frontendPort" -ForegroundColor Cyan
Write-Host "  API:              " -NoNewline; Write-Host "$apiPort" -ForegroundColor Cyan
Write-Host ""
// @end
Write-Host "  Options" -ForegroundColor White
Write-Host "  ────────────────────────────────────"
Write-Host "  Create migration: " -NoNewline
if ($doMigration) { Write-Host "Yes" -ForegroundColor Green } else { Write-Host "No" -ForegroundColor DarkGray }
Write-Host "  Git init/commit:  " -NoNewline
if ($doGit) { Write-Host "Yes" -ForegroundColor Green } else { Write-Host "No" -ForegroundColor DarkGray }
Write-Host "  Build and test:   " -NoNewline
if ($doBuild) { Write-Host "Yes" -ForegroundColor Green } else { Write-Host "No" -ForegroundColor DarkGray }
// @feature aspire
Write-Host "  Launch Aspire:    " -NoNewline
if ($doAspire) { Write-Host "Yes" -ForegroundColor Green } else { Write-Host "No" -ForegroundColor DarkGray }
// @end
Write-Host ""

$proceed = Read-Host "  Proceed? [Y/n]"
if (-not [string]::IsNullOrWhiteSpace($proceed) -and $proceed.ToLower() -ne "y") {
    Write-Warn "Aborted by user"
    exit 0
}

# ─────────────────────────────────────────────────────────────────────────────
# Execution
# ─────────────────────────────────────────────────────────────────────────────
Write-Header "Executing"

# Helper: commit if git is enabled
function Git-Commit($msg) {
    if ($doGit) {
        git add -A 2>$null
        git commit -q --no-gpg-sign -m $msg 2>$null
        Write-Ok "Committed: $msg"
    }
}

# ── Git Init ────────────────────────────────────────────────────────────────
if ($doGit) {
    Write-Step "Initializing git repository..."

    if (Test-Path ".git") {
        Write-Ok "Git repository already initialized"
    } else {
        git init -q
        Write-Ok "Git repository initialized"
    }

    # Clean up setup scripts and create initial commit
    Remove-Item -Path "setup.sh" -Force -ErrorAction SilentlyContinue
    Remove-Item -Path "setup.ps1" -Force -ErrorAction SilentlyContinue
    Write-Sub "Removed setup scripts"

    git add -A 2>$null
    git commit -q --no-gpg-sign -m "chore: initial project setup" 2>$null
    Write-Ok "Committed: chore: initial project setup"
}

// @feature aspire
# ── Port Configuration ──────────────────────────────────────────────────────
if ($basePort -ne 5173) {
    Write-Step "Updating port configuration..."

    Get-ChildItem -Path "src/backend" -Recurse -Include "*.json","*.cs" | ForEach-Object {
        $content = Get-Content $_.FullName -Raw
        if ($content -match "5173|8080") {
            $content = $content -replace '"Frontend": 5173', "`"Frontend`": $frontendPort"
            $content = $content -replace '"Api": 8080', "`"Api`": $apiPort"
            $content = $content -replace 'localhost:5173', "localhost:$frontendPort"
            $content = $content -replace 'localhost:8080', "localhost:$apiPort"
            Set-Content $_.FullName -Value $content -NoNewline
        }
    }

    Write-Ok "Ports updated (base: $basePort)"
    Git-Commit "chore: configure ports (base: $basePort)"
}
// @end

# ── Database Migration ──────────────────────────────────────────────────────
if ($doMigration) {
    Write-Step "Creating initial database migration..."

    $migrationDir = "src/backend/MyProject.Infrastructure/Persistence/Migrations"

    if (Test-Path $migrationDir) {
        Write-Sub "Clearing existing migrations..."
        Remove-Item "$migrationDir/*" -Force -Recurse 2>$null
    } else {
        New-Item -ItemType Directory -Path $migrationDir -Force | Out-Null
    }

    Write-Sub "Restoring dotnet tools..."
    try {
        dotnet tool restore --configfile "src/backend/nuget.config" 2>$null | Out-Null
    } catch {
        dotnet tool restore 2>$null | Out-Null
    }

    Write-Sub "Building project..."
    $buildOutput = dotnet build "src/backend/MyProject.WebApi" -v q 2>&1
    if ($LASTEXITCODE -ne 0) {
        Write-Fail "Build failed - migration skipped"
        Write-Warn "Fix build errors and run manually:"
        Write-Host "  dotnet ef migrations add Initial \" -ForegroundColor DarkGray
        Write-Host "    --project src/backend/MyProject.Infrastructure \" -ForegroundColor DarkGray
        Write-Host "    --startup-project src/backend/MyProject.WebApi \" -ForegroundColor DarkGray
        Write-Host "    --output-dir Persistence/Migrations" -ForegroundColor DarkGray
    } else {
        Write-Sub "Running ef migrations add..."
        $migOutput = dotnet ef migrations add Initial `
            --project "src/backend/MyProject.Infrastructure" `
            --startup-project "src/backend/MyProject.WebApi" `
            --output-dir Persistence/Migrations `
            --no-build 2>&1
        if ($LASTEXITCODE -eq 0) {
            Write-Ok "Migration 'Initial' created"
            Git-Commit "chore: add initial database migration"
        } else {
            Write-Fail "Migration creation failed"
            Write-Warn "Run manually after fixing any issues:"
            Write-Host "  dotnet ef migrations add Initial \" -ForegroundColor DarkGray
            Write-Host "    --project src/backend/MyProject.Infrastructure \" -ForegroundColor DarkGray
            Write-Host "    --startup-project src/backend/MyProject.WebApi \" -ForegroundColor DarkGray
            Write-Host "    --output-dir Persistence/Migrations" -ForegroundColor DarkGray
        }
    }
}

# ── Build & Test ────────────────────────────────────────────────────────────
if ($doBuild) {
    Write-Step "Building solution..."
    dotnet build src/backend/MyProject.slnx -c Debug --verbosity quiet
    Write-Ok "Build succeeded"

    Write-Step "Running tests..."
    dotnet test src/backend/MyProject.slnx -c Release --verbosity quiet --no-restore
    if ($LASTEXITCODE -eq 0) {
        Write-Ok "All tests passed"
    } else {
        Write-Warn "Some tests failed - check output above"
    }
}

# ── Self-cleanup (if git wasn't selected) ───────────────────────────────────
if (-not $doGit) {
    Remove-Item -Path "setup.sh" -Force -ErrorAction SilentlyContinue
    Remove-Item -Path "setup.ps1" -Force -ErrorAction SilentlyContinue
}

# ─────────────────────────────────────────────────────────────────────────────
# Complete!
# ─────────────────────────────────────────────────────────────────────────────
$elapsed = [int]((Get-Date) - $startTime).TotalSeconds

Write-Header "Setup Complete!"

// @feature aspire
if ($doAspire) {
    Write-Host ""
    Write-Host "  Your project is ready!" -ForegroundColor White
    Write-Host ""
    Write-Host "  Completed in ${elapsed}s" -ForegroundColor DarkGray
    Write-Host ""
    Write-Step "Launching Aspire..."
    Write-Host "  The Aspire Dashboard URL will appear below. Press Ctrl+C to stop." -ForegroundColor DarkGray
    Write-Host ""
    dotnet run --project "src/backend/MyProject.AppHost"
} else {
    Write-Host ""
    Write-Host "  Your project is ready!" -ForegroundColor White
    Write-Host ""
    Write-Host "  Quick start" -ForegroundColor White
    Write-Host "  ────────────────────────────────────"
    Write-Host "  dotnet run --project src/backend/MyProject.AppHost"
    Write-Host ""
    Write-Host "  The Aspire Dashboard opens automatically."
    Write-Host "  All service URLs (API, pgAdmin, MinIO) are visible in the Dashboard."
    Write-Host ""
    Write-Host "  Completed in ${elapsed}s" -ForegroundColor DarkGray
    Write-Host ""
}
// @end
// @feature !aspire
Write-Host ""
Write-Host "  Your project is ready!" -ForegroundColor White
Write-Host ""
Write-Host "  Quick start" -ForegroundColor White
Write-Host "  ────────────────────────────────────"
Write-Host "  dotnet run --project src/backend/MyProject.WebApi"
Write-Host ""
Write-Host "  Completed in ${elapsed}s" -ForegroundColor DarkGray
Write-Host ""
// @end

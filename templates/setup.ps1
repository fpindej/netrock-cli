$ErrorActionPreference = "Stop"

function Write-Ok($msg) { Write-Host "  OK " -ForegroundColor Green -NoNewline; Write-Host $msg }
function Write-Warn($msg) { Write-Host "  !! " -ForegroundColor Yellow -NoNewline; Write-Host $msg }
function Write-Fail($msg) { Write-Host "  FAIL " -ForegroundColor Red -NoNewline; Write-Host $msg }

Write-Host ""
Write-Host "MyProject - Setup" -ForegroundColor White
Write-Host "=========================="
Write-Host ""

$errors = 0

# .NET SDK
Write-Host "Checking prerequisites..."
try {
    $version = dotnet --version 2>$null
    Write-Ok ".NET SDK $version"
} catch {
    Write-Fail ".NET SDK not found - install from https://dotnet.microsoft.com/download/dotnet/10.0"
    $errors++
}

// @feature aspire
# Docker
try {
    $null = docker --version 2>$null
    $info = docker info 2>$null
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
# PostgreSQL
try {
    $null = psql --version 2>$null
    Write-Ok "PostgreSQL client (psql)"
} catch {
    Write-Warn "PostgreSQL client (psql) not found - make sure PostgreSQL is running and accessible"
}
// @end

Write-Host ""

if ($errors -gt 0) {
    Write-Host "$errors issue(s) found. Fix them and re-run this script." -ForegroundColor Red
    exit 1
}

Write-Host "All prerequisites met." -ForegroundColor Green

// @feature aspire
# Port configuration
Write-Host ""
Write-Host "Port configuration" -ForegroundColor White
Write-Host ""
Write-Host "  Current base port: " -NoNewline; Write-Host "5173" -ForegroundColor Cyan
Write-Host "  (Frontend: 5173, API: 5175, pgAdmin: 5176, Postgres: 5177, ...)" -ForegroundColor DarkGray
Write-Host ""
$portInput = Read-Host "  Base port [5173]"
if ([string]::IsNullOrWhiteSpace($portInput)) { $portInput = "5173" }

$basePort = 5173
if ([int]::TryParse($portInput, [ref]$basePort) -and $basePort -ge 1024 -and $basePort -le 65527) {
    # valid
} else {
    Write-Host "  Invalid port. Using default 5173." -ForegroundColor Yellow
    $basePort = 5173
}

$frontendPort = $basePort
$apiPort = $basePort + 2

Write-Host ""
Write-Host "  Port allocation"
Write-Host "  -----------------------------------"
Write-Host "  Frontend:  " -NoNewline; Write-Host "$frontendPort" -ForegroundColor Cyan
Write-Host "  API:       " -NoNewline; Write-Host "$apiPort" -ForegroundColor Cyan
Write-Host "  (Infrastructure ports are derived automatically)" -ForegroundColor DarkGray

if ($basePort -ne 5173) {
    Write-Host ""
    Write-Host "  Updating port configuration..." -ForegroundColor DarkGray

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

    Write-Ok "Ports updated"
}
// @end

# Options
Write-Host ""
$doGit = Read-Host "  Initialize git repository? [Y/n]"
if ([string]::IsNullOrWhiteSpace($doGit)) { $doGit = "y" }
$doBuild = Read-Host "  Build and run tests? [Y/n]"
if ([string]::IsNullOrWhiteSpace($doBuild)) { $doBuild = "y" }

# Git init
if ($doGit.ToLower() -eq "y") {
    Write-Host ""
    if (Test-Path ".git") {
        Write-Ok "Git repository already initialized"
    } else {
        git init -q
        Write-Ok "Git repository initialized"
    }
    git add -A 2>$null
    git commit -q -m "chore: initial project setup" 2>$null
    Write-Ok "Initial commit created"
}

# Build & Test
if ($doBuild.ToLower() -eq "y") {
    Write-Host ""
    Write-Host "Building solution..."
    dotnet build src/backend/MyProject.slnx -c Debug --verbosity quiet
    Write-Ok "Build succeeded"
    Write-Host ""

    Write-Host "Running tests..."
    dotnet test src/backend/MyProject.slnx -c Release --verbosity quiet --no-restore
    if ($LASTEXITCODE -eq 0) {
        Write-Ok "All tests passed"
    } else {
        Write-Warn "Some tests failed - check output above"
    }
}

Write-Host ""
// @feature aspire
Write-Host "Ready! Start the project with:" -ForegroundColor Green
Write-Host ""
Write-Host "  dotnet run --project src/backend/MyProject.AppHost"
Write-Host ""
Write-Host "The Aspire dashboard will open automatically."
// @end
// @feature !aspire
Write-Host "Ready! Start the project with:" -ForegroundColor Green
Write-Host ""
Write-Host "  dotnet run --project src/backend/MyProject.WebApi"
// @end
Write-Host ""

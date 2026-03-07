$ErrorActionPreference = "Stop"

function Write-Ok($msg) { Write-Host "  OK " -ForegroundColor Green -NoNewline; Write-Host $msg }
function Write-Warn($msg) { Write-Host "  !! " -ForegroundColor Yellow -NoNewline; Write-Host $msg }
function Write-Fail($msg) { Write-Host "  FAIL " -ForegroundColor Red -NoNewline; Write-Host $msg }

Write-Host ""
Write-Host "MyProject - Setup"
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

# Aspire workload
$workloads = dotnet workload list 2>$null
if ($workloads -match "aspire") {
    Write-Ok "Aspire workload"
} else {
    Write-Warn "Aspire workload not installed - installing..."
    dotnet workload install aspire
    Write-Ok "Aspire workload installed"
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
Write-Host ""

# Build
Write-Host "Building solution..."
dotnet build src/backend/MyProject.slnx -c Debug --verbosity quiet
Write-Ok "Build succeeded"
Write-Host ""

# Tests
Write-Host "Running tests..."
dotnet test src/backend/MyProject.slnx -c Release --verbosity quiet --no-restore
if ($LASTEXITCODE -eq 0) {
    Write-Ok "All tests passed"
} else {
    Write-Warn "Some tests failed - check output above"
}
Write-Host ""

// @feature aspire
Write-Host "Ready! Start the project with:"
Write-Host ""
Write-Host "  dotnet run --project src/backend/MyProject.AppHost"
Write-Host ""
Write-Host "The Aspire dashboard will open automatically."
// @end
// @feature !aspire
Write-Host "Ready! Start the project with:"
Write-Host ""
Write-Host "  dotnet run --project src/backend/MyProject.WebApi"
Write-Host ""
// @end

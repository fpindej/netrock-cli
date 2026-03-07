#!/usr/bin/env bash
set -euo pipefail

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

ok() { echo -e "  ${GREEN}OK${NC} $1"; }
warn() { echo -e "  ${YELLOW}!!${NC} $1"; }
fail() { echo -e "  ${RED}FAIL${NC} $1"; }

echo ""
echo "MyProject - Setup"
echo "=========================="
echo ""

errors=0

# .NET SDK
echo "Checking prerequisites..."
if command -v dotnet &>/dev/null; then
  version=$(dotnet --version 2>/dev/null || echo "unknown")
  ok ".NET SDK $version"
else
  fail ".NET SDK not found - install from https://dotnet.microsoft.com/download/dotnet/10.0"
  errors=$((errors + 1))
fi

// @feature aspire
# Docker
if command -v docker &>/dev/null; then
  if docker info &>/dev/null; then
    ok "Docker (running)"
  else
    fail "Docker installed but not running - start Docker Desktop or the Docker daemon"
    errors=$((errors + 1))
  fi
else
  fail "Docker not found - install from https://docs.docker.com/get-docker/"
  errors=$((errors + 1))
fi
// @end

// @feature !aspire
# PostgreSQL
if command -v psql &>/dev/null; then
  ok "PostgreSQL client (psql)"
else
  warn "PostgreSQL client (psql) not found - make sure PostgreSQL is running and accessible"
fi
// @end

echo ""

if [ "$errors" -gt 0 ]; then
  echo -e "${RED}$errors issue(s) found. Fix them and re-run this script.${NC}"
  exit 1
fi

echo -e "${GREEN}All prerequisites met.${NC}"
echo ""

# Build
echo "Building solution..."
dotnet build src/backend/MyProject.slnx -c Debug --verbosity quiet
ok "Build succeeded"
echo ""

# Tests
echo "Running tests..."
if dotnet test src/backend/MyProject.slnx -c Release --verbosity quiet --no-restore; then
  ok "All tests passed"
else
  warn "Some tests failed - check output above"
fi
echo ""

// @feature aspire
echo "Ready! Start the project with:"
echo ""
echo "  dotnet run --project src/backend/MyProject.AppHost"
echo ""
echo "The Aspire dashboard will open automatically."
// @end
// @feature !aspire
echo "Ready! Start the project with:"
echo ""
echo "  dotnet run --project src/backend/MyProject.WebApi"
echo ""
// @end

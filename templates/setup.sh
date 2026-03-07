#!/usr/bin/env bash
set -euo pipefail

# ─────────────────────────────────────────────────────────────────────────────
# Colors
# ─────────────────────────────────────────────────────────────────────────────
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
BOLD='\033[1m'
DIM='\033[2m'
NC='\033[0m'

ok()   { echo -e "  ${GREEN}OK${NC} $1"; }
warn() { echo -e "  ${YELLOW}!!${NC} $1"; }
fail() { echo -e "  ${RED}FAIL${NC} $1"; }

# ─────────────────────────────────────────────────────────────────────────────
# Interactive Checklist (from netrock init)
# ─────────────────────────────────────────────────────────────────────────────
# Renders a toggleable checklist. Press 1-N to toggle, Enter to confirm.
# Arguments: option labels as positional args
# Globals:  CHECKLIST_DEFAULTS (array of 0/1)
# Returns:  CHECKLIST_RESULTS  (array of 0/1)
prompt_checklist() {
    local options=("$@")
    local count=${#options[@]}
    local selected=()

    for ((i = 0; i < count; i++)); do
        selected[$i]=${CHECKLIST_DEFAULTS[$i]:-1}
    done

    local first_draw=true

    while true; do
        if [[ "$first_draw" != "true" ]]; then
            local lines_up=$((count + 3))
            for ((j = 0; j < lines_up; j++)); do
                echo -en "\033[A\033[2K"
            done
        fi
        first_draw=false

        echo ""
        echo -e "${BOLD}  Press 1-${count} to toggle, Enter to confirm:${NC}"
        echo ""

        for ((i = 0; i < count; i++)); do
            local num=$((i + 1))
            if [[ "${selected[$i]}" == "1" ]]; then
                echo -e "  ${GREEN}[${num}]${NC} ${options[$i]}"
            else
                echo -e "  ${DIM}[${num}]${NC} ${options[$i]}"
            fi
        done

        read -rsn1 choice

        if [[ -z "$choice" ]]; then
            echo ""
            break
        fi

        if [[ "$choice" =~ ^[0-9]$ ]] && [[ $choice -ge 1 ]] && [[ $choice -le $count ]]; then
            local idx=$((choice - 1))
            if [[ "${selected[$idx]}" == "1" ]]; then
                selected[$idx]=0
            else
                selected[$idx]=1
            fi
        fi
    done

    CHECKLIST_RESULTS=("${selected[@]}")
}

validate_port() {
    local port=$1
    if ! [[ "$port" =~ ^[0-9]+$ ]]; then
        return 1
    fi
    if [[ $port -lt 1024 || $port -gt 65527 ]]; then
        return 1
    fi
    return 0
}

# ─────────────────────────────────────────────────────────────────────────────
# Header
# ─────────────────────────────────────────────────────────────────────────────
echo ""
echo -e "${BOLD}MyProject - Setup${NC}"
echo "=========================="
echo ""

errors=0

# ─────────────────────────────────────────────────────────────────────────────
# Prerequisites
# ─────────────────────────────────────────────────────────────────────────────
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

// @feature aspire
# ─────────────────────────────────────────────────────────────────────────────
# Port Configuration
# ─────────────────────────────────────────────────────────────────────────────
echo ""
echo -e "${BOLD}Port configuration${NC}"
echo ""
echo -e "  Current base port: ${CYAN}5173${NC}"
echo -e "  ${DIM}(Frontend: 5173, API: 5175, pgAdmin: 5176, Postgres: 5177, ...)${NC}"
echo ""
read -p "$(echo -e "${BOLD}Base port${NC} [5173]: ")" BASE_PORT
BASE_PORT=${BASE_PORT:-5173}

if ! validate_port "$BASE_PORT"; then
  echo -e "${RED}Invalid port. Must be 1024-65527. Using default 5173.${NC}"
  BASE_PORT=5173
fi

FRONTEND_PORT=$BASE_PORT
API_PORT=$((BASE_PORT + 2))

echo ""
echo -e "  ${BOLD}Port allocation${NC}"
echo -e "  ─────────────────────────────────"
echo -e "  Frontend:  ${CYAN}$FRONTEND_PORT${NC}"
echo -e "  API:       ${CYAN}$API_PORT${NC}"
echo -e "  ${DIM}(Infrastructure ports are derived automatically)${NC}"

# Replace default ports if changed
if [ "$BASE_PORT" != "5173" ]; then
  echo ""
  echo -e "  ${DIM}Updating port configuration...${NC}"

  OS=$(uname)
  if [ "$OS" = "Darwin" ]; then
    grep -rIl --null "5173\|8080" src/backend/ 2>/dev/null | xargs -0 sed -i '' \
      -e "s/\"Frontend\": 5173/\"Frontend\": $FRONTEND_PORT/g" \
      -e "s/\"Api\": 8080/\"Api\": $API_PORT/g" \
      -e "s|localhost:5173|localhost:$FRONTEND_PORT|g" \
      -e "s|localhost:8080|localhost:$API_PORT|g" 2>/dev/null || true
  else
    grep -rIl --null "5173\|8080" src/backend/ 2>/dev/null | xargs -0 sed -i \
      -e "s/\"Frontend\": 5173/\"Frontend\": $FRONTEND_PORT/g" \
      -e "s/\"Api\": 8080/\"Api\": $API_PORT/g" \
      -e "s|localhost:5173|localhost:$FRONTEND_PORT|g" \
      -e "s|localhost:8080|localhost:$API_PORT|g" 2>/dev/null || true
  fi

  ok "Ports updated"
fi
// @end

# ─────────────────────────────────────────────────────────────────────────────
# Options Checklist
# ─────────────────────────────────────────────────────────────────────────────
CHECKLIST_DEFAULTS=(1 1)
prompt_checklist "Initialize git repository" "Build and run tests"
DO_GIT="${CHECKLIST_RESULTS[0]}"
DO_BUILD="${CHECKLIST_RESULTS[1]}"

# ─────────────────────────────────────────────────────────────────────────────
# Git Init
# ─────────────────────────────────────────────────────────────────────────────
if [ "$DO_GIT" = "1" ]; then
  echo ""
  if [ -d ".git" ]; then
    ok "Git repository already initialized"
  else
    git init -q
    ok "Git repository initialized"
  fi
  git add -A >/dev/null 2>&1
  git commit -q --no-gpg-sign -m "chore: initial project setup"
  ok "Initial commit created"
fi

# ─────────────────────────────────────────────────────────────────────────────
# Build & Test
# ─────────────────────────────────────────────────────────────────────────────
if [ "$DO_BUILD" = "1" ]; then
  echo ""
  echo "Building solution..."
  dotnet build src/backend/MyProject.slnx -c Debug --verbosity quiet
  ok "Build succeeded"
  echo ""

  echo "Running tests..."
  if dotnet test src/backend/MyProject.slnx -c Release --verbosity quiet --no-restore; then
    ok "All tests passed"
  else
    warn "Some tests failed - check output above"
  fi
fi

# ─────────────────────────────────────────────────────────────────────────────
# Done
# ─────────────────────────────────────────────────────────────────────────────
echo ""
// @feature aspire
echo -e "${GREEN}Ready!${NC} Start the project with:"
echo ""
echo "  dotnet run --project src/backend/MyProject.AppHost"
echo ""
echo "The Aspire dashboard will open automatically."
// @end
// @feature !aspire
echo -e "${GREEN}Ready!${NC} Start the project with:"
echo ""
echo "  dotnet run --project src/backend/MyProject.WebApi"
// @end
echo ""

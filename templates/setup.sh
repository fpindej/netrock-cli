#!/usr/bin/env bash
set -euo pipefail

# ─────────────────────────────────────────────────────────────────────────────
# Colors and Formatting
# ─────────────────────────────────────────────────────────────────────────────
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
CYAN='\033[0;36m'
BOLD='\033[1m'
DIM='\033[2m'
NC='\033[0m'

print_step()    { echo -e "\n${CYAN}${BOLD}> $1${NC}"; }
print_success() { echo -e " ${GREEN}v${NC} $1"; }
print_warning() { echo -e " ${YELLOW}!${NC} $1"; }
print_error()   { echo -e " ${RED}x${NC} $1"; }
print_substep() { echo -e "  ${DIM}->${NC} $1"; }

# ─────────────────────────────────────────────────────────────────────────────
# Interactive Checklist
# ─────────────────────────────────────────────────────────────────────────────
# Renders a toggleable checklist. Press 1-N to toggle, Enter to confirm.
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
        echo -e "  ${BOLD}Press 1-${count} to toggle, Enter to confirm:${NC}"
        echo ""

        for ((i = 0; i < count; i++)); do
            local num=$((i + 1))
            if [[ "${selected[$i]}" == "1" ]]; then
                echo -e "  ${GREEN}[${num}] v${NC} ${options[$i]}"
            else
                echo -e "  ${DIM}[${num}] o${NC} ${options[$i]}"
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
    if ! [[ "$port" =~ ^[0-9]+$ ]]; then return 1; fi
    if [[ $port -lt 1024 || $port -gt 65527 ]]; then return 1; fi
    return 0
}

# ─────────────────────────────────────────────────────────────────────────────
# Header
# ─────────────────────────────────────────────────────────────────────────────
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$SCRIPT_DIR"

START_TIME=$(date +%s)

echo ""
echo -e "${CYAN}${BOLD}============================================================${NC}"
echo -e "${CYAN}${BOLD}  MyProject - Project Setup${NC}"
echo -e "${CYAN}${BOLD}============================================================${NC}"

# ─────────────────────────────────────────────────────────────────────────────
# Prerequisites
# ─────────────────────────────────────────────────────────────────────────────
print_step "Checking prerequisites..."

errors=0

if command -v dotnet &>/dev/null; then
    version=$(dotnet --version 2>/dev/null || echo "unknown")
    print_success ".NET SDK $version"
else
    print_error ".NET SDK not found - install from https://dotnet.microsoft.com/download/dotnet/10.0"
    errors=$((errors + 1))
fi

// @feature aspire
if command -v docker &>/dev/null; then
    if docker info &>/dev/null; then
        print_success "Docker (running)"
    else
        print_error "Docker installed but not running - start Docker Desktop or the Docker daemon"
        errors=$((errors + 1))
    fi
else
    print_error "Docker not found - install from https://docs.docker.com/get-docker/"
    errors=$((errors + 1))
fi
// @end

// @feature !aspire
if command -v psql &>/dev/null; then
    print_success "PostgreSQL client (psql)"
else
    print_warning "PostgreSQL client (psql) not found - make sure PostgreSQL is running and accessible"
fi
// @end

if [ "$errors" -gt 0 ]; then
    echo ""
    echo -e "${RED}$errors issue(s) found. Fix them and re-run this script.${NC}"
    exit 1
fi

print_success "All prerequisites met"

// @feature aspire
# ─────────────────────────────────────────────────────────────────────────────
# Port Configuration
# ─────────────────────────────────────────────────────────────────────────────
print_step "Port configuration"

echo ""
echo -e "  ${BOLD}Default port allocation${NC}"
echo -e "  ────────────────────────────────────"
echo -e "  Frontend:       ${CYAN}5173${NC}"
echo -e "  API:            ${CYAN}8080${NC}"
echo -e "  ${DIM}pgAdmin:        5176   Postgres: 5177${NC}"
# // @feature file-storage
echo -e "  ${DIM}MinIO:          5178   Console:  5179${NC}"
# // @end
# // @feature auth
echo -e "  ${DIM}MailPit SMTP:   5180   HTTP:     5181${NC}"
# // @end
echo -e "  ${DIM}Infrastructure ports are derived from the base port.${NC}"
echo ""

read -p "$(echo -e "${BOLD}Base port${NC} [5173]: ")" BASE_PORT
BASE_PORT=${BASE_PORT:-5173}

if ! validate_port "$BASE_PORT"; then
    echo -e "${RED}Invalid port (must be 1024-65527). Using default 5173.${NC}"
    BASE_PORT=5173
fi

FRONTEND_PORT=$BASE_PORT
API_PORT=$((BASE_PORT + 2))
PGADMIN_PORT=$((BASE_PORT + 3))
POSTGRES_PORT=$((BASE_PORT + 4))
MINIO_PORT=$((BASE_PORT + 5))
MINIO_CONSOLE_PORT=$((BASE_PORT + 6))
MAILPIT_SMTP_PORT=$((BASE_PORT + 7))
MAILPIT_HTTP_PORT=$((BASE_PORT + 8))

echo ""
echo -e "  ${BOLD}Port allocation${NC}"
echo -e "  ────────────────────────────────────"
echo -e "  Frontend:       ${CYAN}$FRONTEND_PORT${NC}"
echo -e "  API:            ${CYAN}$API_PORT${NC}"
echo -e "  ${DIM}pgAdmin:        $PGADMIN_PORT   Postgres: $POSTGRES_PORT${NC}"
# // @feature file-storage
echo -e "  ${DIM}MinIO:          $MINIO_PORT   Console:  $MINIO_CONSOLE_PORT${NC}"
# // @end
# // @feature auth
echo -e "  ${DIM}MailPit SMTP:   $MAILPIT_SMTP_PORT   HTTP:     $MAILPIT_HTTP_PORT${NC}"
# // @end
// @end

# ─────────────────────────────────────────────────────────────────────────────
# Options Checklist
# ─────────────────────────────────────────────────────────────────────────────
// @feature aspire
CHECKLIST_DEFAULTS=(1 1 1 1)
prompt_checklist \
    "Create initial database migration" \
    "Initialize git repository and commit" \
    "Build and run tests" \
    "Launch Aspire after setup"
DO_MIGRATION="${CHECKLIST_RESULTS[0]}"
DO_GIT="${CHECKLIST_RESULTS[1]}"
DO_BUILD="${CHECKLIST_RESULTS[2]}"
DO_ASPIRE="${CHECKLIST_RESULTS[3]}"
// @end

// @feature !aspire
CHECKLIST_DEFAULTS=(1 1 1)
prompt_checklist \
    "Create initial database migration" \
    "Initialize git repository and commit" \
    "Build and run tests"
DO_MIGRATION="${CHECKLIST_RESULTS[0]}"
DO_GIT="${CHECKLIST_RESULTS[1]}"
DO_BUILD="${CHECKLIST_RESULTS[2]}"
DO_ASPIRE="0"
// @end

# ─────────────────────────────────────────────────────────────────────────────
# Summary
# ─────────────────────────────────────────────────────────────────────────────
echo -e "${CYAN}${BOLD}============================================================${NC}"
echo -e "${CYAN}${BOLD}  Summary${NC}"
echo -e "${CYAN}${BOLD}============================================================${NC}"
// @feature aspire
echo -e "
  ${BOLD}Ports${NC}
  ────────────────────────────────────
  Frontend:         ${CYAN}$FRONTEND_PORT${NC}
  API:              ${CYAN}$API_PORT${NC}

  ${BOLD}Options${NC}
  ────────────────────────────────────
  Create migration: $([ "$DO_MIGRATION" == "1" ] && echo -e "${GREEN}Yes${NC}" || echo -e "${DIM}No${NC}")
  Git init/commit:  $([ "$DO_GIT" == "1" ] && echo -e "${GREEN}Yes${NC}" || echo -e "${DIM}No${NC}")
  Build and test:   $([ "$DO_BUILD" == "1" ] && echo -e "${GREEN}Yes${NC}" || echo -e "${DIM}No${NC}")
  Launch Aspire:    $([ "$DO_ASPIRE" == "1" ] && echo -e "${GREEN}Yes${NC}" || echo -e "${DIM}No${NC}")
"
// @end
// @feature !aspire
echo -e "
  ${BOLD}Options${NC}
  ────────────────────────────────────
  Create migration: $([ "$DO_MIGRATION" == "1" ] && echo -e "${GREEN}Yes${NC}" || echo -e "${DIM}No${NC}")
  Git init/commit:  $([ "$DO_GIT" == "1" ] && echo -e "${GREEN}Yes${NC}" || echo -e "${DIM}No${NC}")
  Build and test:   $([ "$DO_BUILD" == "1" ] && echo -e "${GREEN}Yes${NC}" || echo -e "${DIM}No${NC}")
"
// @end

read -p "$(echo -e "${BOLD}Proceed?${NC} [Y/n]: ")" PROCEED
PROCEED=${PROCEED:-y}
if [[ "${PROCEED,,}" != "y" ]]; then
    print_warning "Aborted by user"
    exit 0
fi

# ─────────────────────────────────────────────────────────────────────────────
# Execution
# ─────────────────────────────────────────────────────────────────────────────
echo -e "\n${CYAN}${BOLD}============================================================${NC}"
echo -e "${CYAN}${BOLD}  Executing${NC}"
echo -e "${CYAN}${BOLD}============================================================${NC}"

// @feature aspire
# ── Port Configuration ──────────────────────────────────────────────────────
if [ "$BASE_PORT" != "5173" ]; then
    print_step "Updating port configuration..."

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

    print_success "Ports updated (base: $BASE_PORT)"
fi
// @end

# ── Database Migration ──────────────────────────────────────────────────────
if [ "$DO_MIGRATION" = "1" ]; then
    print_step "Creating initial database migration..."

    MIGRATION_DIR="src/backend/MyProject.Infrastructure/Persistence/Migrations"

    if [ -d "$MIGRATION_DIR" ]; then
        print_substep "Clearing existing migrations..."
        rm -rf "$MIGRATION_DIR"/*
    else
        mkdir -p "$MIGRATION_DIR"
    fi

    print_substep "Restoring dotnet tools..."
    if ! dotnet tool restore --configfile "src/backend/nuget.config" >/dev/null 2>&1; then
        dotnet tool restore >/dev/null 2>&1 || true
    fi

    print_substep "Building project..."
    if ! dotnet build "src/backend/MyProject.WebApi" -v q >/dev/null 2>&1; then
        print_error "Build failed - migration skipped"
        print_warning "Fix build errors and run manually:"
        echo -e "  ${DIM}dotnet ef migrations add Initial \\${NC}"
        echo -e "  ${DIM}  --project src/backend/MyProject.Infrastructure \\${NC}"
        echo -e "  ${DIM}  --startup-project src/backend/MyProject.WebApi \\${NC}"
        echo -e "  ${DIM}  --output-dir Persistence/Migrations${NC}"
    else
        print_substep "Running ef migrations add..."
        if dotnet ef migrations add Initial \
            --project "src/backend/MyProject.Infrastructure" \
            --startup-project "src/backend/MyProject.WebApi" \
            --output-dir Persistence/Migrations \
            --no-build >/dev/null 2>&1; then
            print_success "Migration 'Initial' created"
        else
            print_error "Migration creation failed"
            print_warning "Run manually after fixing any issues:"
            echo -e "  ${DIM}dotnet ef migrations add Initial \\${NC}"
            echo -e "  ${DIM}  --project src/backend/MyProject.Infrastructure \\${NC}"
            echo -e "  ${DIM}  --startup-project src/backend/MyProject.WebApi \\${NC}"
            echo -e "  ${DIM}  --output-dir Persistence/Migrations${NC}"
        fi
    fi
fi

# ── Git Init ────────────────────────────────────────────────────────────────
if [ "$DO_GIT" = "1" ]; then
    print_step "Initializing git repository..."

    if [ -d ".git" ]; then
        print_success "Git repository already initialized"
    else
        git init -q
        print_success "Git repository initialized"
    fi

    # Clean up setup scripts before committing
    rm -f setup.sh setup.ps1
    print_substep "Removed setup scripts"

    git add -A >/dev/null 2>&1
    git commit -q --no-gpg-sign -m "chore: initial project setup"
    print_success "Initial commit created"
fi

# ── Build & Test ────────────────────────────────────────────────────────────
if [ "$DO_BUILD" = "1" ]; then
    print_step "Building solution..."
    dotnet build src/backend/MyProject.slnx -c Debug --verbosity quiet
    print_success "Build succeeded"

    print_step "Running tests..."
    if dotnet test src/backend/MyProject.slnx -c Release --verbosity quiet --no-restore; then
        print_success "All tests passed"
    else
        print_warning "Some tests failed - check output above"
    fi
fi

# ── Self-cleanup (if git wasn't selected) ───────────────────────────────────
if [ "$DO_GIT" != "1" ]; then
    rm -f setup.sh setup.ps1
fi

# ─────────────────────────────────────────────────────────────────────────────
# Complete!
# ─────────────────────────────────────────────────────────────────────────────
echo ""
echo -e "${CYAN}${BOLD}============================================================${NC}"
echo -e "${CYAN}${BOLD}  Setup Complete!${NC}"
echo -e "${CYAN}${BOLD}============================================================${NC}"

// @feature aspire
if [ "$DO_ASPIRE" = "1" ]; then
    echo -e "
  ${BOLD}Your project is ready!${NC}

  ${DIM}Completed in $(($(date +%s) - START_TIME))s${NC}
"
    print_step "Launching Aspire..."
    echo -e "  ${DIM}The Aspire Dashboard URL will appear below. Press Ctrl+C to stop.${NC}"
    echo ""
    exec dotnet run --project "src/backend/MyProject.AppHost"
else
    echo -e "
  ${BOLD}Your project is ready!${NC}

  ${BOLD}Quick start${NC}
  ────────────────────────────────────
  dotnet run --project src/backend/MyProject.AppHost

  The Aspire Dashboard opens automatically.
  All service URLs (API, pgAdmin, MinIO) are visible in the Dashboard.

  ${DIM}Completed in $(($(date +%s) - START_TIME))s${NC}
"
fi
// @end
// @feature !aspire
echo -e "
  ${BOLD}Your project is ready!${NC}

  ${BOLD}Quick start${NC}
  ────────────────────────────────────
  dotnet run --project src/backend/MyProject.WebApi

  ${DIM}Completed in $(($(date +%s) - START_TIME))s${NC}
"
// @end

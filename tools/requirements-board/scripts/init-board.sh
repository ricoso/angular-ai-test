#!/usr/bin/env bash
set -euo pipefail

# init-board.sh
# Installs GitHub Actions, scripts, and board dependencies from tools/requirements-board/
# Usage: npm run board:init

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/../../.." && pwd)"

echo "🚀 Initializing Requirements Board tooling..."
echo ""

# --- 1. GitHub Actions ---
echo "📦 Installing GitHub Actions..."
mkdir -p "$REPO_ROOT/.github/workflows" "$REPO_ROOT/.github/scripts"

cp "$SCRIPT_DIR/../github/workflows/board-sync.yml" "$REPO_ROOT/.github/workflows/board-sync.yml"
echo "  ✅ .github/workflows/board-sync.yml"

cp "$SCRIPT_DIR/../github/scripts/update-stats.sh" "$REPO_ROOT/.github/scripts/update-stats.sh"
chmod +x "$REPO_ROOT/.github/scripts/update-stats.sh"
echo "  ✅ .github/scripts/update-stats.sh"

# --- 2. Make all scripts executable ---
echo ""
echo "🔧 Setting script permissions..."
chmod +x "$SCRIPT_DIR"/*.sh
echo "  ✅ All scripts in tools/requirements-board/scripts/ are executable"

# --- 3. Install board dependencies ---
echo ""
echo "📥 Installing board dependencies..."
cd "$SCRIPT_DIR/.."
npm install --silent 2>/dev/null
echo "  ✅ Board dependencies installed"

# --- 4. Build board ---
echo ""
echo "🔨 Building board..."
npm run build --silent 2>/dev/null
echo "  ✅ Board built"

echo ""
echo "✅ Requirements Board tooling initialized!"
echo ""
echo "Available commands:"
echo "  npm run board:start       — Start board (dev)"
echo "  npm run board:start:prod  — Start board (prod)"
echo "  npm run board:sync        — Sync REQUIREMENTS.md to all branches"
echo "  npm run board:init        — Re-run this setup"

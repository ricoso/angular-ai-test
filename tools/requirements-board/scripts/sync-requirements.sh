#!/usr/bin/env bash
set -euo pipefail

# sync-requirements.sh
# Syncs REQUIREMENTS.md from main into all req/* and feat/* branches.
# Usage: ./tools/requirements-board/scripts/sync-requirements.sh

REPO_ROOT=$(git rev-parse --show-toplevel)
cd "$REPO_ROOT"

CURRENT_BRANCH=$(git branch --show-current)
FILE="docs/requirements/REQUIREMENTS.md"

echo "🔄 Syncing REQUIREMENTS.md from main to all req/feat branches..."

# Stash local changes if any
STASHED=false
if ! git diff --quiet || ! git diff --cached --quiet; then
  git stash push -m "sync-requirements-auto" --quiet
  STASHED=true
fi

# Ensure main is up to date
git fetch origin main --quiet 2>/dev/null || true

# Collect remote branches
BRANCHES=$(git branch -r | grep -E "origin/(req/|feat/)" | sed 's/ *origin\///' || true)

if [ -z "$BRANCHES" ]; then
  echo "No req/feat branches found."
  [ "$STASHED" = true ] && git checkout "$CURRENT_BRANCH" --quiet && git stash pop --quiet
  exit 0
fi

SYNCED=0
SKIPPED=0
FAILED=0

for branch in $BRANCHES; do
  echo -n "  $branch → "
  git checkout "$branch" --force --quiet 2>/dev/null
  git reset --hard "origin/$branch" --quiet 2>/dev/null

  # Checkout REQUIREMENTS.md from origin/main
  git checkout origin/main -- "$FILE" 2>/dev/null

  if git diff --cached --quiet; then
    echo "✅ already up-to-date"
    ((SKIPPED++)) || true
  else
    git commit -m "docs(board): sync REQUIREMENTS.md from main" --quiet 2>/dev/null
    if git push origin "$branch" --quiet 2>/dev/null; then
      echo "✅ synced"
      ((SYNCED++)) || true
    else
      echo "❌ push failed"
      ((FAILED++)) || true
    fi
  fi
done

# Return to original branch
git checkout "$CURRENT_BRANCH" --force --quiet 2>/dev/null || true

# Restore stash
if [ "$STASHED" = true ]; then
  git stash pop --quiet 2>/dev/null || true
fi

echo ""
echo "📊 Sync complete: $SYNCED synced, $SKIPPED up-to-date, $FAILED failed"

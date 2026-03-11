#!/usr/bin/env bash
set -euo pipefail

REQ_ID="${1:?Usage: implement-requirement.sh REQ-XXX}"

echo "Starting implementation for: ${REQ_ID}"
echo "Ensure you are on the correct feature branch."

CURRENT_BRANCH=$(git branch --show-current)
echo "Current branch: ${CURRENT_BRANCH}"

if [[ ! "$CURRENT_BRANCH" == *"$REQ_ID"* ]]; then
  echo "Warning: Current branch does not match requirement ID."
  echo "Expected branch containing: ${REQ_ID}"
fi

echo "Implementation workflow triggered for ${REQ_ID}."
echo "Use /implement-requirement ${REQ_ID} in Claude Code for guided implementation."

#!/usr/bin/env bash
set -euo pipefail

REQ_ID="${1:?Usage: update-requirement.sh REQ-XXX}"

echo "Updating requirement status for: ${REQ_ID}"

REQ_FILE="docs/requirements/REQUIREMENTS.md"

if [ ! -f "$REQ_FILE" ]; then
  echo "Error: ${REQ_FILE} not found."
  exit 1
fi

echo "Requirements file: ${REQ_FILE}"
echo "Use the Requirements Board UI or edit ${REQ_FILE} directly to update status."

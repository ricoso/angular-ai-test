#!/usr/bin/env bash
set -euo pipefail

REQ_ID="${1:?Usage: create-requirement.sh REQ-XXX-Name}"

# Extract REQ number and name
REQ_NUM=$(echo "$REQ_ID" | grep -oE 'REQ-[0-9]+')
REQ_NAME=$(echo "$REQ_ID" | sed "s/${REQ_NUM}-//")

REQ_DIR="docs/requirements/${REQ_ID}"

echo "Creating requirement: ${REQ_ID}"

# Create requirement folder (skip if already exists)
if [ -d "$REQ_DIR" ]; then
  echo "Requirement directory already exists: ${REQ_DIR}"
  exit 0
fi

mkdir -p "${REQ_DIR}/screenshots"

# Create requirement template
cat > "${REQ_DIR}/requirement.md" << EOF
# ${REQ_ID}

## 1. Title
${REQ_NAME}

## 2. Status
Draft

## 3. Priority
Medium

## 4. Dependencies
-

## 5. Description
TODO: Add description

## 6. Acceptance Criteria
- [ ] TODO

## 7. Technical Notes
TODO
EOF

# Create metadata.json
cat > "${REQ_DIR}/metadata.json" << EOF
{
  "priority": "medium",
  "tags": [],
  "prNumber": null,
  "reviewState": null,
  "lastUpdated": "$(date -u +%Y-%m-%dT%H:%M:%SZ)"
}
EOF

echo "Requirement ${REQ_ID} created in ${REQ_DIR}"

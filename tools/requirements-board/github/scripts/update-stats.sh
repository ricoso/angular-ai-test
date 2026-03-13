#!/bin/bash
# Updates the statistics table in REQUIREMENTS.md
# Usage: . .github/scripts/update-stats.sh <path-to-requirements.md>

FILE="${1:-docs/requirements/REQUIREMENTS.md}"

if [ ! -f "$FILE" ]; then
  echo "File not found: $FILE"
  return 1 2>/dev/null || exit 1
fi

DRAFT=$(grep -c '📝 Draft' "$FILE" || echo 0)
REVIEW=$(grep -c '🔍 In Review' "$FILE" || echo 0)
APPROVED=$(grep -c '✅ Approved' "$FILE" || echo 0)
PROGRESS=$(grep -c '🚧 In Progress' "$FILE" || echo 0)
IMPLEMENTED=$(grep -c '✔️ Implemented' "$FILE" || echo 0)
TOTAL=$((DRAFT + REVIEW + APPROVED + PROGRESS + IMPLEMENTED))

sed -i "s/| 📝 Draft | [0-9]* |/| 📝 Draft | ${DRAFT} |/" "$FILE"
sed -i "s/| 🔍 In Review | [0-9]* |/| 🔍 In Review | ${REVIEW} |/" "$FILE"
sed -i "s/| ✅ Approved | [0-9]* |/| ✅ Approved | ${APPROVED} |/" "$FILE"
sed -i "s/| 🚧 In Progress | [0-9]* |/| 🚧 In Progress | ${PROGRESS} |/" "$FILE"
sed -i "s/| ✔️ Implemented | [0-9]* |/| ✔️ Implemented | ${IMPLEMENTED} |/" "$FILE"
sed -i "s/| \*\*Total\*\* | \*\*[0-9]*\*\* |/| **Total** | **${TOTAL}** |/" "$FILE"

echo "Statistics updated: Draft=$DRAFT Review=$REVIEW Approved=$APPROVED Progress=$PROGRESS Implemented=$IMPLEMENTED Total=$TOTAL"

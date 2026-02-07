#!/bin/bash

# Create new requirement (German only)
# Usage: ./scripts/create-requirement.sh "UserNotifications" 42

if [ $# -lt 2 ]; then
    echo "Usage: $0 <FeatureName> <Number>"
    echo "Example: $0 UserNotifications 42"
    exit 1
fi

FEATURE_NAME=$1
REQ_NUMBER=$(printf "%03d" $2)
REQ_ID="REQ-${REQ_NUMBER}-${FEATURE_NAME}"
REQ_DIR="docs/requirements/${REQ_ID}"

# Check if directory exists
if [ -d "$REQ_DIR" ]; then
    echo "❌ Error: Requirement ${REQ_ID} already exists!"
    exit 1
fi

# Create directory
mkdir -p "$REQ_DIR"

# Copy template (German only)
cp docs/requirements/REQ-TEMPLATE.md "${REQ_DIR}/requirement.md"

# Replace placeholders
sed -i "s/REQ-XXX/REQ-${REQ_NUMBER}/g" "${REQ_DIR}/requirement.md"
sed -i "s/\[Requirement Name\]/${FEATURE_NAME}/g" "${REQ_DIR}/requirement.md"

echo "✅ Created requirement: ${REQ_ID}"
echo ""
echo "📁 File created:"
echo "   - ${REQ_DIR}/requirement.md (🇩🇪 German)"
echo ""
echo "📝 Next steps:"
echo "   1. Edit requirement (German):"
echo "      code ${REQ_DIR}/requirement.md"
echo ""
echo "   2. Add mockups (optional):"
echo "      cp mockup.png ${REQ_DIR}/"
echo ""
echo "   3. Add to REQUIREMENTS.md:"
echo "      FR_${REQ_NUMBER}_${FEATURE_NAME} | ${FEATURE_NAME} | 📝 Draft | Medium | ... | Team X"
echo ""
echo "⚠️  REMEMBER: Code must be BILINGUAL (DE + EN comments)!"
echo ""


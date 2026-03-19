#!/usr/bin/env bash

set -e

# Get current working directory
PWD_PATH="$(pwd)"

# Define paths
TEMPLATE_PATH=".claude/settings.example.json"
OUTPUT_PATH=".claude/settings.json"

# Check if template exists
if [[ ! -f "$TEMPLATE_PATH" ]]; then
  echo "❌ Error: Could not find $TEMPLATE_PATH"
  echo "   Make sure you run this script from the project root directory."
  exit 1
fi

# Ensure .claude directory exists
mkdir -p "$(dirname "$OUTPUT_PATH")"

# Replace $PWD with actual path
PROCESSED_CONTENT=$(sed "s|\$PWD|$PWD_PATH|g" "$TEMPLATE_PATH")

# Validate JSON (requires jq)
if command -v jq >/dev/null 2>&1; then
  echo "$PROCESSED_CONTENT" | jq empty >/dev/null 2>&1 || {
    echo "❌ Error: Invalid JSON after processing"
    exit 1
  }
else
  echo "⚠️  Warning: jq not installed, skipping JSON validation"
fi

# Write output
echo "$PROCESSED_CONTENT" > "$OUTPUT_PATH"

echo "✅ Successfully created $OUTPUT_PATH"
echo "   Replaced \$PWD with: $PWD_PATH"
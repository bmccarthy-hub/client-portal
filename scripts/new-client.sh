#!/usr/bin/env bash
# Scaffold a new client portal page.
# Run from the repo root: ./scripts/new-client.sh
set -euo pipefail

read -rp "Client-facing name (e.g. 'Sarah & James'): " CLIENT_NAME
read -rp "URL slug (e.g. smith-jones-2026 — lowercase, hyphens only): " SLUG
read -rp "Login username (e.g. smithjones — what they'll type on /login/): " USERNAME
read -rp "Wedding date (YYYY-MM-DD): " WEDDING_DATE
read -rsp "Passcode to give the client (won't be stored in plain text): " PASSCODE
echo
read -rp "Formspree form ID (see README — leave blank to fill in later): " FORM_ID

if [[ -z "$SLUG" || -z "$USERNAME" || -z "$PASSCODE" ]]; then
  echo "Slug, username, and passcode are required. Aborting." >&2
  exit 1
fi

CLIENT_FILE="_clients/${SLUG}.md"
IMAGE_DIR="assets/images/clients/${SLUG}"

if [[ -f "$CLIENT_FILE" ]]; then
  echo "A client file already exists at $CLIENT_FILE. Aborting." >&2
  exit 1
fi

PASSCODE_HASH=$(printf '%s' "$PASSCODE" | shasum -a 256 2>/dev/null | awk '{print $1}' || printf '%s' "$PASSCODE" | sha256sum | awk '{print $1}')

mkdir -p "$IMAGE_DIR"

cat > "$CLIENT_FILE" <<EOF
---
slug: ${SLUG}
username: ${USERNAME}
client_name: "${CLIENT_NAME}"
wedding_date: "${WEDDING_DATE}"
status: design               # design | proofing | approved | printing | complete

# SHA-256 hash of the passcode. Never write the plain passcode here.
passcode_hash: "${PASSCODE_HASH}"

feedback_form_id: "${FORM_ID:-YOUR_FORM_ID}"

proofs: []
  # - title: "Save the Date"
  #   image: /assets/images/clients/${SLUG}/save-the-date.jpg
  #   notes: "First pass, watercolor florals."
---
EOF

echo
echo "Created ${CLIENT_FILE}"
echo "Drop this client's proof images into ${IMAGE_DIR}/ and list them under 'proofs' in that file."
echo
echo "Give the client:"
echo "  Portal:   https://YOUR-DOMAIN/login/"
echo "  Username: ${USERNAME}"
echo "  Passcode: (the one you just typed — it is not saved anywhere in plain text)"

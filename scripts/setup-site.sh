#!/usr/bin/env bash
# scripts/setup-site.sh
# ──────────────────────────────────────────────────────────────────────────────
# One-shot setup for a fresh TERP Cannabis ERPNext development site.
# Run from inside frappe-bench root:
#   cd ~/frappe-bench && bash /path/to/terp-erpnext/scripts/setup-site.sh
#
# Prerequisites:
#   - bench is installed (pip install frappe-bench)
#   - mariadb is running (locally or via Docker)
#   - redis instances are running on ports 13000, 11000, 12000
# ──────────────────────────────────────────────────────────────────────────────

set -euo pipefail

SITE="${SITE:-terp.localhost}"
ADMIN_PASS="${ADMIN_PASS:-admin}"
DB_ROOT_PASS="${DB_ROOT_PASS:-root}"
APP_REPO="${APP_REPO:-https://github.com/EvanTenenbaum/terp-erpnext.git}"

echo "==> Fetching ERPNext (v16)..."
bench get-app erpnext --branch version-16

echo "==> Fetching terp_cannabis app..."
bench get-app terp_cannabis "$APP_REPO" --branch main

echo "==> Creating site: $SITE"
bench new-site "$SITE" \
  --mariadb-root-password "$DB_ROOT_PASS" \
  --admin-password "$ADMIN_PASS"

echo "==> Installing ERPNext..."
bench --site "$SITE" install-app erpnext

echo "==> Installing terp_cannabis..."
bench --site "$SITE" install-app terp_cannabis

echo "==> Enabling developer mode..."
bench --site "$SITE" set-config developer_mode 1

echo "==> Skipping setup wizard..."
bench --site "$SITE" set-config skip_setup_wizard 1

echo "==> Running migrations..."
bench --site "$SITE" migrate

echo ""
echo "✅  Setup complete!"
echo "   Site:     http://$SITE:8000"
echo "   Login:    Administrator / $ADMIN_PASS"
echo ""
echo "Start the dev server with: bench start"

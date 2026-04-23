#!/usr/bin/env bash
# scripts/seed.sh
# Import all fixtures and run install hooks.
# Run from frappe-bench root.
set -euo pipefail

SITE="${SITE:-terp.localhost}"

echo "==> Running after_install hooks..."
bench --site "$SITE" execute terp_cannabis.install.after_install

echo "==> Importing fixtures..."
bench --site "$SITE" import-fixtures --app terp_cannabis

echo "==> Seeding ERPNext master data..."
bench --site "$SITE" execute terp_cannabis.install.seed_erpnext_masters

echo "✅  Seed complete."

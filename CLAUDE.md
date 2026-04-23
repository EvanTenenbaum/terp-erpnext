# terp-erpnext — Agent Guide

## What this repo is
Custom Frappe app (`terp_cannabis`) built on ERPNext v16 for THCA wholesale cannabis operations.

## Structure
```
apps/terp_cannabis/terp_cannabis/
├── hooks.py              — app config, event hooks, scheduler, JS/CSS includes
├── install.py            — after_install() seeds roles, strains, grades, org settings
├── seed_masters.py       — ERPNext master data (company, UOMs, payment terms, item groups)
├── modules.txt           — module list
├── patches.txt           — migration patches
├── doctypes/             — 45 custom DocType JSON definitions
├── custom_fields/        — 5 JSON files extending ERPNext built-in DocTypes
├── controllers/          — Python hooks on ERPNext doc events
├── services/             — reusable business logic (pricing, credit, matchmaking, etc.)
├── api/                  — whitelisted REST endpoints
├── www/                  — public web pages (VIP portal, shared catalogue)
├── public/js/            — custom Desk JS (command palette, shortcuts, form enhancers)
├── public/css/           — custom Desk CSS
├── workspace/            — 7 Frappe Desk workspace definitions
├── report/               — 6 Script Reports
├── notification/         — 6 Frappe Notification configs
└── fixtures/             — seed data JSON files
```

## Key custom DocTypes (30+)
THCA Strain, Product Grade, Workflow Queue Status, COGS Rule, Pricing Profile, Sales Catalogue, Intake Session, Photography Queue, Sample Request, Live Shopping Session, VIP Portal Configuration, Credit Limit, Credit Adjustment, Credit Override Request, Client Need, Supplier Supply, Match Record, Feature Flag, Organization Settings, Leaderboard Weight Config, Leaderboard Rank History, Referral Credit, Payment Followup Template, Invoice Dispute, Installment Payment, Crypto Payment, Transaction Fee, Cash Location, Shift Audit, Appointment Request, Time Off Request, Hour Tracking, Client Communication Log, Supplier Harvest Reminder

## Custom fields on ERPNext built-in DocTypes
- Item: strain, product_grade, product_type, cogs_mode, cogs_fixed/low/mid/high, requires_photography, workflow_status
- Batch: sku, batch_status, supplier, lot_number, unit_cost, vendor_range_low/high, photography_status, intake_session
- Customer: is_seller, license_number, referred_by, credit_limit_mode, vip_portal_enabled, preferred_payment_term, sales_rep
- Supplier: license_number, harvest_reminder_days, verification_email, is_buyer
- Sales Order: pricing_profile, order_source, catalogue_ref, referral_credit_applied, referred_by

## Dev workflow
```bash
# After changing Python
bench --site terp.localhost migrate

# After changing DocType JSON
bench --site terp.localhost import-doc apps/terp_cannabis/terp_cannabis/doctypes/<name>/<name>.json

# Export fixtures after UI changes
bench --site terp.localhost export-fixtures --app terp_cannabis

# Run tests
bench --site terp.localhost run-tests --app terp_cannabis

# Build JS/CSS
bench build --app terp_cannabis
```

## Rules
- Never hard-delete records — use docstatus=2 (cancel) or is_cancelled flag
- Actor attribution: always use frappe.session.user, never client-provided user fields
- No `any` types in new Python — use proper type hints
- All custom DocTypes in module "Terp Cannabis"
- Permissions: left to backlog — don't add role restrictions without Evan's instruction
- Branch protection: PRs to main require CI green

## CI
GitHub Actions at .github/workflows/ci.yml — runs py_compile check + Frappe unit tests on every push.

# TERP Cannabis — ERPNext

> **THCA wholesale cannabis ERP** built as a custom [Frappe](https://frappeframework.com) app on top of [ERPNext v16](https://github.com/frappe/erpnext).

ERPNext handles accounting, orders, inventory, suppliers, and customers out of the box. The `terp_cannabis` app adds everything cannabis-specific: THCA strains, COGS range pricing, shareable sales catalogues, live shopping sessions, the VIP client portal, credit enforcement, demand/supply matchmaking, and the full TERP workflow layer.

---

## Architecture

```
ERPNext v16 (base)
└── terp_cannabis/ (custom Frappe app — this repo)
    ├── Custom DocTypes (30+)      — cannabis-specific entities
    ├── Custom Fields              — extends ERPNext DocTypes non-destructively
    ├── Controllers                — business logic hooks on ERPNext events
    ├── Services                   — reusable Python services
    ├── API endpoints              — whitelisted REST/JSON endpoints
    ├── Web pages                  — VIP portal, shared catalogue, farmer verification
    ├── Workspaces                 — Frappe Desk workspace definitions
    ├── Reports                    — Script Reports for cannabis workflows
    ├── Notifications              — Frappe Notification configs
    └── Fixtures                   — seed data (strains, grades, roles, templates)
```

## What ERPNext provides (zero custom build)

| Feature | ERPNext built-in |
|---|---|
| Sales Orders & Quotes | `Sales Order`, `Quotation` |
| Invoices & Bills | `Sales Invoice`, `Purchase Invoice` |
| Payments | `Payment Entry` |
| GL, Journal Entries, Chart of Accounts | `GL Entry`, `Journal Entry`, `Account` |
| Bank Accounts & Transactions | `Bank Account`, `Bank Transaction` |
| Fiscal Periods | `Accounting Period`, `Fiscal Year` |
| Customers & Suppliers | `Customer`, `Supplier` |
| Purchase Orders & Receiving | `Purchase Order`, `Purchase Receipt` |
| Inventory (Stock, Batches, Warehouses) | `Stock Entry`, `Batch`, `Warehouse` |
| Pricing Rules | `Pricing Rule` |
| Payment Terms | `Payment Term` |
| Users, Roles, Permissions | `User`, `Role`, `DocPerm` |
| Calendar, Events | `Event` |
| Todos | `ToDo` |
| Notifications | `Notification Log` |
| Tags, Comments | `Tag`, `Comment` |
| Reports engine | Frappe Script Reports |

## What `terp_cannabis` adds

- **Product catalogue:** THCA Strain, Product Grade, cannabis Item Groups
- **COGS & Pricing:** COGS Rule (LOW/MID/HIGH range model), Pricing Profile (per-client markup)
- **Inventory operations:** Intake Session (direct intake, no PO), Photography Queue, Sample Request, Workflow Queue Status, Batch Status History
- **Sales Catalogue:** shareable token-based catalogues → order/quote conversion
- **Demand & Supply:** Client Need, Supplier Supply, Match Record, matchmaking engine
- **Live Shopping:** Live Shopping Session, participant management, item interest workflow
- **VIP Portal:** client-facing web app with catalog, appointments, marketplace, invoice downloads
- **Credit management:** Credit Limit (WARNING/SOFT_BLOCK/HARD_BLOCK modes), Credit Adjustment, Credit Override Request, Bad Debt Write-Off
- **Extended accounting:** Installment Payments, Crypto Payments, Transaction Fees, Cash Location, Shift Audit, Invoice Dispute, Payment Follow-Up Templates
- **Calendar extensions:** Appointment Request, Time Off Request, Hour Tracking
- **Admin:** Feature Flag, Organization Settings, Referral Credit, Leaderboard Weight Config, Leaderboard Rank History
- **Desk UI:** custom command palette (Ctrl+K), keyboard shortcuts, enhanced list views for key DocTypes
- **7 TERP roles:** Owner, Accounts Manager, Sales Rep, Inventory Manager, Fulfillment, Auditor, VIP Client

## Getting started (development)

### Prerequisites
- Python 3.11+
- MariaDB 10.6+
- Redis (3 instances — cache/queue/socketio)
- `pip install frappe-bench`

### Quick setup

```bash
# 1. Init bench with Frappe + ERPNext
bench init --frappe-branch version-16 ~/frappe-bench
cd ~/frappe-bench

# 2. Get apps
bench get-app erpnext --branch version-16
bench get-app terp_cannabis https://github.com/EvanTenenbaum/terp-erpnext.git

# 3. Create site
bench new-site terp.localhost --admin-password admin

# 4. Install
bench --site terp.localhost install-app erpnext
bench --site terp.localhost install-app terp_cannabis

# 5. Configure
bench --site terp.localhost set-config developer_mode 1
bench --site terp.localhost migrate

# 6. Start
bench start
```

Access at `http://terp.localhost:8000` — login: `Administrator` / `admin`

## Frappe Cloud Deployment (Recommended)

1. Go to [frappecloud.com](https://frappecloud.com) and create an account
2. Create a new Bench — select **ERPNext v16**, Python 3.11
3. In the bench, go to **Apps** → **Add Custom App** → enter:
   - GitHub URL: `https://github.com/EvanTenenbaum/terp-erpnext`
   - Branch: `main`
   - Install path: `apps/terp_cannabis`
4. Create a new Site on that bench, install ERPNext + terp_cannabis
5. After site creation, run in the Frappe Cloud terminal:
   ```bash
   bench --site yoursite.frappe.cloud execute terp_cannabis.install.after_install
   bench --site yoursite.frappe.cloud execute terp_cannabis.seed_masters.seed_erpnext_masters
   ```
6. Login as Administrator, go to **TERP Cannabis** workspace, start using

### Or with Docker (just MariaDB + Redis)

```bash
cd docker
docker compose up -d
# Then run bench locally against Docker services
```

### Or use the setup script

```bash
cd ~/frappe-bench
bash /path/to/terp-erpnext/scripts/setup-site.sh
```

## Development workflow

```bash
# After any Python change
bench --site terp.localhost migrate

# After adding/changing a DocType JSON
bench --site terp.localhost import-doc apps/terp_cannabis/terp_cannabis/doctypes/<name>/<name>.json

# Export fixtures after UI changes
bench --site terp.localhost export-fixtures --app terp_cannabis

# Run tests
bench --site terp.localhost run-tests --app terp_cannabis

# Build JS/CSS assets
bench build --app terp_cannabis
```

## Deployment

Recommended: **[Frappe Cloud](https://frappecloud.com)** — connects to this GitHub repo, handles MariaDB, Redis, workers, SSL, CDN, and auto-deploys on push to `main`.

Self-hosted: see `scripts/setup-site.sh` on a fresh Ubuntu 22.04 droplet (4GB RAM minimum).

## Implementation plan

Full 20-phase plan: [`docs/plans/erpnext-migration-plan.md`](https://github.com/EvanTenenbaum/TERP/blob/main/docs/plans/erpnext-migration-plan.md) in the main TERP repo.

## License

MIT

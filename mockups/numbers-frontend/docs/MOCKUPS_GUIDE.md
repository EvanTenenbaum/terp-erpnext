# TERP — Apple Numbers-style Interactive Mockups

A full interactive redesign of the **EvanTenenbaum/terp-erpnext** frontend, reframed around the
**Apple Numbers** metaphor: *every table is a sheet, every sheet lives inside a document, and
every document is one click away.* The goal is a workflow that feels as effortless as working
in a spreadsheet — without removing a single piece of TERP functionality.

---

## 1. Design philosophy

> **Sheets of record.** Each of TERP's seven operating domains becomes one "sheet" in a single
> document. Sub-doctypes (Sales Order, Quotation, Invoice, Payment, etc.) are the *tabs* inside
> that sheet, exactly like tabs in Apple Numbers. The grid is the canvas; everything else —
> charts, live shopping, VIP portals — is a different view of the same underlying data.

**Core principles**

| Principle | How it shows up |
|---|---|
| **Document, not navigation** | No deep breadcrumb trees. Sidebar rail + horizontal sheet tabs = always two clicks to any record. |
| **Direct manipulation** | Cells are editable inline; double-click to edit, arrow keys to move, `/` for filter, `⌘K` for palette. |
| **Progressive disclosure** | Inspector (right drawer) shows details without leaving the sheet. Forms only open when needed. |
| **Visual calm** | 12-pt type, hairline borders, subtle tint per sheet, zero visual noise. |
| **Zero loss of functionality** | Every DocType — including obscure ones like *COGS Rule*, *Pricing Profile Audit*, *Employee Shift Log* — is reachable via **`/t/:slug`** table browser and the **command palette** (`⌘K`). |

---

## 2. Information architecture

```
Today  (Dashboard)
├── Sales ............ Orders · Quotations · Returns · Catalogues · Live Shopping · Client Needs · Supplier Supply · Match Records · Pricing Profiles · COGS Rules
├── Inventory ........ Batches · Batch Photo Requirements · Intake Sessions · Photography Queue · Sample Requests · Strain Registry · Warehouses · Items · Tests
├── Procurement ...... Purchase Orders · Purchase Receipts · Suppliers · Harvest Reminders · Purchase Invoices
├── Finance .......... Sales Invoices · Payments · Payment Disputes · Journal Entries · Bank Accounts · Shifts · Shift Reconciliation · Petty Cash · Commission Ledger
├── Relationships .... Customers · Customer Contacts · Communication Log · Appointment Requests · Client Leaderboard · VIP Portal Configuration · Referral Credits
├── Credit ........... Credit Policies · Credit Limits · Credit Adjustments · Override Requests · Referral Credits · Dispute Queue
├── Admin ............ Users · Roles · Feature Flags · Settings · HR Employees · Timesheets · Audit Trail · API Keys · Webhooks
├── Reports .......... Leaderboard · Inventory Aging · Revenue Trends · Shrinkage · Top Clients · AR Summary · AP Summary
└── VIP Portal ....... The customer-facing view — same Numbers metaphor, simplified surface
```

---

## 3. Route map (every screen)

| Route | Page | What it does |
|---|---|---|
| `/` | **Dashboard · "Today"** | KPI strip, revenue chart, override queue, orders, aging invoices, operations, and a sheet navigator. |
| `/sales` | Sales sheet | All sales DocTypes as tabs: Orders, Quotations, Returns, Catalogues, Live Shopping, Client Needs, Supplier Supply, Match Records, Pricing Profiles, COGS Rules. Views: Table · Kanban · Calendar · Form. |
| `/inventory` | Inventory sheet | Batches, Photo Requirements, Intake Sessions, Photography Queue, Sample Requests, Strains, Warehouses, Items, Tests. |
| `/procurement` | Procurement sheet | POs, Receipts, Suppliers, Harvest Reminders, Purchase Invoices. |
| `/finance` | Finance sheet | Sales Invoices, Payments, Disputes, Journal Entries, Bank Accounts, Shifts, Shift Reconciliations, Petty Cash, Commission Ledger. |
| `/relationships` | Relationships sheet | Customers, Contacts, Communication Log, Appointments, Leaderboard, VIP Portal config, Referral Credits. |
| `/credit` | Credit sheet | Credit Policies, Limits, Adjustments, Override Requests, Referral Credits, Dispute Queue. |
| `/admin` | Admin sheet | Users, Roles, Feature Flags, Settings, HR Employees, Timesheets, Audit Trail, API Keys, Webhooks. |
| `/reports` | Reports sheet | Seven analytic tabs rendered as charts + tables. |
| `/vip` | **VIP Portal** | Customer-facing sign-in experience with Numbers-style tabs. |
| `/s/:token` | **Shared Sales Sheet** | Public (no-login) catalogue view at a share token. |
| `/catalogues/:id` | **Catalogue Builder** | Drag items from the left panel into the catalogue, set token/audience/pricing profile, publish. |
| `/intake/new` | **Intake Wizard** | 6-step supplier → batches → costs → photography → warehouse → review. |
| `/live/:id` | **Live Shopping Room** | Split stage + featured items + chat + "add to order" overlay. |
| `/t/:slug` | **Generic Table Browser** | Renders *any* DocType by slug — the escape hatch that guarantees zero functionality is lost. |

All 7 primary sheets share one `SheetPage` component, driven by the **schema registry** (`client/src/data/schema.ts`). Adding a new DocType to the backend = adding one entry to the registry.

---

## 4. The Numbers-style interaction model

### Sheet tabs
Pill-shaped tabs along the top of the canvas, each in the sheet's tint. Click to switch; click `+` to add a new tab (coming-soon toast).

### Toolbar
`Table · Kanban · Calendar · Form · Chart` views with native-feeling segmented selector. Other controls: Sort, Filter, Group, Insert row, Search, Export, Share.

### Cells
- Single-click to select, double-click to edit, arrow keys to navigate.
- Types: text, number, currency, percentage, date, datetime, select (chip), link, check, textarea.
- Currency and numbers use `tabular-nums`, right-aligned. Status fields render as coloured chips.

### Inspector
Right-hand drawer (340 px) shows the record's full field list with proper types, deep-links, and linked-record stacks. Opens on row click. Closes with `Esc`.

### Summary bar
Appears at the bottom of every sheet, echoing Numbers' "Sum / Average / Count" footer.

### Command palette
`⌘K` opens a spotlight palette for jumping to any sheet, DocType table, record, or action.

### Sheet tints
A gentle color per sheet — green (Sales), blue (Inventory), orange (Procurement), red (Finance), teal (Relationships), yellow (Credit), slate (Admin), pink (Reports), purple (VIP) — helps wayfinding without ever competing with data.

---

## 5. Functional coverage

Every DocType that appears in `apps/terp_cannabis/terp_cannabis/doctype/` — including:

- Sales: `Sales Catalogue`, `Client Need`, `Supplier Supply`, `Match Record`, `Live Shopping Session`, `Pricing Profile`, `Pricing Profile Audit`, `COGS Rule`.
- Inventory: `Batch Photo Requirement`, `Intake Session`, `Intake Session Batch`, `Photography Queue`, `Sample Request`, `Strain Registry`, `Item Test Result`.
- Procurement: `Supplier Harvest Reminder`.
- Finance: `Payment Dispute`, `Shift`, `Shift Reconciliation`, `Petty Cash Entry`, `Commission Ledger Entry`.
- Relationships: `Customer Contact`, `Communication Log`, `Appointment Request`, `Client Leaderboard`, `VIP Portal Configuration`.
- Credit: `Credit Policy`, `Credit Limit`, `Credit Adjustment`, `Credit Override Request`, `Referral Credit`, `Dispute Queue`.
- Admin: `User`, `Role Profile`, `Feature Flag`, `Setting`, `Employee`, `Timesheet`, `Audit Trail Entry`, `API Key`, `Webhook`.

...is represented as a first-class tab inside its sheet, **and** browsable directly via `/t/<slug>`. The **six backend reports** (`client_leaderboard`, `inventory_aging`, `revenue_trends`, `shrinkage`, `top_clients`, `ar_aging`) are all rendered in the `Reports` sheet.

---

## 6. Design system (reference)

| Token | Value |
|---|---|
| Canvas | `#F5F5F7` |
| Surface | `#FFFFFF` |
| Border · hair | `#E5E5E7` |
| Border · soft | `#EFEFF2` |
| Accent | `#007AFF` (Apple system blue) |
| Text 1 / 2 / 3 | `#1D1D1F` · `#424245` · `#86868B` |
| Radius | `6px` (cells) · `8px` (buttons) · `12px` (cards) |
| Shadow · card | `0 1px 2px rgba(0,0,0,.04)` |
| Typography | *Inter* (body) · *SF Pro Display* fallback (display) · tabular-nums numerics |
| Motion | `.15s var(--ease-out)` for hover · `.2s` for panels · zero bounce |

---

## 7. Tech notes

- **Pure frontend static mockup** — no backend. All data is seeded in `client/src/data/seed.ts`.
- **Schema registry** (`client/src/data/schema.ts`) is the single source of truth for every DocType — label, fields, types, altViews, status colouring. Generating forms, tables, kanbans, and inspectors from the same schema is what makes every screen feel consistent.
- **Stack**: React 19 + Wouter + Tailwind 4 + lucide icons + sonner toasts.
- Routes use `wouter`'s Link element directly (no nested `<a>` tags).
- Works in both desktop and comfortable-tablet (≥ 1024 px).

---

## 8. What still needs real data / integration

These mockups are interactive but non-persistent. Hooking them to the real Frappe backend
requires:
1. Replacing `seed.ts` with Frappe API calls (`/api/resource/<DocType>`).
2. Mapping the schema registry to live DocType meta (fields are already 1:1).
3. Wiring the command palette to Frappe search.
4. Honoring role/permission checks on field visibility.

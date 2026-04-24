# TERP Numbers-Style Mockup — Context Brief for Design Reasoning

## The product
**TERP Cannabis ERP** — a Frappe/ERPNext-v16 custom app for THCA wholesale cannabis
operations. See `github.com/EvanTenenbaum/terp-erpnext`. The current UI is standard
ERPNext Desk: dense forms, left-hand workspace sidebar, DocType list views, report
builders. The owner finds Desk heavy and wants the whole frontend to **feel like
Apple Numbers**: the primary object on every screen is a spreadsheet table you can
scroll, sort, filter, inline-edit, and manipulate — with light, tasteful Apple
Numbers–style chrome and a small, discoverable sidebar of "sheets" and "tables"
instead of the ERPNext mega-sidebar.

## Non-negotiable constraint
> "The system must not lose any functionality and should be as simple and straightforward to use as possible."

Every DocType, workflow, field, action, notification, report, portal, and API
endpoint listed below MUST be represented in the mockup, even if minimized into
a row action, a gear menu, or a secondary sheet.

## Seven Sheets (top-level workspaces)
Map to the seven ERPNext/Frappe workspaces:
1. **Sales** — Sales Order, Quotation, Sales Return, Sales Catalogue,
   Live Shopping Session, Client Need, Supplier Supply, Match Record,
   Pricing Profile, COGS Rule.
2. **Inventory** — Batch, Intake Session, Stock Entry, Delivery Note,
   Photography Queue, Sample Request, Batch Status History, Workflow
   Queue Status, Warehouse, Stock Ledger Entry.
3. **Procurement** — Purchase Order, Purchase Receipt, Supplier,
   Supplier Supply, Supplier Harvest Reminder, Purchase Invoice,
   Payment Entry.
4. **Finance** — Sales Invoice, Payment Entry, Invoice Dispute,
   Installment Payment, Referral Credit, Purchase Invoice, Crypto Payment,
   Transaction Fee, Journal Entry, GL Entry, Account, Bank Account,
   Bank Transaction, Cash Location, Shift Audit, Payment Followup Template,
   Credit Adjustment.
5. **Relationships** — Customer, Credit Limit, Credit Adjustment,
   Credit Override Request, Client Communication Log, Client Need,
   VIP Portal Configuration, Supplier, Supplier Supply,
   Supplier Harvest Reminder, Match Record.
6. **Client Credit** — Credit Limit, Credit Adjustment, Credit Override Request,
   Referral Credit, Invoice Dispute.
7. **Admin** — User, Role, Role Permission for Page and Report,
   Feature Flag, Organization Settings, Leaderboard Weight Config,
   Appointment Request, Time Off Request, Hour Tracking, Audit Log,
   Error Log.

Plus two portals that are NOT part of Desk but must be covered:
- **VIP Client Portal** (live catalog, appointments, marketplace, invoices, leaderboard).
- **Shared Sales Sheet** (public token link).

## Custom DocTypes (30+ — every one must appear)
Appointment Request, Batch Status History, Cash Location,
Client Communication Log, Client Need, COGS Rule, Credit Adjustment,
Credit Limit, Credit Override Request, Crypto Payment, Feature Flag,
Hour Tracking, Installment Payment, Installment Schedule Item,
Intake Session, Intake Session Batch, Invoice Dispute,
Leaderboard Rank History, Leaderboard Weight Config,
Live Shopping Item, Live Shopping Participant, Live Shopping Session,
Match Record, Organization Settings, Payment Followup Template,
Photography Queue, Photography Queue Image, Pricing Profile,
Pricing Profile Rule, Product Grade, Referral Credit, Sales Catalogue,
Sales Catalogue Item, Sample Request, Shift Audit, Shift Transaction,
Supplier Harvest Reminder, Supplier Supply, THCA Strain, Time Off Request,
Transaction Fee, VIP Portal Configuration, Workflow Queue Status.

## Custom fields bolted onto ERPNext builtins
- **Item**: strain, product_grade, product_type, cogs_mode, cogs_fixed/low/mid/high, requires_photography, workflow_status
- **Batch**: sku, batch_status, supplier, lot_number, unit_cost, vendor_range_low/high, photography_status, intake_session
- **Customer**: is_seller, license_number, referred_by, credit_limit_mode, vip_portal_enabled, preferred_payment_term, sales_rep
- **Supplier**: license_number, harvest_reminder_days, verification_email, is_buyer
- **Sales Order**: pricing_profile, order_source, catalogue_ref, referral_credit_applied, referred_by

## Business logic that must surface in UI
- **Credit check** (`credit_service.check_credit`): returns allowed/warning/requires_override with enforcement mode WARNING / SOFT_BLOCK / HARD_BLOCK. Must appear inline on Sales Order rows and a banner on Customer sheet.
- **Pricing** (`pricing_service`): unit_price = cogs × (1 + markup%), with RANGE COGS (LOW/MID/HIGH basis) and pricing-profile rules per item group / product type. Must show inline price math + applied rules in a side panel.
- **Matchmaking** (`matchmaking_service`): scored matches between Client Needs and Supplier Supply, sortable table.
- **Leaderboard** (`leaderboard_service`): weekly rankings with master/financial/engagement/reliability/growth sub-scores.
- **Credit override** flow: Sales Rep raises request → Accounts Manager approves in a queue.
- **Intake → Photography → Live/Ready** batch workflow; drag-and-drop between status columns must be available on a kanban overlay, but the underlying artifact stays a table.

## Actions (API endpoints already whitelisted)
- dashboard: operational_kpis, inventory_snapshot, cash_position, inventory_aging
- live_shopping: start/pause/end session, mark_interest, convert_to_order
- sales_catalogue: create, generate_share_token, convert_to_order, convert_to_quotation, get_shared_catalogue
- vip_portal: login, impersonate, dashboard_data

## 6 Reports (become "calculated sheets")
Client Leaderboard, Inventory Aging, Revenue Trends, Shrinkage Report,
Top Clients, plus the Client Leaderboard snapshot history.

## 6 Notifications (bell dropdown)
Credit Override Requested, Invoice Overdue, Live Session Started,
New Order Submitted, PO Expected Today, Sample Due Return.

## Roles
TERP Owner, Accounts Manager, Sales Rep, Inventory Manager, Fulfillment,
Auditor, VIP Client.

## Keyboard shortcuts to preserve
Cmd/Ctrl+K command palette, Cmd/Ctrl+N new sales order, plain N/I/C/? quick nav.

## Design direction to honor
Apple Numbers (macOS):
- Off-white canvas, airy margins, hairline rules (1 px), rounded corners
- Sheet tabs across the top of the table area (like Numbers sheet switcher)
- A collapsible left rail showing the 7 Sheets and, inside each, the list of "Tables" (DocTypes) — think Numbers' left outline
- Inline cell editing, column type chips (Data / Link / Select / Currency / Date), sortable headers with tiny chevrons, filter pills above the table
- Floating format panel on the right (like Numbers' Format inspector) showing the selected cell's metadata, validation, and related records
- A compact top toolbar with: View switcher (Table / Kanban / Calendar / Form) per table, Sort, Filter, Group, Insert, Export, Share
- Pastel category accents (one soft color per Sheet) but stay mostly monochrome + one accent

## What I need from you (the reasoning model)
1. A complete **screen inventory** — every Sheet × every Table × every view (Table / Kanban / Calendar / Form / Chart / Report) × key modals (new intake, credit override, share catalogue, start live session, shift open/close, match-record detail, pricing inspector, VIP portal, shared sales sheet).
2. A final **information architecture tree** in text form.
3. A concrete **design system** (color/type/spacing/radius/shadow/motion).
4. A **prioritized build plan** for the React/Vite prototype: which screens to build first so the prototype feels complete within ~12–15 routes but still reaches every DocType via the right-side inspector.

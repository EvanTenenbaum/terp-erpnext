# Addendum — Routes 6-15 and Build Plan (extends Opus plan)

## Routes 6-15 (summary; Opus covered 1-5)

### Route 6: Relationships Sheet (`/relationships`)
Default Table: Customer. Side drawer to pivot to Supplier. Row-level Credit Badge pill (from `checkCredit(customer)` simulation). Inspector shows: outstanding AR, last 5 orders, communication log timeline, VIP portal toggle, credit limit, pricing profile, sales rep.
Tables covered: Customer, Supplier, Credit Limit, Credit Adjustment, Credit Override Request, Client Communication Log, Client Need, VIP Portal Configuration, Supplier Supply, Supplier Harvest Reminder, Match Record.

### Route 7: Client Credit Sheet (`/credit`)
Default Table: Credit Override Request (kanban tabs: Pending / Approved / Rejected).  Approve button opens modal showing: order, customer, current limit, requested amount, delta, exposure, enforcement mode, free-text review_notes, Approve / Reject buttons. Secondary tables accessible in TableBrowser: Credit Limit, Credit Adjustment, Referral Credit, Invoice Dispute.

### Route 8: Admin Sheet (`/admin`)
Default Table: User. TableBrowser reveals: Role, Role Permission for Page and Report, Feature Flag, Organization Settings (single-document form view), Leaderboard Weight Config, Appointment Request, Time Off Request, Hour Tracking, Audit Log, Error Log.

### Route 9: Reports (`/reports`)
Landing grid card list → click a card to open report as a calculated sheet. Sub-routes `/reports/client-leaderboard`, `/reports/inventory-aging`, `/reports/revenue-trends`, `/reports/shrinkage`, `/reports/top-clients`. Each: filters bar + SheetTable + small ChartCard.

### Route 10: VIP Portal (`/vip`)
Simpler chrome: only 4 tabs at top — Catalog / Appointments / Marketplace / Invoices / Leaderboard. Table-first too, but each table has a visual "Grid" alt view. Mock customer "Atlas Dispensary." Actions: add to cart, request sample, submit need, download PDF.

### Route 11: Shared Sales Sheet (`/shared/sales-sheet?token=demo`)
Public view — no sidebar, no inspector. Top-right "Request Quote" button. Shows read-only catalog table + grid.

### Route 12: Live Shopping Room (`/live/:session`)
Split view: left = big product card of current item + 60-second countdown; right = the Session items table. Host controls Start/Pause/End + "Convert committed to order." Participant column uses emoji badges (👀 viewing / 🙋 interested / ✅ committed / ❌ passed).

### Route 13: Sales Catalogue Builder (`/catalogues/:id`)
Left = Items browser (drag from batches); right = Catalogue spreadsheet with inline listed_price, qty_available, cogs_basis Select, notes. Footer actions: Generate share token, Convert to Order, Convert to Quotation.

### Route 14: Intake Wizard (`/intake/new`)
Spreadsheet first-class. Supplier pick at top, then a table you fill row by row: item / batch_no / qty / unit / cogs_mode (FIXED or RANGE) / unit_cogs / cogs_low / cogs_high / location. "Submit Intake" creates Batches (simulated via console.log and toast).

### Route 15: Table Browser (`/t/:doctype`)
Universal fallback route. Any DocType not getting a dedicated page renders here via generic SheetTable driven by a schema registry. Guarantees zero functionality loss.

## Build Plan

### Simulated data (JSON under `client/src/data/`)
- `schema.ts` — registry with every DocType, its columns, field types, select options, parent Sheet
- `customers.json`, `suppliers.json`, `items.json`, `batches.json`, `strains.json`, `product_grades.json`
- `sales_orders.json`, `quotations.json`, `sales_returns.json`, `sales_catalogues.json`, `live_sessions.json`
- `client_needs.json`, `supplier_supply.json`, `match_records.json`
- `pricing_profiles.json`, `cogs_rules.json`
- `photography_queue.json`, `sample_requests.json`, `intake_sessions.json`, `warehouses.json`, `stock_ledger.json`, `delivery_notes.json`, `workflow_queue_status.json`, `batch_status_history.json`
- `purchase_orders.json`, `purchase_receipts.json`, `purchase_invoices.json`, `harvest_reminders.json`
- `sales_invoices.json`, `payment_entries.json`, `invoice_disputes.json`, `installments.json`, `referral_credits.json`, `crypto_payments.json`, `transaction_fees.json`, `journal_entries.json`, `gl_entries.json`, `accounts.json`, `bank_accounts.json`, `bank_transactions.json`, `cash_locations.json`, `shift_audits.json`, `payment_followup_templates.json`, `credit_adjustments.json`
- `customers_communication.json`, `credit_limits.json`, `credit_overrides.json`, `vip_portal_configs.json`
- `users.json`, `roles.json`, `feature_flags.json`, `org_settings.json`, `leaderboard_weights.json`, `leaderboard_history.json`, `appointments.json`, `time_off.json`, `hour_tracking.json`, `audit_log.json`, `error_log.json`
- `notifications.json`, `kpis.json`, `inventory_aging.json`, `revenue_trends.json`, `shrinkage.json`, `top_clients.json`

### Shared components (build in this order, in `client/src/components/numbers/`)
1. `tokens.css` extending `index.css` with Opus color/type/shadow variables
2. `SheetAppShell.tsx` — global layout (sidebar rail + sheet tab bar + content + optional inspector)
3. `SidebarRail.tsx` — 7 Sheets + VIP + Shared + Reports; expand/collapse; shows Tables within
4. `SheetTabBar.tsx` — Numbers-style sheet tabs across the top of the table area
5. `Toolbar.tsx` — View switcher, Sort, Filter, Group, Insert, Export, Share, Zoom
6. `FilterBar.tsx` — filter pills + quick search + saved filters
7. `ColumnHeader.tsx` — header chip with type icon, sort, menu
8. `CellEditor.tsx` — text / number / currency / date / select / link cells, with keyboard nav, Tab/Enter
9. `SheetTable.tsx` — the heart: virtualized-ish table with frozen header, row selection, inline edit, hover, keyboard nav
10. `Inspector.tsx` — right-hand panel; header stripe = sheet accent; sections; opens from row click
11. `KanbanBoard.tsx` — alt view; draggable cards grouped by a column
12. `CalendarView.tsx` — alt view; monthly grid with event dots
13. `FormOverlay.tsx` — Numbers-like "expand row" sheet that slides from right covering 70%
14. `ChartCard.tsx` — recharts wrapper (line / bar / pie)
15. `CommandPalette.tsx` — Cmd+K; every table, every action, every customer/supplier/order
16. `NotificationBell.tsx` — dropdown with 6 notification types
17. `CreditBadge.tsx`, `PricingInspector.tsx`, `ShareTokenDialog.tsx`, `StartShiftDialog.tsx`, `NewIntakeWizard.tsx`, `CreditOverrideDialog.tsx`, `ConvertCatalogueDialog.tsx`, `MarkInterestButton.tsx`

### Pages (`client/src/pages/`)
- `Dashboard.tsx` → `/`
- `SalesSheet.tsx` → `/sales`
- `InventorySheet.tsx` → `/inventory`
- `ProcurementSheet.tsx` → `/procurement`
- `FinanceSheet.tsx` → `/finance`
- `RelationshipsSheet.tsx` → `/relationships`
- `CreditSheet.tsx` → `/credit`
- `AdminSheet.tsx` → `/admin`
- `Reports.tsx` + 5 report sub-pages → `/reports`, `/reports/:slug`
- `VipPortal.tsx` → `/vip`
- `SharedSalesSheet.tsx` → `/shared/sales-sheet`
- `LiveRoom.tsx` → `/live/:session`
- `CatalogueBuilder.tsx` → `/catalogues/:id`
- `IntakeWizard.tsx` → `/intake/new`
- `TableBrowser.tsx` → `/t/:doctype`

### Routing & theme
- Wouter `<Switch>` with all above routes
- `SheetAppShell` wraps authenticated routes; `VipPortal`, `SharedSalesSheet`, `LiveRoom` use lighter chromes
- Theme stays light; dark mode left off to preserve Numbers feel

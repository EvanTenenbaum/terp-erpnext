# TERP Numbers Mockup · Feature Inventory (for coverage audit)

## Routes
- `/` Dashboard (KPI strip: Orders Today, Revenue 30d, Receivables, Live Batches, Override Queue; Revenue bar chart; Credit overrides approve list; Orders this week; Aging invoices; Operations list)
- `/sales` sheet · tabs: Sales Orders, Quotations, Sales Returns, Sales Catalogues, Live Shopping, Client Needs, Supplier Supply, Match Records, Pricing Profiles, COGS Rules
- `/inventory` sheet · tabs: Batches, Photo Requirements, Intake Sessions, Intake Session Batches, Photography Queue, Sample Requests, Strain Registry, Item Test Results, Items, Warehouses
- `/procurement` sheet · tabs: Purchase Orders, Purchase Receipts, Suppliers, Harvest Reminders, Purchase Invoices
- `/finance` sheet · tabs: Sales Invoices, Payments, Payment Disputes, Journal Entries, Bank Accounts, Shifts, Shift Reconciliations, Petty Cash, Commission Ledger
- `/relationships` sheet · tabs: Customers, Contacts, Communication Log, Appointments, Client Leaderboard, VIP Portal Config, Referral Credits
- `/credit` sheet · tabs: Credit Policies, Credit Limits, Credit Adjustments, Override Requests, Referral Credits, Dispute Queue
- `/admin` sheet · tabs: Users, Role Profiles, Feature Flags, Settings, Employees, Timesheets, Audit Trail, API Keys, Webhooks
- `/reports` sheet · tabs: Client Leaderboard, Inventory Aging, Revenue Trends, Shrinkage, Top Clients, AR Summary, AP Summary
- `/vip` VIP Portal (customer-facing) · Overview, Catalogues, Live Shopping, Leaderboard, Appointments, Referrals, My Invoices, My Requests
- `/s/:token` Shared public catalogue (no-login) with "Your order" side cart + Submit request
- `/catalogues/:id` Catalogue Builder (drag items, token/audience/pricing profile, publish)
- `/intake/new` 6-step Intake Wizard: supplier → batches → costs → photography → warehouse → review
- `/live/:id` Live Shopping Room (stage, featured items, chat, add-to-order overlay, LIVE pulse, viewer count)
- `/t/:slug` Generic Table Browser for any DocType by slug

## Shell / global
- Left rail (10 sheets) with "Numbers" badge, sheet-tint active accent, Tools section (Catalogue Builder, Intake, Live), user profile bottom
- Top bar: title + breadcrumb-like subtitle, global search with ⌘K kbd, New button, Notification Bell with dropdown (6 notif types), avatar
- Command Palette (⌘K): navigate to sheets, tables, records, and actions
- Sheet Tab Bar (scrollable with fade + chevron, count pills)
- Toolbar (view switcher segmented: Table / Kanban / Calendar / Form / Chart; Sort / Filter / Group / Insert row; Search; Export; Share)
- SheetTable: sortable columns, keyboard nav, inline edit (text/num/currency/%, date, select/chip, link, check, textarea), row selection, sticky header, footer (row count, Sum, Avg, hint)
- Inspector (340px drawer): sheet-tinted top strip, breadcrumb, prominent primary value, sectioned details, action buttons
- Empty/loading states; sonner toast on placeholder actions

## Interaction details
- Tabular-nums numerics, right-aligned currency
- Status chips with short labels (`shortStatus`), color-accurate per state
- View switcher segmented (Table/Kanban/Calendar/Form/Chart; Chart only on Reports)
- Link cells deep-link; select cells render as chips
- Summary footer echoes Numbers "Sum/Avg/Count"
- All sheet pages share one SheetPage component driven by a schema registry

## Not explicitly shown
- Login / auth flow screens (we assume logged-in)
- Mobile drawer / mobile pick/pack interface
- Global search results page (only input + palette)
- Calendar view internals (tab exists, placeholder)
- Dark / theme density toggles
- Per-user settings pages
- Photo viewer / uploader
- Signature / attachment upload
- Stripe payment capture UI
- Supplier-confirming intake (external form)
- Farmer intake verification external link
- Formal pick/pack PDA-style screen
- GL drill-through (journal entry → transactions)

## NEW since last inventory update
- /receive/new — Purchase Receipt ritual: pick PO/supplier/batch by typing, confirm Qty Received, sticky "Commit Receipt" updates Inventory + closes PO line
- /pay/new — Payments ritual: pick customer or supplier by typing, type-to-search outstanding invoices, allocate, sticky "Post payment" creates Payment Entry against the right party
- Frappe binding shim (lib/api.ts + useDoctype hook + BINDING.md) — flip VITE_FRAPPE_URL to switch the entire UI from seed to live /api/resource/<DocType>
- Identity-cell type-to-search: every `link` field across every sheet now opens a live searchable dropdown — eliminates copy-paste from Inventory → Sales / Procurement → Finance / etc.
- Plain-language schema sweep: Engagement→Visits, Reliability→Pay, AR/AP→Owed/We owe, Outstanding→Owed, Sales Order→Sale

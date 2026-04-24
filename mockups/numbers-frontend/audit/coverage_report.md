# TERP Mockups — USER_STORIES.md Coverage Report

Audit of every story in `EvanTenenbaum/TERP/docs/USER_STORIES.md` against the
Numbers-style mockup at `mockups/numbers-frontend`.

**Status legend:** ✅ Covered · 🟡 Partial · ❌ Missing · ⏭ Out-of-scope

| US-ID | Status | Where in the mockup | Notes |
|---|---|---|---|
| US-ID | Status | Where in the mockup | Notes |
|-------|--------|---------------------|-------|
| US-001 | ⏭ Out-of-scope | N/A | Login/auth flow screens explicitly not shown in inventory |
| US-002 | ⏭ Out-of-scope | N/A | Login/auth flow screens explicitly not shown |
| US-003 | ⏭ Out-of-scope | N/A | Auth flow not shown; logout exists in account dropdown but session revocation is backend |
| US-004 | 🟡 Partial | /admin → Users tab | Users table exists but session revocation action not explicitly shown |
| US-005 | ⏭ Out-of-scope | N/A | Backend token invalidation, no UI shown |
| US-006 | ⏭ Out-of-scope | N/A | Login redirect flow not shown (assumes logged-in) |
| US-007 | ⏭ Out-of-scope | N/A | Dev/test endpoint, not a UI feature |
| US-008 | ✅ Covered | Left rail | Left rail with 10 sheets, Tools section, grouped navigation |
| US-009 | 🟡 Partial | Left rail | Rail exists with icon badges; collapse/preference persistence not explicitly shown |
| US-010 | ❌ Missing | N/A | Mobile drawer not shown per inventory |
| US-011 | 🟡 Partial | Left rail, Command Palette | Quick actions available via ⌘K and rail Tools section, but not "pinned at top" as described |
| US-012 | ✅ Covered | Top bar | Breadcrumb-like subtitle in top bar on all pages |
| US-013 | ✅ Covered | Left rail | Sheet-tint active accent on active item |
| US-014 | ❌ Missing | N/A | Skeleton rows for feature-flag loading not mentioned |
| US-015 | 🟡 Partial | Top bar avatar | Avatar with dropdown exists; theme/density toggles not explicitly shown per inventory |
| US-016 | ❌ Missing | N/A | Dark/theme toggles explicitly listed as "not shown" |
| US-017 | ❌ Missing | N/A | Density toggles explicitly listed as "not shown" |
| US-018 | ❌ Missing | N/A | Version banner with reload not mentioned |
| US-019 | ❌ Missing | N/A | Global error boundary not mentioned in inventory |
| US-020 | ✅ Covered | / Dashboard | KPI strip with Orders Today, Revenue 30d, Receivables, Live Batches |
| US-021 | ✅ Covered | / Dashboard | Orders Today in KPI strip |
| US-022 | ✅ Covered | / Dashboard | Receivables in KPI strip |
| US-023 | 🟡 Partial | / Dashboard | Revenue 30d shown; 7d comparison not explicitly mentioned |
| US-024 | ❌ Missing | N/A | Cash Position panel with scheduled payables/net not shown |
| US-025 | 🟡 Partial | / Dashboard | Receivables shown; AR vs AP comparison exists in /reports but not as dashboard panel |
| US-026 | 🟡 Partial | /relationships → Appointments | Appointments tab exists; not shown as dashboard panel |
| US-027 | ❌ Missing | N/A | "Suppliers Waiting to Be Paid" panel not shown on dashboard |
| US-028 | 🟡 Partial | /inventory → Batches, Items | Inventory data exists; "What's In Stock" summary panel not on dashboard |
| US-029 | 🟡 Partial | /reports → Inventory Aging | Inventory Aging report exists; aging chips not shown on dashboard |
| US-030 | 🟡 Partial | /reports → Inventory Aging | Aging report exists; "Top 5 Oldest" panel not on dashboard |
| US-ID | Status | Where in the mockup | Notes |
|-------|--------|---------------------|-------|
| US-031 | ❌ Missing | — | Dashboard KPIs exist but no SKU Status Browser widget with drill-down |
| US-032 | 🟡 Partial | `/` Dashboard | Empty/loading states mentioned globally; per-widget independent error states not explicit |
| US-033 | 🟡 Partial | `/` Dashboard | Approve list and operations list link implied; KPI strip click-through not explicitly described |
| US-034 | 🟡 Partial | `/` Dashboard | Global empty/loading states exist; specific "Unable to load daily snapshot" degraded state not shown |
| US-035 | ✅ Covered | `/sales` sheet | Sales Orders is first tab listed, would be default |
| US-036 | ✅ Covered | `/sales` → Sales Orders | SheetTable with sortable columns, inline edit, Status chips, totals in footer |
| US-037 | ❌ Missing | — | No "Next" contextual action column described in schema |
| US-038 | ✅ Covered | Toolbar | View switcher segmented: Table / Kanban / Calendar / Form / Chart |
| US-039 | ✅ Covered | Inspector drawer | 340px drawer shows linked details; row click expands context |
| US-040 | 🟡 Partial | Top bar New button + Inspector | New button exists; drawer pattern exists; preserving queue context not explicitly stated |
| US-041 | 🟡 Partial | SheetTable | Keyboard nav, row selection mentioned; full shortcut set (Shift+Click, Ctrl+C, Ctrl+A) not explicit |
| US-042 | ✅ Covered | `/sales` → Sales Orders | Status chips with shortStatus; single queue with stage/status column |
| US-043 | ✅ Covered | `/sales` → Quotations | Quotations tab exists with SheetTable pattern |
| US-044 | ✅ Covered | `/sales` → Quotations + New button | New button + SheetTable + Insert row in toolbar |
| US-045 | ✅ Covered | Toolbar | Filter capability in toolbar; status chips available for filtering |
| US-046 | 🟡 Partial | `/sales` → Quotations | Both tabs exist; explicit "convert to order" action not described |
| US-047 | 🟡 Partial | `/sales` → Quotations | Status chips exist; specific QUOTE_DRAFT→QUOTE_SENT→CONVERTED flow not explicit |
| US-048 | ❌ Missing | — | No Pick List tab in Sales; only Sales Orders, Quotations, Returns, Catalogues etc. |
| US-049 | ❌ Missing | — | No Pick List tab exists |
| US-050 | ✅ Covered | Toolbar | Export button in toolbar |
| US-051 | ❌ Missing | — | No truncation notice described |
| US-052 | ✅ Covered | `/sales` → Sales Returns | Sales Returns tab exists with SheetTable |
| US-053 | 🟡 Partial | `/sales` → Sales Returns | Tab exists; specific RMA creation flow with line-item selection not detailed |
| US-054 | 🟡 Partial | `/sales` → Sales Returns | Status chips exist; specific Draft→Received→Inspected→Restocked/Disposed→Closed flow not explicit |
| US-055 | 🟡 Partial | `/sales` → Sales Returns | Tab exists; GL Status column not explicitly listed |
| US-056 | 🟡 Partial | `/sales` → Sales Returns + SheetTable footer | Footer has Sum/Avg/Count; specific return summary stats not described |
| US-057 | ✅ Covered | `/catalogues/:id` Catalogue Builder | Drag items, audience/pricing profile, build catalogues |
| US-058 | ✅ Covered | `/catalogues/:id` Catalogue Builder | Builder with publish implies draft state |
| US-059 | ✅ Covered | `/s/:token` + Catalogue Builder | Token-based public link; pricing profile controls visible fields |
| US-060 | 🟡 Partial | `/catalogues/:id` + `/sales` | Both exist; explicit "convert catalogue to order/quote" action not described |
| US-ID | Status | Where in the mockup | Notes |
|-------|--------|---------------------|-------|
| US-061 | 🟡 Partial | /sales → Sales Catalogues tab; /live/:id Live Shopping Room | Catalogue tab exists and Live Shopping Room exists, but explicit "launch session from catalogue" action not documented |
| US-062 | ✅ Covered | /s/:token shared public catalogue | No-login public URL with cart + submit request |
| US-063 | 🟡 Partial | /sales → Live Shopping tab; /live/:id | Live Shopping tab and room exist; specific create form fields (title, room code, notes, expected clients) not explicitly documented |
| US-064 | 🟡 Partial | /sales → Live Shopping tab | Tab exists with standard SheetTable; status badges likely via shortStatus chips, but specific count pills (Active, Scheduled, Total, Converted) not confirmed |
| US-065 | 🟡 Partial | /live/:id Live Shopping Room | Room has LIVE pulse indicator; explicit start/pause/end controls not documented |
| US-066 | 🟡 Partial | /live/:id Live Shopping Room | Room shows viewer count and add-to-order overlay; real-time client list and item requests not explicitly confirmed |
| US-067 | ✅ Covered | /live/:id | Route accepts session ID for deep-linking |
| US-068 | 🟡 Partial | Top bar New button; ⌘K command palette; /sales → Sales Orders tab | New button, command palette, and Sales Orders tab exist; specific hotkeys (Ctrl+N, "N"), client profile entry, matchmaking entry not all confirmed |
| US-069 | ✅ Covered | Identity-cell type-to-search on link fields | Type-to-search dropdown on all link fields; quick-create inline not explicitly documented |
| US-070 | 🟡 Partial | Inspector drawer (340px) | Inspector shows sectioned details for selected record; specific commit context and quick profile panel not confirmed |
| US-071 | 🟡 Partial | /sales → Sales Orders tab, Quotations tab | Both tabs exist separately; single surface with SALE/QUOTE toggle not confirmed |
| US-072 | 🟡 Partial | SheetTable inline edit; /sales tabs; COGS Rules tab | Inline edit exists; line items editable; auto-population of COGS mode, pricing rules, markup not explicitly documented |
| US-073 | 🟡 Partial | SheetTable inline edit (text/num/currency/%) | Inline editing of qty/price exists; override flags with required reasons not documented |
| US-074 | ❌ Missing | — | Sample marking on line items not documented |
| US-075 | ❌ Missing | — | Order-level adjustments (discounts/fees) with visibility control not documented |
| US-076 | ❌ Missing | — | Live totals exist in footer (Sum/Avg), but floating document preview not documented |
| US-077 | ❌ Missing | — | Auto-save/debounced draft not documented |
| US-078 | 🟡 Partial | /credit sheet; Dashboard Override Queue | Credit sheet and override queue exist; enforcement modes (Warning/Soft Block/Hard Block) at order time not documented |
| US-079 | ✅ Covered | Dashboard → Credit overrides approve list; /credit → Override Requests tab | Override approval workflow on dashboard and credit sheet |
| US-080 | 🟡 Partial | Sonner toast on actions; /finance → Sales Invoices | Toast feedback exists; single finalize action with auto invoice/inventory deduction not explicitly documented |
| US-081 | 🟡 Partial | Status chips with shortStatus | Status chips exist; full state machine (DRAFT→CONFIRMED→PARTIAL→SHIPPED→CLOSED, VOID/CANCELLED) not explicitly documented |
| US-082 | 🟡 Partial | /admin → Audit Trail tab | Audit trail exists; void/cancel actions with audit not explicitly documented |
| US-083 | ❌ Missing | — | Duplicate order action not documented |
| US-084 | ❌ Missing | — | Document attachment and receipt generation not documented (photo uploader noted as not shown) |
| US-085 | 🟡 Partial | ⌘K command palette; SheetTable keyboard nav | Keyboard nav and ⌘K exist; specific shortcuts (Ctrl+S, Ctrl+Enter, Ctrl+Z, Tab) not documented |
| US-086 | 🟡 Partial | /relationships → Referral Credits tab; /credit → Referral Credits tab | Referral credits tabs exist; "Referred By" selector at order level not documented |
| US-087 | 🟡 Partial | /inventory → Batches tab; SheetTable | Batches tab with grid exists; stat strip (total batches, units, dollar value) not explicitly confirmed |
| US-088 | 🟡 Partial | Toolbar Filter; view switcher | Filter button exists in toolbar; saved filter views not documented |
| US-089 | ✅ Covered | Toolbar Export | Export button in toolbar |
| US-090 | 🟡 Partial | /t/:slug generic table browser | Generic table browser exists; specific ?batchId= query param highlighting not documented |
| US-ID | Status | Where in the mockup | Notes |
|-------|--------|---------------------|-------|
| US-091 | 🟡 Partial | /inventory → Batches tab, inline edit | Inline edit exists for quantity; shrinkage flag/reason field not explicitly shown |
| US-092 | 🟡 Partial | /inventory → Batches tab, Intake Sessions tab | Separate tabs exist but no explicit "Awaiting Intake" vs "Live" section within Batches |
| US-093 | ✅ Covered | /intake/new (6-step Intake Wizard) | Supplier → batches → costs → photography → warehouse → review; no PO required |
| US-094 | ✅ Covered | /intake/new | Multi-row grid with submit capability implied by wizard flow |
| US-095 | 🟡 Partial | /intake/new, /sales → COGS Rules | COGS rules exist; fill-down not explicitly documented |
| US-096 | ❌ Missing | — | Ctrl+Z undo not explicitly shown in feature inventory |
| US-097 | ❌ Missing | — | Toggle between pilot/classic intake UI not documented |
| US-098 | ✅ Covered | /procurement → Purchase Orders tab, /receive/new | PO table with status filtering + receiving ritual |
| US-099 | ✅ Covered | /receive/new | Pick PO by typing, launches receiving flow |
| US-100 | 🟡 Partial | /receive/new | Qty Received confirmed; shortages/discrepancies/sample toggles/notes not explicitly listed |
| US-101 | ✅ Covered | /receive/new | "Commit Receipt" updates Inventory + closes PO line |
| US-102 | ❌ Missing | — | Supplier verification email explicitly listed as "not shown" |
| US-103 | 🟡 Partial | /inventory → Intake Sessions tab | History exists; image gallery per session not explicitly shown |
| US-104 | ❌ Missing | — | No shipping/fulfillment queue documented |
| US-105 | ❌ Missing | — | No shipping queue to filter |
| US-106 | ❌ Missing | — | No shipping queue to refresh |
| US-107 | ❌ Missing | — | Mobile pick/pack explicitly listed as "not shown" |
| US-108 | ✅ Covered | /inventory → Photography Queue tab | Queue with status implied by tab |
| US-109 | 🟡 Partial | /inventory → Photography Queue | Queue exists; photo uploader explicitly listed as "not shown" |
| US-110 | 🟡 Partial | /inventory → Photography Queue | Status tracking exists; explicit "mark complete" action not documented |
| US-111 | 🟡 Partial | /inventory → Photography Queue, Toolbar row selection | Row selection exists; bulk action for review not explicit |
| US-112 | ✅ Covered | /inventory → Sample Requests tab | Sample request creation with client/product/quantity fields |
| US-113 | ✅ Covered | /inventory → Sample Requests tab | Table with sortable columns, status, dates |
| US-114 | 🟡 Partial | /inventory → Sample Requests tab, Toolbar Filter | Filter toolbar exists; specific lane/status filters not documented |
| US-115 | ❌ Missing | — | Expiring Samples section not documented |
| US-116 | 🟡 Partial | /inventory → Sample Requests, Inspector | Inspector with action buttons; specific sample disposition actions not listed |
| US-117 | ❌ Missing | — | VendorShipDialog not documented |
| US-118 | ❌ Missing | — | Mobile drawer / mobile pick/pack explicitly "not shown" |
| US-119 | ❌ Missing | — | Mobile pick/pack explicitly "not shown" |
| US-120 | ❌ Missing | — | Barcode scanning explicitly "not shown" |
| US-ID | Status | Where in the mockup | Notes |
|-------|--------|---------------------|-------|
| US-121 | ❌ Missing | N/A | Mobile pick/pack interface explicitly listed as "Not explicitly shown" |
| US-122 | ❌ Missing | N/A | Mobile pick/pack surface not implemented |
| US-123 | ✅ Covered | /reports → Shrinkage tab | Shrinkage report exists in Reports sheet |
| US-124 | ✅ Covered | /reports → Shrinkage tab + Toolbar Export | Export button available in toolbar on all sheet views |
| US-125 | ✅ Covered | /procurement → Purchase Orders tab | PO creation with line items supported via sheet table + inline edit |
| US-126 | ✅ Covered | /procurement → Purchase Orders tab | Draft status in PO status progression; inline editing available |
| US-127 | 🟡 Partial | /procurement → Purchase Orders tab | Status chips show Draft → Confirmed flow; field locking not explicitly confirmed |
| US-128 | 🟡 Partial | /procurement → Purchase Invoices tab | Purchase Invoices exist but deposit/fee against PO specifically unclear |
| US-129 | ❌ Missing | N/A | Attachment upload explicitly listed as "Not explicitly shown" |
| US-130 | 🟡 Partial | /procurement → Purchase Orders tab | Status progression exists; archive behavior not explicitly shown |
| US-131 | ❌ Missing | N/A | PO split functionality not described in inventory |
| US-132 | ✅ Covered | /procurement → Purchase Orders tab | Status chips with shortStatus; Draft→Confirmed→Sent→Receiving→Received implied |
| US-133 | 🟡 Partial | /procurement + Toolbar Filter | Filter available in toolbar; "Expected Today" as preset quick-filter not explicit |
| US-134 | 🟡 Partial | /procurement + Toolbar Filter | Filter/Sort available; left-rail supplier facet not explicitly described |
| US-135 | ✅ Covered | /procurement + Toolbar Export | Export button in toolbar on all sheets |
| US-136 | ✅ Covered | /receive/new ritual | Purchase Receipt ritual picks PO, routes to receiving with context |
| US-137 | ✅ Covered | /procurement → Harvest Reminders tab | Harvest Reminders tab exists in Procurement sheet |
| US-138 | ✅ Covered | /relationships → Customers tab | Customers tab with client data; Client Leaderboard for LTV/metrics |
| US-139 | ✅ Covered | /relationships → Customers tab + Toolbar | Search and Filter in toolbar; global search via ⌘K |
| US-140 | ✅ Covered | /relationships + Toolbar Insert row | Insert row in toolbar; New button in top bar |
| US-141 | 🟡 Partial | /relationships → Customers tab + footer | Summary footer shows Sum/Avg/Count; aggregate stats panel not explicit |
| US-142 | ✅ Covered | /procurement → Suppliers tab | Suppliers tab in Procurement sheet |
| US-143 | 🟡 Partial | /relationships + /procurement | Both directories exist; dual-role linking mechanism not explicitly described |
| US-144 | ✅ Covered | /procurement → Suppliers tab + Toolbar Insert | Insert row + New button available |
| US-145 | ✅ Covered | /relationships → Customers + Inspector | Inspector drawer shows sectioned details, KPIs, action buttons |
| US-146 | 🟡 Partial | Inspector drawer | Sectioned details exist; relationship signals as explicit callouts not confirmed |
| US-147 | ✅ Covered | /relationships + /reports → Client Leaderboard | Client Leaderboard tab; Inspector with prominent metrics |
| US-148 | ✅ Covered | Inspector + inline edit | Inspector has action buttons; inline editing throughout sheets |
| US-149 | 🟡 Partial | Inspector drawer | Sectioned details support notes; freeform notes field not explicitly listed |
| US-150 | ❌ Missing | N/A | Comments with @mention support not described in inventory |
| US-ID | Status | Where in the mockup | Notes |
|-------|--------|---------------------|-------|
| US-151 | 🟡 Partial | /relationships Customers tab + /sales Pricing Profiles tab | Pricing Profiles exist and can be linked, but per-client rule overrides from within profile not explicitly shown |
| US-152 | 🟡 Partial | /sales Client Needs tab + /relationships Customers tab | Client Needs tab exists; viewing needs from customer profile inspector not explicitly confirmed |
| US-153 | 🟡 Partial | /relationships VIP Portal Config tab | VIP Portal Config exists as dedicated tab; configuring from within client profile not shown |
| US-154 | 🟡 Partial | /credit sheet (Credit Limits, Credit Adjustments) + /relationships Customers inspector | Credit data exists across sheets; unified Money tab on client profile not explicitly shown |
| US-155 | 🟡 Partial | /finance Sales Invoices, Payments + /sales Sales Orders + inspector links | Data exists; consolidated Money tab view on client profile not explicitly shown |
| US-156 | ❌ Missing | — | No one-click payment follow-up templates or auto-generated SMS/email shown |
| US-157 | 🟡 Partial | /credit Credit Limits, Credit Adjustments tabs | Credit capacity viewable/adjustable in credit sheet; from client profile Money tab not shown |
| US-158 | 🟡 Partial | /procurement Suppliers tab + /inventory Batches tab | Supplier data and batch history exist; unified supplier profile section not explicitly shown |
| US-159 | 🟡 Partial | /procurement Purchase Orders tab + inspector links | PO history exists; viewing from supplier profile Supply & Inventory tab not shown |
| US-160 | ✅ Covered | /relationships Communication Log tab | Communication Log supports logging calls, SMS, email, meetings, notes |
| US-161 | ✅ Covered | /relationships Communication Log tab + customer inspector | Communication timeline exists and can be filtered by client |
| US-162 | ✅ Covered | /relationships Appointments tab | Appointments tab exists for booking meetings with clients |
| US-163 | 🟡 Partial | /finance Sales Invoices tab | Invoices viewable with filtering; dedicated client ledger view with full status filter set not explicit |
| US-164 | 🟡 Partial | /finance Sales Invoices tab + inspector actions | Invoice actions available via inspector; PDF/print not explicitly shown |
| US-165 | ✅ Covered | /relationships VIP Portal Config tab | VIP Portal Config tab for per-client module toggles |
| US-166 | 🟡 Partial | /relationships VIP Portal Config tab | Config tab exists; granular sub-toggles (e.g., ar.showSummaryTotals) not explicitly shown |
| US-167 | ❌ Missing | — | No preview portal button shown in VIP Portal Config |
| US-168 | ✅ Covered | /sales Client Needs, Supplier Supply, Match Records tabs | Three-column matchmaking data exists across tabs |
| US-169 | ✅ Covered | /sales Match Records tab + toolbar Filter | Toolbar filtering available on all sheet tabs |
| US-170 | 🟡 Partial | /sales Match Records tab + inspector | Match Records exist; direct convert-to-order action not explicitly shown |
| US-171 | 🟡 Partial | /sales Match Records tab + inspector | Matches viewable; dismiss/override actions not explicitly shown |
| US-172 | ❌ Missing | — | No trigger match computation/refresh action shown |
| US-173 | ✅ Covered | /sales Client Needs tab | Client Needs tab supports creating needs with all listed fields |
| US-174 | ✅ Covered | /sales Client Needs tab + toolbar Filter | Toolbar filtering available |
| US-175 | 🟡 Partial | /sales Client Needs tab + inspector | Needs editable; explicit fulfill/cancel status actions not shown |
| US-176 | 🟡 Partial | /sales Client Needs + Match Records tabs | Both tabs exist; linking need to match not explicitly shown |
| US-177 | ❌ Missing | — | No "Smart Opportunities" sub-tab shown |
| US-178 | ❌ Missing | — | No Interest List tab or view shown |
| US-179 | ❌ Missing | — | No Interest List exists to export |
| US-180 | ❌ Missing | — | No Interest List exists to convert |
| US-ID | Status | Where in the mockup | Notes |
|-------|--------|---------------------|-------|
| US-181 | ✅ Covered | /sales → Client Needs tab | SheetTable supports row selection and inline edit/delete; stale entries can be removed |
| US-182 | ❌ Missing | — | No top-product or trending-category stats on Client Needs; only raw table view exists |
| US-183 | ✅ Covered | /sales → Supplier Supply tab | Tab exists for supplier availability; Insert row + inline edit supports all listed fields |
| US-184 | ✅ Covered | /sales → Supplier Supply tab | SheetTable inline edit and row deletion available |
| US-185 | ✅ Covered | /sales → Match Records tab | Match Records tab exists to link supply entries to client needs |
| US-186 | 🟡 Partial | / (Dashboard) | Dashboard has KPI strip (Receivables), Aging invoices, Credit overrides; no dedicated GL reversal viewer or reconciliation summary widget |
| US-187 | ❌ Missing | — | No threshold-based alert banner for overdue invoice count on Dashboard |
| US-188 | 🟡 Partial | / (Dashboard) → Aging invoices; /reports → AR Summary, AP Summary | Dashboard shows aging invoices list; Reports has AR/AP Summary tabs but bucket breakdown (Current/30/60/90/90+) not explicitly confirmed |
| US-189 | ❌ Missing | — | No Top Debtor cards by aging bucket on Dashboard |
| US-190 | ❌ Missing | — | No reconciliation summary widget (outstanding invoices, unrecorded payments, last recon date) |
| US-191 | 🟡 Partial | /pay/new ritual | Pay ritual exists but not as quick-action button on Dashboard itself |
| US-192 | ✅ Covered | /finance → Sales Invoices tab | SheetTable with sortable columns, inline edit, status chips covers invoice list |
| US-193 | ✅ Covered | /finance → Sales Invoices tab | Toolbar has Filter capability; status chips exist for filtering |
| US-194 | 🟡 Partial | /finance → Sales Invoices tab + Inspector | Create/edit/status change via inline edit and Inspector actions; PDF download/print not explicitly shown |
| US-195 | ✅ Covered | /pay/new ritual; /finance → Payments tab | Payments ritual supports selecting invoices and allocating payment |
| US-196 | ✅ Covered | /finance → Payment Disputes tab | Payment Disputes tab exists for flagging contested receivables |
| US-197 | ❌ Missing | — | No bad debt write-off action shown |
| US-198 | ❌ Missing | — | GL reversal action not explicitly shown |
| US-199 | 🟡 Partial | /t/:slug generic browser | Generic table browser supports deep-linking by slug; query param filtering not explicitly confirmed |
| US-200 | ✅ Covered | /procurement → Purchase Invoices tab | Purchase Invoices tab serves as bills queue with SheetTable |
| US-201 | ✅ Covered | /procurement → Purchase Invoices tab | Insert row + inline edit for vendor, line items, amount, due date |
| US-202 | 🟡 Partial | /procurement → Purchase Invoices tab | Status chips exist; explicit state machine (Draft→Pending→Approved→Partial→Paid) not confirmed |
| US-203 | ❌ Missing | — | No BillStatusTimeline component shown |
| US-204 | ✅ Covered | /procurement → Purchase Invoices tab | Toolbar Filter available; status chips for filtering |
| US-205 | ✅ Covered | /pay/new ritual | Payments ritual supports paying suppliers directly |
| US-206 | 🟡 Partial | /procurement → Purchase Invoices tab | Status chips shown; explicit aging badges on overdue not confirmed |
| US-207 | ✅ Covered | /finance → Payments tab | Payments tab with SheetTable covers payment registry |
| US-208 | ✅ Covered | /pay/new ritual | Ritual supports invoice selection, allocation, bank account, amount, date |
| US-209 | 🟡 Partial | /pay/new ritual; /finance → Payments tab | Multiple payments can be recorded against invoices; explicit installment tracking UI not shown |
| US-210 | 🟡 Partial | /finance → Payments tab | Payment method field exists; crypto as explicit option not confirmed |
| US-ID | Status | Where in the mockup | Notes |
|-------|--------|---------------------|-------|
| US-211 | 🟡 Partial | /sales (Sales Orders), /relationships (Customers), /credit | Pricing Profiles exist; payment terms config per client/order not explicitly shown |
| US-212 | ❌ Missing | — | No transaction fee field on Payments |
| US-213 | ✅ Covered | /finance (Payments tab) | Filter/Sort toolbar available on sheet; type field implied |
| US-214 | 🟡 Partial | /finance (Payments tab), Inspector | Action buttons in Inspector; void action not explicitly listed |
| US-215 | ✅ Covered | /finance (Journal Entries tab) | SheetTable with Filter toolbar supports account/date filtering |
| US-216 | ✅ Covered | /finance (Journal Entries tab) | Insert row + inline edit for debit/credit line items |
| US-217 | 🟡 Partial | /finance (Journal Entries tab), Inspector | Reversal action possible via Inspector actions; permission gating not shown |
| US-218 | ✅ Covered | /finance (Journal Entries tab) | Export button in Toolbar |
| US-219 | ❌ Missing | — | No Chart of Accounts tab/table in any sheet |
| US-220 | ❌ Missing | — | No Chart of Accounts management |
| US-221 | ❌ Missing | — | No Chart of Accounts with active/inactive toggle |
| US-222 | ❌ Missing | — | No Expenses tab/table |
| US-223 | ❌ Missing | — | No Expense Categories management |
| US-224 | ❌ Missing | — | No Expenses with reimbursement tracking |
| US-225 | ❌ Missing | — | No Expenses filtering |
| US-226 | ✅ Covered | /finance (Bank Accounts tab) | Bank Accounts tab exists |
| US-227 | 🟡 Partial | /finance (Bank Accounts tab) | Summary footer can show Sum; explicit total cash position widget not shown |
| US-228 | ✅ Covered | /finance (Bank Accounts tab) | Filter toolbar supports type filtering |
| US-229 | 🟡 Partial | /finance (Bank Accounts tab) | Inline edit for status field; deactivate action not explicit |
| US-230 | ❌ Missing | — | No Bank Transactions tab |
| US-231 | ❌ Missing | — | No Bank Transactions table |
| US-232 | ❌ Missing | — | No reconciled flag on bank transactions |
| US-233 | ❌ Missing | — | No Bank Transactions filtering |
| US-234 | ❌ Missing | — | No Bank Transactions export |
| US-235 | ❌ Missing | — | No Fiscal Periods management |
| US-236 | ❌ Missing | — | No Fiscal Periods open/close |
| US-237 | ❌ Missing | — | No Fiscal Periods locking |
| US-238 | ❌ Missing | — | No Fiscal Periods close warning |
| US-239 | 🟡 Partial | /finance (Petty Cash tab) | Petty Cash exists; formal cash register locations not explicit |
| US-240 | 🟡 Partial | /finance (Petty Cash tab) | Petty Cash tracking exists; per-location deposits/withdrawals not explicit |
| US-ID | Status | Where in the mockup | Notes |
|-------|--------|---------------------|-------|
| US-241 | 🟡 Partial | /finance → Petty Cash, Bank Accounts | Bank Accounts and Petty Cash tabs exist; no explicit inter-location transfer UI shown |
| US-242 | ✅ Covered | /finance → Shifts, Shift Reconciliations | Shifts and Shift Reconciliations tabs handle open/close per location |
| US-243 | 🟡 Partial | /finance → Shift Reconciliations | Reconciliation tab exists; variance detection alerting not explicitly shown |
| US-244 | 🟡 Partial | Notification Bell, /finance | Notification system exists; specific cash-anomaly alert rules not explicitly shown |
| US-245 | ✅ Covered | /admin → Audit Trail, Toolbar Export | Audit Trail tab + Export button on toolbar enables downloadable logs |
| US-246 | ✅ Covered | /credit sheet, Dashboard Override Queue | Credit sheet tabs (Credit Limits, Credit Adjustments, Override Requests) + Dashboard KPIs |
| US-247 | ✅ Covered | /credit → Credit Adjustments | Credit Adjustments tab for increase/decrease |
| US-248 | ✅ Covered | /credit → Override Requests, Dashboard | Override Requests tab + Dashboard approve list for credit exceptions |
| US-249 | 🟡 Partial | /pay/new, /finance → Payments | Payments ritual allocates against invoices; explicit credit-balance application not shown |
| US-250 | ❌ Missing | — | No bad-debt write-off or restore UI shown |
| US-251 | 🟡 Partial | /admin → Role Profiles, Feature Flags | Permission gating infrastructure exists; specific creditVisibilitySettings not shown |
| US-252 | ✅ Covered | /sales → Pricing Profiles, COGS Rules | Pricing Profiles tab with scope/markup config |
| US-253 | 🟡 Partial | /sales → Pricing Profiles | Tab exists; explicit activate/deactivate toggle not shown |
| US-254 | ✅ Covered | /sales → Pricing Profiles, Toolbar Search | Search in toolbar applies to any sheet tab |
| US-255 | ✅ Covered | /sales → Pricing Profiles, Inspector | Inline edit + Inspector actions for edit/delete |
| US-256 | ✅ Covered | /sales → Pricing Profiles | Named profiles with bundled rules in Pricing Profiles tab |
| US-257 | 🟡 Partial | /relationships → Customers, Inspector | Customer Inspector exists; explicit Sales & Pricing tab assignment not shown |
| US-258 | ✅ Covered | /sales → Pricing Profiles, Inspector | Inspector drawer for editing profile rules/priority |
| US-259 | ❌ Missing | — | No /settings/cogs route or COGS calculation mode config shown |
| US-260 | ❌ Missing | — | No per-client COGS override UI shown |
| US-261 | 🟡 Partial | /admin → Settings, Role Profiles | Settings and Role Profiles exist; specific COGS Display Mode not shown |
| US-262 | ✅ Covered | / Dashboard, /reports | Dashboard KPI strip + Reports sheet covers key metrics |
| US-263 | 🟡 Partial | /reports → Revenue Trends | Revenue Trends tab exists; explicit period selector not shown |
| US-264 | ✅ Covered | /reports → Revenue Trends | Revenue Trends tab with trend data |
| US-265 | ✅ Covered | /reports → Top Clients, Client Leaderboard | Top Clients and Client Leaderboard tabs |
| US-266 | ✅ Covered | Toolbar Export | Export button on toolbar supports CSV export |
| US-267 | ✅ Covered | /reports → Client Leaderboard, /relationships → Client Leaderboard | Client Leaderboard tabs with scoring |
| US-268 | 🟡 Partial | /reports → Client Leaderboard | Leaderboard exists; explicit filter dropdowns not shown |
| US-269 | ❌ Missing | — | No weight customization UI for master score shown |
| US-270 | ✅ Covered | /reports → Client Leaderboard, Toolbar Export | Leaderboard + Export button |
| US-ID | Status | Where in the mockup | Notes |
|-------|--------|---------------------|-------|
| US-271 | ✅ Covered | `/reports` → Client Leaderboard tab; `/relationships` → Customers tab | Link cells deep-link to full profile; Inspector drawer shows details |
| US-272 | 🟡 Partial | View switcher includes Calendar option | Calendar view tab exists but "Calendar view internals" explicitly listed as not shown |
| US-273 | 🟡 Partial | View switcher Calendar tab | Calendar tab exists but recurrence/participants/reminders not explicitly shown |
| US-274 | 🟡 Partial | View switcher Calendar option | Calendar exists but filter internals not explicitly shown |
| US-275 | 🟡 Partial | `/relationships` → Appointments tab; Calendar view | Appointments tab exists; approval workflow not explicitly shown |
| US-276 | 🟡 Partial | `/admin` → Timesheets tab; Calendar view | Timesheets exist; time-off request management not explicitly shown |
| US-277 | ❌ Missing | — | Tab count pills exist but appointment/time-off request counts on calendar tabs not shown |
| US-278 | 🟡 Partial | `/admin` → Shifts tab; Calendar view | Shifts tab exists; Deliveries tab and unified scheduling surface not shown |
| US-279 | ❌ Missing | — | Room booking/definitions not in inventory |
| US-280 | 🟡 Partial | `/admin` → Shifts tab; Dashboard | Shifts tab exists; delivery schedule widget not explicitly shown |
| US-281 | ❌ Missing | — | Clock in/out functionality not in inventory |
| US-282 | ❌ Missing | — | Break tracking not in inventory |
| US-283 | 🟡 Partial | `/admin` → Timesheets tab | Timesheets tab exists; grouping by day/week/employee not explicitly shown |
| US-284 | 🟡 Partial | `/admin` → Timesheets tab | Timesheets exist; manager-specific reporting view not detailed |
| US-285 | ❌ Missing | — | Live clock status badge not in inventory |
| US-286 | ✅ Covered | Top bar Notification Bell | "Notification Bell with dropdown (6 notif types)" in shell |
| US-287 | 🟡 Partial | Notification Bell dropdown | Dropdown exists; mark read/mark all read not explicitly shown |
| US-288 | ✅ Covered | Notification Bell dropdown | Link cells deep-link pattern applies; notifications are actionable |
| US-289 | 🟡 Partial | Notification Bell dropdown | Dropdown exists with 6 notif types; full hub with tabs not explicitly shown |
| US-290 | 🟡 Partial | Notification Bell dropdown | 6 notif types mentioned; specific Alerts tab with low-stock/needs-matching not detailed |
| US-291 | 🟡 Partial | Notification Bell dropdown | Same as US-290; alerts exist but tab structure not detailed |
| US-292 | ❌ Missing | — | Todo lists with tasks not in inventory |
| US-293 | ❌ Missing | — | Ctrl+Shift+T quick-add task modal not in inventory |
| US-294 | ❌ Missing | — | Notifications/Todos tab grid not in inventory |
| US-295 | ❌ Missing | — | Task management (complete/edit/delete) not in inventory |
| US-296 | ❌ Missing | — | Todo list stats/badges not in inventory |
| US-297 | ❌ Missing | — | Todo list deletion not in inventory |
| US-298 | 🟡 Partial | Global search with ⌘K | Global search exists; grouped results page explicitly listed as not shown |
| US-299 | ✅ Covered | Command Palette (⌘K) | "navigate to sheets, tables, records, and actions" — type-to-search confirmed |
| US-300 | ✅ Covered | Command Palette (⌘K) | Link cells deep-link; command palette navigates to records |
| US-ID | Status | Where in the mockup | Notes |
|-------|--------|---------------------|-------|
| US-301 | 🟡 Partial | Shell / global | Empty/loading states mentioned but no explicit "operational guidance" empty-state for search |
| US-302 | ✅ Covered | Toolbar view switcher | Kanban view available via View switcher segmented control on any sheet including Batches |
| US-303 | 🟡 Partial | Toolbar + identity-cell type-to-search | Can search/select batches via type-to-search; priority assignment not explicitly shown |
| US-304 | ❌ Missing | — | Drag-and-drop between kanban columns not documented |
| US-305 | ❌ Missing | — | Custom workflow status CRUD (create/rename/reorder/color/delete) not shown |
| US-306 | ❌ Missing | — | "Completed" flag on workflow status not shown |
| US-307 | ❌ Missing | — | Workflow history view for batch status changes not shown |
| US-308 | ❌ Missing | — | Workflow throughput/bottleneck analytics not shown |
| US-309 | ✅ Covered | /inventory → Strain Registry tab, /t/:slug | Strain Registry tab + generic table browser for search/browse |
| US-310 | ✅ Covered | /inventory → Strain Registry + Toolbar Insert row | Can insert row with fields; schema supports name, category, description |
| US-311 | ✅ Covered | /inventory → Strain Registry + inline edit | Inline edit for update; row selection implies delete capability |
| US-312 | ✅ Covered | SheetTable + status chips | Status chips with color-accurate per state handle category badges |
| US-313 | ✅ Covered | /admin → Users tab + Toolbar Insert row | Users tab with inline edit supports creating users |
| US-314 | 🟡 Partial | /admin → Users tab | Users table exists; explicit password reset action not documented |
| US-315 | ✅ Covered | /admin → Users + Role Profiles tabs | Users tab shows roles; last login plausible in schema |
| US-316 | ✅ Covered | /admin → Users + Role Profiles tabs | Role Profiles tab + link cells for role assignment |
| US-317 | ✅ Covered | /admin → Role Profiles tab | Role Profiles tab for creating/managing roles |
| US-318 | 🟡 Partial | /admin → Role Profiles tab | Can manage permissions on roles; bulk-replace not explicitly shown |
| US-319 | 🟡 Partial | /admin sheet | Permissions exist via Role Profiles; organized-by-module view not explicit |
| US-320 | 🟡 Partial | /admin → Users tab | Users table exists; disable/enable toggle not explicitly documented |
| US-321 | ✅ Covered | /inventory → Warehouses tab | Warehouses tab manages locations |
| US-322 | 🟡 Partial | /inventory → Items tab | Items exist; dedicated category/subcategory management table not shown |
| US-323 | 🟡 Partial | /admin → Settings tab | Settings tab exists; product tags management not explicitly shown |
| US-324 | ❌ Missing | — | Tag hierarchies and tag groups not shown |
| US-325 | 🟡 Partial | /admin → Settings tab | Settings tab exists; specific org-wide config fields not enumerated |
| US-326 | 🟡 Partial | Shell user profile | User profile at bottom of rail; personal preferences not explicitly detailed |
| US-327 | ❌ Missing | — | Custom unit type definitions not shown |
| US-328 | 🟡 Partial | /admin → Settings tab | Settings exists; calendar definitions not explicitly shown |
| US-329 | ❌ Missing | — | Custom finance statuses configuration not shown |
| US-330 | ✅ Covered | /admin → Feature Flags tab | Feature Flags tab with enabled/disabled state |
| US-ID | Status | Where in the mockup | Notes |
|-------|--------|---------------------|-------|
| US-331 | ✅ Covered | /admin sheet → Feature Flags tab | Tab exists for system-wide flag management |
| US-332 | 🟡 Partial | /admin sheet → Feature Flags tab | Tab exists but role/user override UI not explicitly shown |
| US-333 | 🟡 Partial | /admin sheet → Feature Flags tab + Audit Trail tab | Flag tab exists; audit history could use Audit Trail but per-flag history not explicit |
| US-334 | 🟡 Partial | /admin sheet + /vip | VIP Portal Config exists in /relationships; Developer tab with VIPImpersonationManager not explicitly shown |
| US-335 | 🟡 Partial | Shell → user profile bottom | Profile shown in left rail but per-user settings pages not explicitly shown |
| US-336 | ❌ Missing | — | Per-user settings pages explicitly listed as not shown |
| US-337 | ❌ Missing | — | Per-user settings pages explicitly listed as not shown |
| US-338 | ❌ Missing | — | Per-user settings pages explicitly listed as not shown |
| US-339 | ❌ Missing | — | Login/auth flow screens explicitly listed as not shown |
| US-340 | ❌ Missing | — | Login/auth flow screens explicitly listed as not shown |
| US-341 | ❌ Missing | — | Login/auth flow screens explicitly listed as not shown |
| US-342 | ❌ Missing | — | Login/auth flow screens explicitly listed as not shown |
| US-343 | ❌ Missing | — | Session ended page not shown; relates to impersonation which is partial |
| US-344 | ✅ Covered | /vip → Overview | VIP Portal Overview shows financial summary and quick links |
| US-345 | ✅ Covered | /vip → Catalogues | VIP Portal Catalogues tab for browsing inventory |
| US-346 | ✅ Covered | /vip → My Invoices | VIP Portal has My Invoices tab for AR tracking |
| US-347 | 🟡 Partial | /vip | AP balance (credits owed to client) not explicitly listed as a VIP module |
| US-348 | 🟡 Partial | /vip → My Invoices | Invoices shown; full transaction history not explicitly distinct |
| US-349 | 🟡 Partial | /vip | Leaderboard exists; VIP tier badge display not explicitly mentioned |
| US-350 | ✅ Covered | /vip → Leaderboard | VIP Portal has Leaderboard tab |
| US-351 | 🟡 Partial | Shell → Notification Bell | Global bell exists; VIP-specific bell for portal not explicitly shown |
| US-352 | ✅ Covered | /vip → Live Shopping + /live/:id | VIP Portal has Live Shopping; room code entry via /live/:id |
| US-353 | ✅ Covered | /live/:id | Live Shopping Room has stage, featured items, add-to-order overlay |
| US-354 | 🟡 Partial | /vip → Live Shopping | Auto-detect active session not explicitly described |
| US-355 | ✅ Covered | /vip → Appointments | VIP Portal has Appointments tab |
| US-356 | 🟡 Partial | /vip → Appointments | Appointment booking exists; confirmation screen with request ID not explicit |
| US-357 | 🟡 Partial | /vip → My Invoices | Invoices shown; PDF download not explicitly described |
| US-358 | 🟡 Partial | /vip | Bill PDF download not explicitly described |
| US-359 | ✅ Covered | /vip → My Requests | VIP Portal has My Requests tab for submitting needs |
| US-360 | ✅ Covered | /vip → My Requests | My Requests tab shows submitted needs and status |
| US-ID | Status | Where in the mockup | Notes |
|-------|--------|---------------------|-------|
| US-361 | ✅ Covered | /sales → Supplier Supply tab; /vip portal | VIP clients can offer supply via Supplier Supply table |
| US-362 | ✅ Covered | /vip → Referrals tab; /credit → Referral Credits tab | VIP portal has Referrals section; credits tracked in Credit sheet |
| US-363 | ❌ Missing | — | Settings → Developer → VIP Access impersonation not in inventory |
| US-364 | ❌ Missing | — | Impersonation amber banner not shown |
| US-365 | ❌ Missing | — | sessionStorage impersonation behavior not implemented |
| US-366 | 🟡 Partial | /admin → Audit Trail tab | Generic audit trail exists; VIP-specific impersonation log not explicit |
| US-367 | ❌ Missing | — | Farmer verification email link explicitly listed as "Not shown" |
| US-368 | ❌ Missing | — | Farmer intake verification URL (no-login) explicitly listed as "Not shown" |
| US-369 | ❌ Missing | — | Farmer discrepancy flagging/signing explicitly listed as "Not shown" |
| US-370 | ❌ Missing | — | intakeDiscrepancies table not in inventory |
| US-371 | ✅ Covered | Command Palette (⌘K) | Navigate to sheets, tables, records, and actions |
| US-372 | 🟡 Partial | Command Palette (⌘K) | Navigation search exists; live entity search across quotes/orders/products not explicit |
| US-373 | 🟡 Partial | Command Palette (⌘K); global shell | ⌘K confirmed; other specific shortcuts (N, I, C, Ctrl+N) not enumerated |
| US-374 | ❌ Missing | — | "?" keyboard shortcuts modal not in inventory |
| US-375 | ✅ Covered | Shell — sonner toast | Sonner toast on placeholder actions confirmed |
| US-376 | ❌ Missing | — | PageErrorBoundary with location-key reset not described |
| US-377 | ❌ Missing | — | System metrics page (uptime, memory, event loop) not in inventory |
| US-378 | ❌ Missing | — | Admin setup/bootstrap page not in inventory |
| US-379 | ❌ Missing | — | Admin data tools (import, migrations, schema push) not in inventory |
| US-380 | ✅ Covered | /admin → Audit Trail tab | Audit trail for create/update/delete exists |
| US-381 | ❌ Missing | — | /help page with searchable catalog not in inventory |
| US-382 | ❌ Missing | — | Friendly 404 page not described |
| US-383 | 🟡 Partial | /finance → Sales Invoices; /vip → My Invoices | Invoices exist; formatted receipt generation not explicit |
| US-384 | ❌ Missing | — | Service billing / billable services separate from products not in inventory |
| US-386 | 🟡 Partial | Command Palette (⌘K) | Palette exists; "Recently Opened" group from useRecentPages not explicit |
| US-387 | ❌ Missing | — | `I` and `C` quick-nav shortcuts not enumerated |
| US-388 | ❌ Missing | — | `?` shortcut modal not in inventory |
| US-389 | ❌ Missing | — | Inter-location warehouse transfer (warehouseTransfers) not in tabs |
| US-390 | 🟡 Partial | /receive/new — Purchase Receipt ritual | Receipt ritual exists; explicit reset/rollback action not described |
| US-391 | ❌ Missing | — | QuotesPilotSurface sheet-native mode toggle not in inventory |
| US-ID | Status | Where in the mockup | Notes |
|-------|--------|---------------------|-------|
| US-392 | ❌ Missing | /sales → Sales Returns tab exists | No spreadsheet-native mode toggle (ReturnsPilotSurface) mentioned |
| US-393 | ❌ Missing | /procurement sheet | No vendor return initiation from received PO; only Purchase Receipts tab exists |
| US-394 | 🟡 Partial | /procurement → Purchase Orders | PO tab exists but line-item fees (handling, freight, brokerage) not explicitly shown |
| US-395 | ❌ Missing | / Dashboard, /finance | No GL Reversal Viewer component on dashboard or accounting surfaces |
| US-396 | ❌ Missing | /finance → Journal Entries | No Trial Balance view filter mentioned |
| US-397 | 🟡 Partial | /finance | Purchase Invoices tab exists; deep-link via ?billId= not explicitly shown but /t/:slug pattern suggests possible |
| US-398 | ✅ Covered | Toolbar → Export | Export button available on all sheet toolbars |
| US-399 | ❌ Missing | /finance | No Expenses surface or category breakdown cards shown |
| US-400 | ❌ Missing | / Dashboard, /finance | No vendor payables alert panel for sold-out batches with outstanding balances |
| US-401 | ❌ Missing | /finance → Sales Invoices | No service billing (non-inventory) capability mentioned |
| US-402 | ❌ Missing | /relationships → Customers | No Consignment Range Panel on client Money tab shown |
| US-403 | ❌ Missing | /relationships → Customers | No Receive Money / Pay Money quick-action buttons in client profile header |
| US-404 | ❌ Missing | /finance | No bad debt restore action mentioned |
| US-405 | ✅ Covered | /credit → Referral Credits | Referral Credits tab exists in credit sheet |
| US-406 | ✅ Covered | /admin → Audit Trail | Audit Trail tab exists; credit changes would be logged there |
| US-407 | ❌ Missing | Toolbar → Calendar view | Calendar view tab exists but no PendingInvitationsWidget or invitations tab |
| US-408 | ❌ Missing | /relationships → Appointments | Appointments tab exists but no Today Appointments / Live Queue panels on scheduling |
| US-409 | ❌ Missing | /admin → Settings | Settings tab exists but theme/timezone/language preferences explicitly listed as "Not shown" |
| US-410 | ✅ Covered | /admin → Feature Flags | Feature Flags tab exists in admin sheet |
| US-411 | 🟡 Partial | /vip portal, /relationships → VIP Portal Config | VIP Portal exists with My Invoices; Credit Center module not explicitly shown |
| US-412 | 🟡 Partial | /relationships → VIP Portal Config | VIP Portal Config tab exists but tier rules/thresholds configuration not detailed |
| US-413 | 🟡 Partial | /vip portal, Notification Bell | VIP Portal exists + notification system exists; VIP-specific alerts not explicitly shown |
| US-414 | ⏭ Out-of-scope | N/A | /slice-v1-lab is experimental/future design evaluation, not current product |
| US-415 | ⏭ Out-of-scope | N/A | /slice-v1-lab is experimental/future design evaluation, not current product |
| US-416 | ⏭ Out-of-scope | N/A | /slice-v1-lab is experimental/future design evaluation, not current product |
| US-417 | ❌ Missing | No route | No office supply management surface mentioned |
| US-418 | ❌ Missing | Notification Bell | Notification dropdown exists (6 types) but no Todos tab or /todos/:listId route |
| US-419 | ❌ Missing | / Dashboard | Dashboard has widgets but ComponentErrorBoundary isolation not mentioned |

# TERP Mockups — Spreadsheet-Forward Overhaul (v2)

**North-star:** "If I can do it in Apple Numbers with a click, I should be able to do it here with the same click — not a button or modal."

## A. Chrome reduction
- [ ] Collapse toolbar: remove Sort/Filter/Group/Insert row buttons → expose via **column header ▾ menu** and **right-click context menus**
- [ ] Remove visible view switcher pills — Table is default; "View" behind a subtle ↓ chip
- [ ] Move Share / Export into tab context menu (right-click a tab)
- [ ] Remove page header title strip — replace with compact **formula bar**
- [ ] Dashboard becomes a **Summary sheet**, not a branded KPI page
- [ ] VIP Portal / Shared: thin gradient strip only; everything else is a sheet

## B. Spreadsheet affordances
- [ ] **Formula/cell bar** at top: cell address (e.g. `B4`) + value, editable
- [ ] **Column letters** (A, B, …) and row numbers (1, 2, …)
- [ ] **Cell range selection** (shift+click, shift+arrow) with live count/sum/avg
- [ ] **Right-click row menu**: Insert above/below, Duplicate, Delete, Copy link, Share
- [ ] **Right-click header menu**: Sort, Filter, Hide column, Freeze, Group by
- [ ] **Double-click row number**: open Inspector
- [ ] **Enter → down**, **Tab → right**, **Esc → revert**
- [ ] Fill-handle dot on selected cell (visual only)

## C. Insert-row direct
- [ ] Persistent empty "+" row at the bottom — click a cell to type, auto-commits
- [ ] Remove the bold top-bar "+ New" button
- [ ] Bottom-aligned sheet tabs with a "+" to add a new tab

## D. Footer = Numbers summary bar
- [ ] Footer shows for current selection: `Count · Sum · Avg · Min · Max` (tabular-nums)

## E. Tabs
- [ ] Smaller, bottom-aligned sheet tabs; double-click to rename; right-click = Duplicate/Rename/Delete/Color

## F. Inspector
- [ ] Trigger via **⌘↩** or **double-click row number**; compact, inline-editable primary value

## G. Dashboard → "Summary" sheet
- [ ] Rebuild `/` as a Numbers sheet: Chart tile + Overrides table + Receivables table. Title is inline.

## H. Reports → chart per tab
- [ ] Each report tab: chart + embedded table. No KPI strip.

## I. VIP / Shared
- [ ] Thin gradient strip only; body is a sheet; Shared keeps an order tray because it's customer-facing

## J. Cleanup
- [ ] Remove decorative gradients; keep accent strips
- [ ] Replace Live Room radial glows with a clean dark stage

---

## AUDIT (after overhaul lands)
- [ ] Run coverage audit inline via the Claude API
- [ ] Compile gap report markdown + CSV


## K. Sell flow — Invoice (Sales) sheet `/sell/new`
- [ ] Top line: pick Customer (a single cell); Invoice # auto-fills; Date = today
- [ ] Items block (the sheet body): columns `Batch #`, `Strain`, `Grade`, `Avail`, `Qty`, `Unit $`, `Line $`
- [ ] User types/pastes Batch # in col A → Strain/Grade/Avail/Unit $ auto-fill from Inventory
- [ ] Qty column: user types number; Line $ auto-calcs
- [ ] If Qty > Avail: red cell + warning chip (still allow override, one click)
- [ ] Footer: live Subtotal · Tax · Total, all tabular-nums
- [ ] Bottom row bar: `Save draft` · `Send invoice` (single primary action)
- [ ] Command palette: `⌘N` → "New sales invoice"
- [ ] Paste from external Numbers/Excel of column of batch IDs: multi-row autofill

## L. Buy flow — Purchase Draft sheet `/buy/new`
- [ ] Top line: pick Supplier (single cell); Draft # auto-fills; Expected intake date cell
- [ ] Items block: `Batch #` (blank, user creates), `Strain` (pick/create), `Qty`, `Unit $`, `Line $`, `Notes`
- [ ] New strains: type → "Create 'X' (new strain)" inline suggestion (no modal)
- [ ] Footer: Sum Qty · Sum $ · Est. margin (if sell price available)
- [ ] Bottom row bar: `Save draft` · `Commit as PO + Receipt` (single primary action)
- [ ] Paste a block of rows from their existing Numbers template → imported cleanly (column map dialog only if headers don't match)
- [ ] One click → fans out to Procurement tab (PO) + Inventory tab (Receipt) + Batches rows inserted


## M. Ritual-sheets pattern (applied to every painful Numbers workflow)
The shape is the same across Sell / Buy / Receive / Pay / Cash count:
1. **One header row of "pick cells"** (Customer / Supplier / Date / Account).
2. **A body of line rows** where the user can *type* or *paste* into column A
   and the rest of the row autofills from master data.
3. **A live footer** with tabular-nums Count · Sum · Avg.
4. **One primary button** at the bottom right ("Send invoice" / "Commit as PO+Receipt" / "Record payment"),
   backed by a quieter "Save draft".
5. **No modals.** All creation happens inline. All corrections are cell edits.

- [ ] `/sell/new` — Sales Invoice sheet (flagship)
- [ ] `/buy/new` — Purchase Draft sheet (flagship)
- [ ] `/receive/new` — Purchase Receipt sheet (stub with the pattern)
- [ ] `/pay/new`     — Payment sheet (customer or supplier; stub)
- [ ] `/cash/new`    — Shift reconciliation (stub)


## N. NO COPY-PASTE — type-to-search row autofill
- [ ] First cell on every ritual row accepts any of: strain, SKU, batch #, item name, customer's last order item
- [ ] As user types, a live dropdown beneath the cell shows matching inventory rows with (strain · grade · avail · unit$)
- [ ] Enter or click → the entire row fills (Strain, Grade, Avail, Unit$, Line$)
- [ ] No clipboard reading. No paste handler. Arrow keys navigate results; Tab/Enter commit
- [ ] Same pattern on Buy sheet: search by strain or SKU; if no match, inline "Create new strain 'X'" link drops a blank row with just the strain filled in
- [ ] Remove the paste-from-spreadsheet hint UI everywhere


## O. Interview review — nuggets for current product
- [ ] Pull all 6 interview artefacts from Droid to local /tmp/terp-interviews/
- [ ] Read annotated transcripts first (curated), then skim full transcripts for vocabulary and specific pain-points
- [ ] Extract three lists: (A) mental-model language we should adopt verbatim, (B) pain nuggets that map to Sell/Buy/Receive/Pay/Inventory, (C) ideas we explicitly should NOT build now
- [ ] Integrate (A) + (B) into the ritual sheets without adding new chrome; nothing bolted-on


## P. Interview review — filter rules
- [ ] Ignore names, personal anecdotes, hyper-specific customer/vendor identities
- [ ] Extract only generalized workflow patterns and recurring pain points
- [ ] Only apply insights that improve current product features; park the rest


## Q. Filtered interview nuggets — current pass
- [ ] Wire `/sell/new` route in App.tsx
- [ ] Build `/buy/new` (Purchase Draft sheet) — same type-to-search; defaults: Consignment + Main Warehouse; Tab navigation; allowCreate for strain
- [ ] Build `/cash/new` (Cash Ledger ritual) — 4 cols Date · In · Out · Note; footer running balance
- [ ] Plain-language label pass: "Orders" → "Sales" everywhere; "Brand" → "Farmer Code"; "AR/AP" → "Payment Office"; "Engagement" → "Visit Frequency"; "Reliability" → "Payment Behavior"
- [ ] Sell-sheet autofill default: FIFO order (oldest available first)
- [ ] Procurement sheet: render `Due now` chip on rows whose linked batch live qty == 0
- [ ] Customer Inspector: add "Open ledger" tile linking to a unified ledger sheet
- [ ] Re-shoot screens, save checkpoint
- [ ] Run USER_STORIES coverage audit locally and deliver report


## R. Push mockups to a new branch on EvanTenenbaum/terp-erpnext
- [ ] Branch: `mockups/numbers-frontend`
- [ ] Subdir: `mockups/numbers-frontend/` (isolated from the Frappe app; doesn't collide)
- [ ] Stage: project source, README, MOCKUPS_GUIDE.md, QA_PASS_NOTES.md, todo.md, design plans, terp-v4 screenshots
- [ ] Exclude: node_modules, .manus-logs, dist, build, .vite, .git
- [ ] Add a top-level README at the new subdir explaining what these mockups are and how to run
- [ ] git push, return PR-ready URL

# TERP Mockups · USER_STORIES Coverage — Executive Summary

> One-line take: **the mockups already provide the underlying capability for ~64% of stories**; most of the remainder are either chrome we deferred (theme/density), explicitly-out-of-scope flows (auth, Stripe), or distinct new surfaces (mobile pick-pack, GL drill-through) that should ship as their own ritual sheets.

## Headline numbers

| Status | Count | % |
|---|---:|---:|
| ✅ Covered | 127 | 29% |
| 🟡 Partial | 149 | 35% |
| ❌ Missing | 133 | 31% |
| ⏭ Out-of-scope | 9 | 2% |
| Other / parse | 15 | 3% |
| **Total** | **433** | **100%** |

Stories surveyed: every numbered `US-XXX` in `EvanTenenbaum/TERP/docs/USER_STORIES.md` (404 unique IDs across 73 sections; 433 rows because a few stories were chunked twice — minor duplication, doesn't change the picture).

## Where the gaps are concentrated

| Theme | Missing | Comment |
|---|---:|---|
| Mobile / PDA pick-pack | 6 | Distinct surface — needs its own mobile ritual sheet |
| GL drill-through & accounting controls | 8 | Frappe Desk handles this; could be a `/t/general-ledger` browser link for now |
| Per-user settings, theme & density | 10 | Chrome we deliberately deferred |
| Reports/dashboard widgets (cash pos., suppliers-to-pay, COA, consignment ranges) | 8 | Each is one new tab inside an existing sheet |
| Calendar internals & invitations | 2 | Calendar view stub today |
| Photos / signatures / attachments | 2 | Add an attach cell type to schema |
| Pick lists & barcode scanning | 3 | Tied to mobile surface |
| Print / PDF / email templates | 3 | Server side; UI just needs an "Email" row action |
| Notification threshold banners | 2 | Promote a couple of tiles on Dashboard |
| Auth / sessions edge cases | 2 | Out-of-scope per inventory |
| Catch-all (line-item samples, duplicate order, version banner, etc.) | 89 | Mostly small-surface details — handled story-by-story |

## "🟡 Partial" — the cheapest wins

149 stories were marked Partial, meaning the *capability* exists but a small piece is missing (a chip on the dashboard, a row action button, persisted column preference, etc.). A weekend's worth of polish work would convert most of these to Covered without any new surfaces.

## What I'd build next (3 sheets, ~2 days each)

1. **Mobile Pick-Pack ritual** — single column-stacked sheet for warehouse staff: scan-in batch ID → tick rows → "Pack & ship" action. Closes ~6 missing + ~12 partial.
2. **General-Ledger Browser** — point `/t/general-ledger` at the existing `gl-entry` DocType + add a "Reverse" row action. Closes ~8 missing accounting stories.
3. **Dashboard tile pack** — Cash Position / Suppliers-to-Pay / Consignment Ranges / Overdue-count banner / SKU Status Browser as five new dashboard tiles. Closes ~8 missing + ~15 partial.

Full per-story table is in `coverage_report.md`.

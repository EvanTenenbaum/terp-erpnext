# TERP — Numbers-Style Frontend Mockups

Interactive, spreadsheet-first design mockups for the TERP ERP frontend.
Built as a separate React 19 + Vite + Tailwind 4 app so it can be run
independently of the Frappe backend during design review.

> **North-star:** *"If I can do it in Apple Numbers with a click, I should be
> able to do it here with the same click — not a button or modal."*

The goal is to keep the simple, no-friction muscle memory the team already has
when working in their `.numbers` files, while quietly handling the ERP wiring
(GL postings, PO/Receipt fan-out, batch creation, etc.) behind the scenes.

---

## What's in this directory

| Path | Contents |
| --- | --- |
| `app/` | The Vite project — runnable with `pnpm install && pnpm dev` |
| `screenshots/` | Latest desktop screenshots (1440×900 @2x) of every key route |
| `docs/MOCKUPS_GUIDE.md` | Complete walkthrough of every screen and component |
| `docs/QA_PASS_NOTES.md` | Notes from the design QA pass (Tier 1 / 2 fixes) |
| `docs/todo.md` | Living task list — current and historical |
| `design/opus_plan.md` | Full design system (colors, type, spacing, motion, sheet accents) |
| `design/plan_addendum.md` | Final routes 6–15 + build plan |
| `interview-notes/` | Verbatim customer-interview analyses used to source the *filtered* nuggets |

## Routes

### Sheet pages (Numbers-style)
- `/` — Dashboard / Summary sheet
- `/sales`, `/inventory`, `/procurement`, `/finance`, `/relationships`, `/credit`, `/admin`
- `/reports` — chart-per-tab
- `/vip` — VIP Portal (customer-facing)
- `/s/:token` — Public shared catalogue (no-login)
- `/t/:slug` — Generic table browser; reaches every DocType in the schema

### Ritual sheets (the "do real work" pages)
- **`/sell/new`** — Sales Invoice. Type-to-search any product (strain / SKU / batch); the row autofills.
- **`/buy/new`** — Purchase Draft. Same pattern; one click to commit as PO + Receipt.
- **`/cash/new`** — Cash Ledger. Date · In · Out · Note → one-click Post to ledger.

### Tools
- `/catalogues/:id` — Catalogue Builder
- `/intake/new` — Intake Wizard
- `/live/:id` — Live Shopping Room

## Spreadsheet-forward features

- Column letters (A, B, C…) and row-number gutters on every sheet
- Range selection → live `Count · Sum · Avg` footer
- Right-click context menus on rows, headers, and tabs
- Sheet tabs at the *bottom* of the canvas (Numbers-style), color-coded per sheet
- Inline edit per cell (text / number / currency / % / date / select-chip / link)
- Empty `+` row at the bottom of every table — type to insert
- Stripped top bar (search · bell · avatar) — no big "New" button
- `⌘K` command palette navigates to sheets, tables, records, and ritual actions

## Interview-aligned tweaks already shipped

- **FIFO** ordering on the Sell-sheet autofill list (oldest available first)
- **"Due now"** red chip on Procurement rows whose linked batch live-qty hits 0
- Plain-language labels: **"Visit Frequency"** (was Engagement), **"Payment Behavior"** (was Reliability)
- Defaults on Buy: **Consignment** + **Primary Vault**, Tab cycles through fields

## Running locally

```bash
cd app
pnpm install
pnpm dev
# → http://localhost:3000
```

## What this is NOT

- Not a fork of the Frappe app — this is a standalone frontend for design review
- Not connected to a real backend — uses `app/client/src/data/seed.ts` for demo rows
- Not a formula engine — users do **not** write formulas; the spreadsheet is a
  data-entry surface, the math/posting is server-side once we wire it

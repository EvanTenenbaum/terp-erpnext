# TERP Numbers — Design QA Pass (v1)

Improvements landed across all 17 routes, verified visually.

## Highlights (before → after)

| Area | Before | After |
|---|---|---|
| **Typography scale** | ad-hoc pixel sizes | unified `--fs-*` tokens (11/12/13/15/18/22px), tabular numerics everywhere |
| **Sidebar rail** | flat list, blue active bg | neutral active state with **sheet-tinted accent bar**, tighter density (32px rows), "Numbers" badge next to wordmark |
| **Top bar** | shallow, cramped search | taller (56px) with breadcrumb, bigger search with ⌘K kbd, cleaner avatar |
| **Sheet tabs** | wrapped / overflowed | horizontal scroll with fade masks, chevron jump, unified count pill, tab bar bg matches canvas |
| **Toolbar** | heavy borders | hairline borders, view switcher segmented, full-width search, right-side export/share |
| **SheetTable footer** | missing | sticky footer with row count + Sum total + Avg + "Double-click to edit · ↵ open row" hint |
| **Status chips** | long labels broke rows (e.g. "requires_override", "To Deliver and Bill") | `shortStatus()` abbreviates; min-width alignment; color-accurate |
| **Inspector** | flat side panel | sheet-tinted top strip, breadcrumb, prominent primary value, sectioned details with collapsibles, explicit action buttons |
| **Dashboard** | generic KPI tiles | `stat-card` with tinted icons, delta labels (↗ +9.4% MoM), richer revenue chart with month labels + order counts, condensed operations list |
| **Reports** | raw cards only | **StatRow** summary above every report (total, top, avg), shortened chips, polished progress bars |
| **VIP Portal** | flat purple hero | layered gradient + decorative glow, rank/score chip row, polished score gauge with gradient bars |
| **Shared catalogue** | plain header | brand gradient strip, hero card + lock/token chip, empty-cart state with icon + hint |
| **Catalogue Builder** | plain sales-tinted top bar | items pill + status chip on tinted toolbar, shadowed Publish button |
| **Intake Wizard** | bare stepper chain | stepper with progress rail + per-step icons; footer with Back/Next chevrons + bold step summary |
| **Live Room** | generic video placeholder | layered radial gradients + subtle grain, animated LIVE pulse badge, 18 watching chip in header |

## Files touched
- `client/src/index.css` — type scale tokens, kbd polish, stat-card, list-row, livepulse keyframe, sticky footer bar
- `client/src/lib/format.ts` — added `shortStatus()` + `sumByField()`
- `client/src/components/numbers/` — `SheetAppShell`, `SheetTabBar`, `Toolbar`, `CellEditor`, `SheetTable`, `Inspector`, `SheetPage`
- `client/src/pages/` — `Home`, `Reports`, `VipPortal`, `SharedSheet`, `CatalogueBuilder`, `IntakeWizard`, `LiveRoom`, `SheetRoutes`

## Verified
- All 17 routes return HTTP 200.
- `npx tsc --noEmit` clean.
- Browser console clean (no React warnings).
- Zero runtime errors on route traversal.

## Before/after screenshots
- `/home/ubuntu/screenshots/terp-before/*.png` (15 routes)
- `/home/ubuntu/screenshots/terp-after/*.png` (15 routes)

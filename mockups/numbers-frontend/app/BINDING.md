# Binding the Mockups to a Live Frappe Site

The mockups ship with an in-process seed dataset (`client/src/data/seed.ts`)
so the entire UI works offline. When you're ready to point them at a real
Frappe + `terp_cannabis` site, **one environment variable** flips the whole
app over.

## TL;DR

```bash
# in client/.env
VITE_FRAPPE_URL=https://your-terp-site.example.com
# optional — only needed if you don't rely on session cookies
VITE_FRAPPE_KEY=<api_key>:<api_secret>
```

Restart the dev server. Every page that uses `useDoctype()` (or calls `api.list()`
directly) will now hit `/api/resource/<DocType>` instead of the seed.

## How it works

```
client/src/lib/api.ts        ← thin REST wrapper (list/get/create/update/remove/call)
client/src/lib/useDoctype.ts ← React hook with loading/error/refresh
```

- **Slug → DocType conversion** is automatic via `BY_SLUG` in `schema.ts`;
  e.g. `sales-order` → `Sales Order`. No per-call mapping needed.
- When `VITE_FRAPPE_URL` is unset, every method short-circuits to the in-memory
  `DATA` registry and the UI feels identical (just doesn't persist).
- `api.call(method, args)` lets you hit any whitelisted Frappe method, e.g.
  `terp_cannabis.api.dashboard.get_summary` for the home dashboard KPIs.

## Permissions / CORS

The shim sets `credentials: "include"` so it relies on Frappe's session cookie
when running on the same origin as the site (recommended). For a separate
origin, configure CORS in your Frappe site's `common_site_config.json`:

```json
{
  "allow_cors": "https://your-mockup-host.example.com",
  "ignore_csrf": 0
}
```

…and pass an API token via `VITE_FRAPPE_KEY` (`<key>:<secret>`).

## Migration order (recommended)

The seed-row shapes mirror Frappe DocType fields exactly, so the swap is mostly
mechanical. A reasonable order:

1. **Read-only sheets first** — Sales (`sales-order`), Inventory (`batch`,
   `item`), Procurement, Finance. Confirm rendering matches.
2. **Ritual sheets** — replace the Sell/Buy/Cash/Receive/Pay `toast.success(...)`
   calls with `api.create(...)` for the relevant DocType (`sales-invoice`,
   `purchase-receipt`, `payment-entry`, etc.). Each ritual page is ~250 LOC and
   already collects every field Frappe needs.
3. **Reports + KPIs** — wire the dashboard widgets and Reports tabs to the
   server-side methods that already exist in `terp_cannabis.api`.
4. **Permissions / scoping** — Frappe enforces row-level perms; the UI does
   nothing extra, you just trust the server.

## When NOT to flip the switch

- During design demos (the seed dataset is curated to look good in screenshots).
- During automated visual-regression tests.
- When showing the UI to a customer who shouldn't see the live data yet.

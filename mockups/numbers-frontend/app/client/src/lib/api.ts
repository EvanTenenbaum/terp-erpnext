/*
 * Frappe binding shim — single point where the mockup either talks to a real
 * Frappe site or falls back to the in-process `seed.ts` data.
 *
 * Activation:
 *   • Set `VITE_FRAPPE_URL=https://your-site` (and optionally `VITE_FRAPPE_KEY`)
 *     in `client/.env`.
 *   • If unset, every call resolves immediately from `DATA[slug]` so the mockup
 *     keeps working with no backend.
 *
 * Mapping:
 *   The `slug` used in routes (kebab-case, e.g. `sales-order`) is converted to
 *   the official Frappe DocType label (Title Case, e.g. `Sales Order`) using
 *   `slugToDoctype()`. Every DocType in `schema.ts` maps cleanly without
 *   per-doctype overrides.
 *
 * API:
 *   list(slug, opts?)   – GET /api/resource/<DocType>?fields=["*"]&limit_page_length=…
 *   get(slug, name)     – GET /api/resource/<DocType>/<name>
 *   create(slug, doc)   – POST /api/resource/<DocType>
 *   update(slug, name, patch) – PUT  /api/resource/<DocType>/<name>
 *   remove(slug, name)  – DELETE /api/resource/<DocType>/<name>
 *
 * The shim is intentionally thin — Frappe's REST already returns row objects
 * shaped exactly like our seed rows, so most pages will work unchanged once
 * VITE_FRAPPE_URL is set.
 */
import { DATA } from "@/data/seed";
import { BY_SLUG } from "@/data/schema";

const BASE = (import.meta as any).env?.VITE_FRAPPE_URL as string | undefined;
const KEY  = (import.meta as any).env?.VITE_FRAPPE_KEY as string | undefined;

export const isLive = !!BASE;

/** Convert "sales-order" → "Sales Order". */
export function slugToDoctype(slug: string): string {
  // Prefer the explicit label if we have one, falling back to title-casing.
  const def = BY_SLUG[slug];
  if (def) {
    // Frappe DocType names are the singular Title Case ("Sales Order").
    return def.singular;
  }
  return slug
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

const headers = (): HeadersInit => ({
  "Content-Type": "application/json",
  "X-Frappe-CSRF-Token": "live-mode",
  ...(KEY ? { Authorization: `token ${KEY}` } : {}),
});

async function jfetch<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, { ...init, headers: headers(), credentials: "include" });
  if (!res.ok) throw new Error(`${res.status} ${res.statusText} for ${url}`);
  const json = (await res.json()) as { data: T };
  return json.data;
}

export interface ListOpts {
  fields?: string[];
  limit?: number;
  filters?: Record<string, unknown>;
  orderBy?: string;
}

export async function list<T = any>(slug: string, opts: ListOpts = {}): Promise<T[]> {
  if (!isLive) return (DATA[slug] ?? []) as T[];
  const dt = slugToDoctype(slug);
  const params = new URLSearchParams();
  params.set("fields", JSON.stringify(opts.fields ?? ["*"]));
  if (opts.limit) params.set("limit_page_length", String(opts.limit));
  if (opts.orderBy) params.set("order_by", opts.orderBy);
  if (opts.filters) params.set("filters", JSON.stringify(opts.filters));
  return jfetch<T[]>(`${BASE}/api/resource/${encodeURIComponent(dt)}?${params}`);
}

export async function get<T = any>(slug: string, name: string): Promise<T> {
  if (!isLive) {
    const rows = (DATA[slug] ?? []) as any[];
    const found = rows.find((r) => r.name === name);
    if (!found) throw new Error(`Not found: ${slug}/${name}`);
    return found as T;
  }
  const dt = slugToDoctype(slug);
  return jfetch<T>(`${BASE}/api/resource/${encodeURIComponent(dt)}/${encodeURIComponent(name)}`);
}

export async function create<T = any>(slug: string, doc: Partial<T>): Promise<T> {
  if (!isLive) {
    // Mock: append to the array, return the doc with a synthetic name.
    const arr = (DATA[slug] ??= []) as any[];
    const synthetic = { name: `${slug.toUpperCase()}-${arr.length + 1}`, ...doc };
    arr.push(synthetic);
    return synthetic as T;
  }
  const dt = slugToDoctype(slug);
  return jfetch<T>(`${BASE}/api/resource/${encodeURIComponent(dt)}`, {
    method: "POST", body: JSON.stringify(doc),
  });
}

export async function update<T = any>(slug: string, name: string, patch: Partial<T>): Promise<T> {
  if (!isLive) {
    const arr = (DATA[slug] ?? []) as any[];
    const i = arr.findIndex((r) => r.name === name);
    if (i < 0) throw new Error(`Not found: ${slug}/${name}`);
    arr[i] = { ...arr[i], ...patch };
    return arr[i] as T;
  }
  const dt = slugToDoctype(slug);
  return jfetch<T>(`${BASE}/api/resource/${encodeURIComponent(dt)}/${encodeURIComponent(name)}`, {
    method: "PUT", body: JSON.stringify(patch),
  });
}

export async function remove(slug: string, name: string): Promise<void> {
  if (!isLive) {
    const arr = (DATA[slug] ?? []) as any[];
    const i = arr.findIndex((r) => r.name === name);
    if (i >= 0) arr.splice(i, 1);
    return;
  }
  const dt = slugToDoctype(slug);
  await fetch(`${BASE}/api/resource/${encodeURIComponent(dt)}/${encodeURIComponent(name)}`, {
    method: "DELETE", headers: headers(), credentials: "include",
  });
}

/** Call a server-side Frappe whitelisted method, e.g. terp_cannabis.api.dashboard.summary */
export async function call<T = any>(method: string, args: Record<string, unknown> = {}): Promise<T> {
  if (!isLive) throw new Error(`Cannot call ${method} — VITE_FRAPPE_URL is not set`);
  const params = new URLSearchParams({ method });
  Object.entries(args).forEach(([k, v]) => params.set(k, typeof v === "string" ? v : JSON.stringify(v)));
  return jfetch<T>(`${BASE}/api/method/${encodeURIComponent(method)}?${params}`);
}

const api = { isLive, list, get, create, update, remove, call, slugToDoctype };
export default api;

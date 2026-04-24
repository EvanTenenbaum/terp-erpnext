/**
 * Reports — spreadsheet-first.
 *
 * Each tab is a SheetTable over its underlying data. Two tabs (Revenue,
 * Aging) get a tiny inline chart strip above the grid because seeing the
 * shape matters more than reading numbers; everyone else is just a grid.
 * No KPI cards. No card chrome. The grid IS the report.
 */
import { useState, useMemo } from "react";
import SheetAppShell from "@/components/numbers/SheetAppShell";
import SheetTabBar, { type TabDef } from "@/components/numbers/SheetTabBar";
import SheetTable from "@/components/numbers/SheetTable";
import type { DocTypeDef } from "@/data/schema";
import { SHEETS } from "@/data/schema";
import {
  client_leaderboard, inventory_aging, revenue_trends, shrinkage, top_clients,
  sales_invoice, purchase_invoice,
} from "@/data/seed";
import { fmtCurrency } from "@/lib/format";

/* ────────────────────────── tab + view definitions ───────────────────────── */

const TABS: TabDef[] = [
  { key: "leaderboard", label: "Leaderboard",     count: client_leaderboard.length, color: "#7E57C2" },
  { key: "aging",       label: "Inventory aging", count: inventory_aging.length,    color: "#FF9500" },
  { key: "revenue",     label: "Revenue",         count: revenue_trends.length,     color: "#34C759" },
  { key: "shrinkage",   label: "Shrinkage",       count: shrinkage.length,          color: "#FF3B30" },
  { key: "top_clients", label: "Top clients",     count: top_clients.length,        color: "#007AFF" },
  { key: "ar",          label: "Owed to us",      count: sales_invoice.length,      color: "#34C759" },
  { key: "ap",          label: "We owe",          count: purchase_invoice.length,   color: "#FF9500" },
];

/* Minimal DocTypeDef shapes per report so they render through SheetTable.
   These don't need slugs/groups because we only consume `fields`/`statusField`. */
const D: Record<string, DocTypeDef> = {
  leaderboard: {
    slug: "rep-leaderboard", label: "Client Leaderboard", singular: "Row", sheet: "reports",
    statusField: "tier",
    fields: [
      { name: "rank",         label: "Rank",          type: "int",     width: 60,  readonly: true },
      { name: "customer",     label: "Customer",      type: "data",    width: 220 },
      { name: "tier",         label: "Tier",          type: "select",  options: ["S","A","B","C"], width: 80 },
      { name: "master_score", label: "Score",         type: "float",   width: 90 },
      { name: "financial",    label: "Financial",     type: "int",     width: 90 },
      { name: "engagement",   label: "Visits",        type: "int",     width: 80 },
      { name: "reliability",  label: "Pay",           type: "int",     width: 70 },
      { name: "growth",       label: "Growth",        type: "int",     width: 80 },
      { name: "referrals",    label: "Referrals",     type: "int",     width: 90 },
    ],
  },
  aging: {
    slug: "rep-aging", label: "Inventory aging", singular: "Batch", sheet: "reports",
    statusField: "age_bucket",
    fields: [
      { name: "batch",      label: "Batch",     type: "data",     width: 130 },
      { name: "item",       label: "Strain",    type: "data",     width: 200 },
      { name: "warehouse",  label: "Warehouse", type: "data",     width: 130 },
      { name: "age_days",   label: "Age (days)",type: "int",      width: 100 },
      { name: "age_bucket", label: "Bucket",    type: "select",   options: ["0-14d","15-30d","31-60d","60+d"], width: 100 },
      { name: "qty",        label: "Qty",       type: "float",    width: 90 },
      { name: "value",      label: "Value",     type: "currency", width: 120 },
    ],
  },
  revenue: {
    slug: "rep-revenue", label: "Revenue", singular: "Period", sheet: "reports",
    fields: [
      { name: "period",  label: "Period",   type: "data",     width: 140 },
      { name: "revenue", label: "Revenue",  type: "currency", width: 160 },
      { name: "orders",  label: "Orders",   type: "int",      width: 100 },
    ],
  },
  shrinkage: {
    slug: "rep-shrinkage", label: "Shrinkage", singular: "Batch", sheet: "reports",
    fields: [
      { name: "batch",     label: "Batch",     type: "data",    width: 130 },
      { name: "item",      label: "Strain",    type: "data",    width: 220 },
      { name: "expected",  label: "Expected",  type: "float",   width: 110 },
      { name: "actual",    label: "Actual",    type: "float",   width: 110 },
      { name: "shrinkage", label: "Shrinkage", type: "percent", width: 110 },
    ],
  },
  top_clients: {
    slug: "rep-top-clients", label: "Top clients", singular: "Client", sheet: "reports",
    fields: [
      { name: "rank",     label: "Rank",     type: "int",      width: 60 },
      { name: "customer", label: "Customer", type: "data",     width: 240 },
      { name: "revenue",  label: "Revenue",  type: "currency", width: 130 },
      { name: "orders",   label: "Orders",   type: "int",      width: 80 },
      { name: "avg_order",label: "Avg/order",type: "currency", width: 120 },
    ],
  },
  ar: {
    slug: "rep-ar", label: "Owed to us", singular: "Invoice", sheet: "reports",
    statusField: "status",
    fields: [
      { name: "name",                label: "Invoice #",  type: "data",    width: 130 },
      { name: "customer",            label: "Customer",   type: "data",    width: 200 },
      { name: "posting_date",        label: "Date",       type: "date",    width: 110 },
      { name: "due_date",            label: "Due",        type: "date",    width: 110 },
      { name: "grand_total",         label: "Total",      type: "currency",width: 120 },
      { name: "outstanding_amount",  label: "Owed",       type: "currency",width: 120 },
      { name: "status",              label: "Status",     type: "select",
        options: ["Draft","Unpaid","Partly Paid","Paid","Overdue","Cancelled"], width: 130 },
    ],
  },
  ap: {
    slug: "rep-ap", label: "We owe", singular: "Bill", sheet: "reports",
    statusField: "status",
    fields: [
      { name: "name",                label: "PI #",       type: "data",    width: 130 },
      { name: "supplier",            label: "Supplier",   type: "data",    width: 200 },
      { name: "posting_date",        label: "Date",       type: "date",    width: 110 },
      { name: "due_date",            label: "Due",        type: "date",    width: 110 },
      { name: "grand_total",         label: "Total",      type: "currency",width: 120 },
      { name: "outstanding_amount",  label: "Owed",       type: "currency",width: 120 },
      { name: "status",              label: "Status",     type: "select",
        options: ["Draft","Submitted","Paid","Overdue","Cancelled"], width: 130 },
      { name: "due_now",             label: "Pay queue",  type: "select",
        options: ["","Due now"], width: 110 },
    ],
  },
};

/* ────────────────────────────── page ─────────────────────────────────────── */

export default function Reports() {
  const [active, setActive] = useState<string>("leaderboard");
  const meta = SHEETS.find((s) => s.slug === "reports")!;

  const data: any[] = useMemo(() => {
    switch (active) {
      case "leaderboard":
        return client_leaderboard.map((r: any) => ({
          ...r,
          tier: r.master_score >= 90 ? "S"
              : r.master_score >= 80 ? "A"
              : r.master_score >= 70 ? "B" : "C",
        }));
      case "aging":       return inventory_aging;
      case "revenue":     return revenue_trends;
      case "shrinkage":   return shrinkage;
      case "top_clients": return top_clients;
      case "ar":          return sales_invoice;
      case "ap":          return purchase_invoice;
      default:            return [];
    }
  }, [active]);

  return (
    <SheetAppShell sheet="reports" title="" subtitle="">
      {/* Optional 64px chart strip — only on tabs where the shape matters. */}
      {active === "revenue"  && <RevenueStrip />}
      {active === "aging"    && <AgingStrip />}

      <SheetTable doctype={D[active]} rows={data} />

      <SheetTabBar tabs={TABS} active={active} onSelect={setActive}
                   accent={meta.tint} position="bottom" />
    </SheetAppShell>
  );
}

/* ───────────────────────── inline chart strips ───────────────────────────── */

function RevenueStrip() {
  const max = Math.max(...revenue_trends.map((r) => r.revenue), 1);
  return (
    <div style={{
      display: "flex", alignItems: "flex-end", gap: 4, height: 64,
      padding: "10px 16px 6px",
      borderBottom: "1px solid var(--border-hair)",
      background: "var(--surface)",
    }}>
      {revenue_trends.map((p) => (
        <div key={p.period} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
          <div style={{ fontSize: 10, color: "var(--text-3)", fontVariantNumeric: "tabular-nums" }}>
            {fmtCurrency(p.revenue)}
          </div>
          <div style={{
            width: "70%", height: `${(p.revenue / max) * 36 + 4}px`,
            background: "linear-gradient(180deg, #34C759, #007AFF)",
            borderRadius: 3,
          }} />
          <div style={{ fontSize: 10, color: "var(--text-3)" }}>{p.period}</div>
        </div>
      ))}
    </div>
  );
}

function AgingStrip() {
  const buckets = ["0-14d", "15-30d", "31-60d", "60+d"] as const;
  const sums: Record<string, number> = {};
  buckets.forEach((b) => (sums[b] = 0));
  inventory_aging.forEach((r) => (sums[r.age_bucket] = (sums[r.age_bucket] ?? 0) + r.value));
  const total = Object.values(sums).reduce((a, b) => a + b, 0) || 1;
  const colors: Record<string, string> = {
    "0-14d": "#34C759", "15-30d": "#007AFF", "31-60d": "#FF9500", "60+d": "#FF3B30",
  };
  return (
    <div style={{
      padding: "10px 16px 8px", borderBottom: "1px solid var(--border-hair)", background: "var(--surface)",
    }}>
      <div style={{ display: "flex", height: 8, borderRadius: 4, overflow: "hidden" }}>
        {buckets.map((b) => (
          <div key={b} style={{
            width: `${((sums[b] ?? 0) / total) * 100}%`,
            background: colors[b],
          }} title={`${b} · ${fmtCurrency(sums[b] ?? 0)}`} />
        ))}
      </div>
      <div style={{
        display: "flex", justifyContent: "space-between", marginTop: 6, fontSize: 11, color: "var(--text-3)",
      }}>
        {buckets.map((b) => (
          <span key={b} style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
            <span style={{ display: "inline-block", width: 8, height: 8, borderRadius: 2, background: colors[b] }} />
            {b} · {fmtCurrency(sums[b] ?? 0)}
          </span>
        ))}
      </div>
    </div>
  );
}

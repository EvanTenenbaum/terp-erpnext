/*
 * /sell/new — Sales Invoice sheet.
 *
 * The shape of a Numbers invoice:
 *   • a row of pick-cells at the top (Customer / Date / Due / Pricing / Rep)
 *   • a body where the user TYPES a strain, SKU, or batch # into the first
 *     cell; a live dropdown shows matching inventory; Enter drops the full
 *     row (strain, grade, available, unit $).
 *   • footer totals (Subtotal · Tax · Total)
 *   • ONE primary action at the bottom right
 *
 * No copy-paste anywhere. No modals. No wizards.
 */
import { useMemo, useState } from "react";
import { toast } from "sonner";
import SheetAppShell from "@/components/numbers/SheetAppShell";
import SheetTabBar from "@/components/numbers/SheetTabBar";
import PickCell from "@/components/numbers/PickCell";
import RitualSheet, { type Col, type RitualRow, type MasterMatch } from "@/components/numbers/RitualSheet";
import { DATA } from "@/data/seed";
import { SHEETS } from "@/data/schema";
import { fmtCurrency } from "@/lib/format";

const today = new Date("2026-04-23T12:00:00Z");
const addDays = (n: number) => {
  const d = new Date(today); d.setDate(d.getDate() + n);
  return d.toISOString().slice(0, 10);
};

export default function SellSheet() {
  const sales = SHEETS.find((s) => s.slug === "sales")!;

  const [customerId, setCustomerId] = useState<string | null>(null);
  const [date] = useState(addDays(0));
  const [dueDate, setDueDate] = useState<string>(addDays(30));
  const [pricingProfile, setPricingProfile] = useState<string | null>(null);
  const [rep, setRep] = useState<string | null>(null);
  const [notes, setNotes] = useState("");

  const [rows, setRows] = useState<RitualRow[]>([{}, {}, {}]);

  const customers = DATA["customer"] ?? [];
  const batches = DATA["batch"] ?? [];
  const items = DATA["item"] ?? [];
  const pricingProfiles = DATA["pricing-profile"] ?? [];

  const custOpts = customers.map((c: any) => ({
    id: c.name,
    label: c.name,
    meta: c.credit_limit_mode === "HARD_BLOCK"
      ? "blocked"
      : c.credit_limit_mode === "SOFT_BLOCK"
        ? "over limit"
        : c.preferred_payment_term,
    tint:
      c.credit_limit_mode === "HARD_BLOCK" ? "#FF3B30"
      : c.credit_limit_mode === "SOFT_BLOCK" ? "#FF9500"
      : c.vip_portal_enabled ? "#AF52DE" : "#34C759",
  }));

  const ppOpts = pricingProfiles.length
    ? pricingProfiles.map((p: any) => ({ id: p.name ?? p.profile_name, label: p.profile_name ?? p.name }))
    : [
        { id: "Retail Standard", label: "Retail Standard" },
        { id: "Wholesale",       label: "Wholesale" },
        { id: "VIP Tier",        label: "VIP Tier" },
      ];

  const repOpts = [
    { id: "rep.ruiz@terp.io", label: "Ruiz, M." },
    { id: "rep.khan@terp.io", label: "Khan, A." },
    { id: "rep.ortega@terp.io", label: "Ortega, S." },
  ];

  const selectedCustomer = customers.find((c: any) => c.name === customerId);

  const subtotal = useMemo(() => rows.reduce((a, r) => a + (Number(r.line_total) || 0), 0), [rows]);
  const taxRate = 0.085;
  const tax = subtotal * taxRate;
  const total = subtotal + tax;

  const overLimit = selectedCustomer && (selectedCustomer.credit_used + total) > selectedCustomer.credit_limit;

  // ── Inline type-to-search over inventory ───────────────────────
  // Matches across strain name, item name, SKU, batch name, grade.
  const searchMasters = (query: string): MasterMatch[] => {
    const q = query.trim().toLowerCase();
    // FIFO ordering: oldest in-stock batches surface first
    // (batches in seed.ts are pre-sorted oldest->newest; we re-stable-sort
    //  by name which encodes intake date, just in case)
    const sortedBatches = [...batches].sort(
      (a: any, b: any) => String(a.name).localeCompare(String(b.name)),
    );
    if (!q) {
      // Empty query → oldest in-stock batches first
      return sortedBatches
        .filter((b: any) => Number(b.qty) > 0)
        .slice(0, 8)
        .map(toMatch);
    }
    const hits = sortedBatches.filter((b: any) => {
      const item = items.find((i: any) => i.name === b.item);
      const hay = [
        b.name, b.item, item?.item_name ?? "",
        item?.strain ?? "", item?.product_grade ?? "",
      ].join(" ").toLowerCase();
      return hay.includes(q);
    });
    return hits.slice(0, 10).map(toMatch);
  };

  function toMatch(b: any): MasterMatch {
    const item = items.find((i: any) => i.name === b.item);
    return {
      id: b.name,
      primary: item?.strain ? `${item.strain} · ${item.product_grade}` : b.item,
      secondary: `${b.name} · SKU ${b.item} · ${b.supplier}`,
      meta: `${Number(b.qty).toLocaleString()}g avail · ${fmtCurrency(Number(b.vendor_range_high ?? b.unit_cost))}`,
      tint:
        b.batch_status === "Ready to Ship" ? "#34C759"
        : b.batch_status === "Awaiting Intake" ? "#FF9500"
        : "#007AFF",
      ref: b,
    };
  }

  const onPickMaster = (rowIndex: number, m: MasterMatch) => {
    const b = m.ref;
    const item = items.find((i: any) => i.name === b.item);
    const unitPrice =
      Number(b.vendor_range_high)
      || Math.round((Number(b.unit_cost) * 1.35) * 100) / 100
      || Number(b.unit_cost) || 0;
    setRows((rs) => {
      const next = [...rs];
      const prev = next[rowIndex] ?? {};
      const qty = prev.qty ?? 1;
      next[rowIndex] = {
        ...prev,
        batch_no: b.name,
        strain: item?.strain ?? "",
        grade: item?.product_grade ?? "",
        available: b.qty,
        qty,
        unit_price: prev.unit_price ?? unitPrice,
        line_total: (Number(qty) || 0) * (Number(prev.unit_price ?? unitPrice) || 0),
      };
      return recomputeWarnings(next, batches);
    });
  };

  const handleRowsChange = (next: RitualRow[]) => {
    setRows(recomputeWarnings(next, batches));
  };

  // ── Columns ────────────────────────────────────────────────────
  const cols: Col[] = [
    { key: "batch_no",   label: "Product (search)", kind: "text",              width: 240 },
    { key: "strain",     label: "Strain",           kind: "readonly-text",     width: 150 },
    { key: "grade",      label: "Grade",            kind: "readonly-text",     width: 80 },
    { key: "available",  label: "Avail.",           kind: "readonly-number",   width: 80,  align: "right", suffix: "g" },
    { key: "qty",        label: "Qty",              kind: "number",            width: 80,  align: "right" },
    { key: "unit_price", label: "Unit $",           kind: "currency",          width: 110, align: "right" },
    { key: "line_total", label: "Line $",           kind: "readonly-currency", width: 120, align: "right" },
  ];

  return (
    <SheetAppShell title={`Invoice · ${selectedCustomer?.name ?? "(pick customer)"}`} subtitle="Sales Invoice — draft">
      {/* Pick-cell header row */}
      <div
        className="ritual-head"
        style={{ gridTemplateColumns: "minmax(220px, 2fr) 140px 140px minmax(160px, 1.2fr) minmax(140px, 1fr) minmax(200px, 2fr)" }}
      >
        <PickCell
          label="Customer"
          value={customerId}
          onChange={(id) => setCustomerId(id)}
          options={custOpts}
          placeholder="Pick a customer…"
        />
        <div className="rh-cell">
          <div className="rh-label">Invoice #</div>
          <div className="rh-value">SINV-{String(1000 + rows.length).padStart(4, "0")}</div>
        </div>
        <div className="rh-cell">
          <div className="rh-label">Date</div>
          <div className="rh-value" style={{ fontVariantNumeric: "tabular-nums" }}>{date}</div>
        </div>
        <div className="rh-cell">
          <div className="rh-label">Due</div>
          <input
            className="pick-cell"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            style={{ fontSize: 14, fontWeight: 600, color: "var(--text-1)" }}
          />
        </div>
        <PickCell
          label="Pricing"
          value={pricingProfile}
          onChange={(id) => setPricingProfile(id)}
          options={ppOpts}
          placeholder="Default"
        />
        <PickCell
          label="Rep"
          value={rep}
          onChange={(id) => setRep(id)}
          options={repOpts}
          placeholder="Pick a rep"
        />
      </div>

      {selectedCustomer && overLimit && (
        <div style={{
          padding: "6px 14px", fontSize: 12, background: "#FFF4E5",
          borderBottom: "1px solid #FFE2BD", color: "#8A4900", display: "flex",
          alignItems: "center", gap: 10,
        }}>
          <span className="warn-inline">Credit warning</span>
          <span>
            {selectedCustomer.name}: used {fmtCurrency(selectedCustomer.credit_used)} of {fmtCurrency(selectedCustomer.credit_limit)}
            {"  •  "} this invoice pushes them {fmtCurrency((selectedCustomer.credit_used + total) - selectedCustomer.credit_limit)} over.
          </span>
          <div style={{ marginLeft: "auto" }}>
            <button className="btn-ghost" onClick={() => toast("Override requested — demo only")}>Request override</button>
          </div>
        </div>
      )}

      <RitualSheet
        cols={cols}
        rows={rows}
        onRowsChange={handleRowsChange}
        sumCol="line_total"
        countLabel="items"
        searchMasters={searchMasters}
        onPickMaster={onPickMaster}
        firstColPlaceholder="Type strain, SKU, or batch #…"
        addRowPrompt="+ click or just start typing a strain / SKU / batch #"
      />

      {/* Totals */}
      <div
        style={{
          height: 36, background: "var(--surface)",
          borderTop: "1px solid var(--border-hair)",
          display: "flex", alignItems: "center", justifyContent: "flex-end",
          padding: "0 16px", gap: 28, fontSize: 12, color: "var(--text-2)",
          fontVariantNumeric: "tabular-nums",
        }}
      >
        <span>Subtotal <b style={{ color: "var(--text-1)" }}>{fmtCurrency(subtotal)}</b></span>
        <span>Tax ({(taxRate * 100).toFixed(1)}%) <b style={{ color: "var(--text-1)" }}>{fmtCurrency(tax)}</b></span>
        <span style={{ fontSize: 13, color: "var(--text-1)", fontWeight: 600 }}>Total {fmtCurrency(total)}</span>
      </div>

      <div className="ritual-bar">
        <input
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Notes for the customer (optional)"
          style={{
            all: "unset", flex: 1, fontSize: 12, color: "var(--text-2)",
            background: "#F4F4F6", padding: "6px 10px", borderRadius: 6,
          }}
        />
        <button className="btn-ghost" onClick={() => toast("Saved draft")}>Save draft</button>
        <button
          className="btn-primary"
          disabled={!customerId || rows.every((r) => !r.batch_no) || selectedCustomer?.credit_limit_mode === "HARD_BLOCK"}
          onClick={() => toast.success(`Sent invoice for ${fmtCurrency(total)} to ${selectedCustomer?.name ?? "customer"}`)}
        >
          Send invoice
        </button>
      </div>

      <SheetTabBar
        tabs={[
          { key: "items",   label: "Items",   count: rows.filter((r) => r.batch_no).length, color: sales.ink as string },
          { key: "totals",  label: "Totals" },
          { key: "notes",   label: "Notes" },
          { key: "history", label: "History" },
        ]}
        active="items"
        onSelect={() => toast("Tab switching — demo")}
        position="bottom"
      />
    </SheetAppShell>
  );
}

function recomputeWarnings(rs: RitualRow[], batches: any[]): RitualRow[] {
  return rs.map((r) => {
    const warn: Record<string, string> = {};
    if (r.batch_no) {
      const b = batches.find((x: any) => x.name === r.batch_no);
      if (!b) warn.batch_no = "Unknown batch";
      else if (r.qty && Number(r.qty) > Number(b.qty)) warn.qty = `Only ${b.qty}g avail`;
    }
    return { ...r, __warn: warn };
  });
}

/*
 * /receive/new — Purchase Receipt sheet.
 *
 * The user opens a blank receipt and types in the first column:
 *   • a PO number (PO-0204) → row autofills with the supplier and expected qty
 *   • OR a supplier name → all of that supplier's open POs are suggested
 *   • OR a strain/SKU → the matching open PO line is suggested
 *
 * Single primary action: "Post receipt" — fans out to Inventory (new batches)
 * + Procurement (PO marked received) + Finance (PI bill draft, optionally).
 */
import { useMemo, useState } from "react";
import { toast } from "sonner";
import SheetAppShell from "@/components/numbers/SheetAppShell";
import SheetTabBar from "@/components/numbers/SheetTabBar";
import PickCell from "@/components/numbers/PickCell";
import RitualSheet, { type Col, type RitualRow, type MasterMatch } from "@/components/numbers/RitualSheet";
import { DATA } from "@/data/seed";
import { fmtCurrency } from "@/lib/format";

const today = new Date("2026-04-23T12:00:00Z");
const addDays = (n: number) => {
  const d = new Date(today); d.setDate(d.getDate() + n);
  return d.toISOString().slice(0, 10);
};

export default function ReceiveSheet() {
  const [supplierId, setSupplierId] = useState<string | null>(null);
  const [date] = useState(addDays(0));
  const [warehouse, setWarehouse] = useState<string | null>("Primary Vault");
  const [carrier, setCarrier] = useState<string>("");
  const [notes, setNotes] = useState("");

  const [rows, setRows] = useState<RitualRow[]>([{}, {}, {}]);

  const suppliers = DATA["supplier"] ?? [];
  const items = DATA["item"] ?? [];
  const warehouses = DATA["warehouse"] ?? [];
  const purchaseOrders = (DATA["purchase-order"] ?? []) as any[];

  // Open POs only — what we can actually receive against.
  const openPOs = useMemo(
    () => purchaseOrders.filter((p) =>
      ["To Receive", "To Bill", "To Receive and Bill", "Draft"].includes(p.status)),
    [purchaseOrders],
  );

  const supplierOpts = suppliers.map((s: any) => ({
    id: s.name, label: s.name,
    meta: s.is_buyer ? "also buys" : s.supplier_type,
    tint: s.is_buyer ? "#AF52DE" : "#34C759",
  }));

  const warehouseOpts = warehouses.length
    ? warehouses.map((w: any) => ({ id: w.name, label: w.name, meta: w.warehouse_type }))
    : [
        { id: "Primary Vault", label: "Primary Vault", meta: "default" },
        { id: "Cold Storage",  label: "Cold Storage" },
        { id: "Quarantine",    label: "Quarantine" },
      ];

  const sumQty  = useMemo(() => rows.reduce((a, r) => a + (Number(r.qty_received) || 0), 0), [rows]);
  const sumCost = useMemo(() => rows.reduce((a, r) => a + (Number(r.line_total) || 0), 0), [rows]);

  // ── Type-to-search: PO #, supplier, item ──────────────────────
  const searchMasters = (query: string): MasterMatch[] => {
    const q = query.trim().toLowerCase();
    // Empty → suggest all open POs (supplier-filtered if supplier picked)
    const pool = supplierId
      ? openPOs.filter((p) => p.supplier === supplierId)
      : openPOs;
    if (!q) {
      return pool.slice(0, 8).map(poToMatch);
    }
    const hits = pool.filter((p: any) => {
      const hay = [p.name, p.supplier, p.status].join(" ").toLowerCase();
      return hay.includes(q);
    });
    // Also surface item suggestions when the user is typing a strain/SKU
    const itemHits = items.filter((it: any) => {
      const hay = [it.item_name, it.strain, it.product_grade, it.name].join(" ").toLowerCase();
      return q && hay.includes(q);
    }).slice(0, 4);
    return [
      ...hits.slice(0, 8).map(poToMatch),
      ...itemHits.map(itemToMatch),
    ];
  };

  function poToMatch(p: any): MasterMatch {
    return {
      id: p.name,
      primary: `${p.name} · ${p.supplier}`,
      secondary: `${p.status} · scheduled ${p.schedule_date}`,
      meta: fmtCurrency(p.grand_total),
      tint: p.status === "Draft" ? "#8E8E93"
          : p.status === "To Receive" ? "#FF9500"
          : "#007AFF",
      ref: { kind: "po", po: p },
    };
  }
  function itemToMatch(it: any): MasterMatch {
    return {
      id: it.name,
      primary: `${it.strain ?? it.item_name} · ${it.product_grade ?? "—"}`,
      secondary: `SKU ${it.name}`,
      meta: it.cogs_mid ? fmtCurrency(Number(it.cogs_mid)) : "",
      tint: "#007AFF",
      ref: { kind: "item", item: it },
    };
  }

  const onPickMaster = (rowIndex: number, m: MasterMatch) => {
    setRows((rs) => {
      const next = [...rs];
      const prev = next[rowIndex] ?? {};
      if (m.ref.kind === "po") {
        const p = m.ref.po;
        // Default a sensible expected qty from the PO total / a guessed unit cost
        next[rowIndex] = {
          ...prev,
          ref_po: p.name,
          supplier_label: p.supplier,
          item_label: prev.item_label ?? "(see PO line)",
          batch_no: prev.batch_no ?? `B-${p.name.slice(-3)}-${rowIndex + 1}`,
          qty_received: prev.qty_received ?? 250,
          unit_cost: prev.unit_cost ?? Math.round((p.grand_total / 250) * 100) / 100,
          line_total: (Number(prev.qty_received ?? 250) || 0) * (Number(prev.unit_cost ?? Math.round((p.grand_total / 250) * 100) / 100) || 0),
        };
        // also auto-set the supplier picker if not set
        if (!supplierId) setSupplierId(p.supplier);
      } else if (m.ref.kind === "item") {
        const it = m.ref.item;
        const unit = Number(it.cogs_mid) || Number(it.cogs_fixed) || 0;
        const qty = prev.qty_received ?? 100;
        next[rowIndex] = {
          ...prev,
          item_label: it.strain ?? it.item_name,
          batch_no: prev.batch_no ?? `B-${(it.name || "").slice(0, 4)}-${rowIndex + 1}`,
          qty_received: qty,
          unit_cost: unit,
          line_total: qty * unit,
        };
      }
      return next;
    });
  };

  const cols: Col[] = [
    { key: "ref_po",        label: "PO / Item (search)",  kind: "text",              width: 230 },
    { key: "supplier_label", label: "Supplier",            kind: "readonly-text",     width: 160 },
    { key: "item_label",    label: "Item",                kind: "text",              width: 200 },
    { key: "batch_no",      label: "New Batch #",         kind: "text",              width: 130 },
    { key: "qty_received",  label: "Qty",                 kind: "number",            width: 80,  align: "right", suffix: "g" },
    { key: "unit_cost",     label: "Unit $",              kind: "currency",          width: 100, align: "right" },
    { key: "line_total",    label: "Line $",              kind: "readonly-currency", width: 110, align: "right" },
  ];

  const supplier = suppliers.find((s: any) => s.name === supplierId);
  const billDraft = sumCost > 0 && supplier;

  return (
    <SheetAppShell title={`Receipt · ${supplier?.name ?? "(any supplier)"}`} subtitle="Purchase Receipt — draft">
      <div
        className="ritual-head"
        style={{ gridTemplateColumns: "minmax(220px, 2fr) 140px 140px minmax(160px, 1.2fr) minmax(200px, 1fr)" }}
      >
        <PickCell
          label="Supplier"
          value={supplierId}
          onChange={(id) => setSupplierId(id)}
          options={supplierOpts}
          placeholder="Any open PO supplier"
        />
        <div className="rh-cell">
          <div className="rh-label">Receipt #</div>
          <div className="rh-value">PR-{String(310 + rows.length).padStart(4, "0")}</div>
        </div>
        <div className="rh-cell">
          <div className="rh-label">Date</div>
          <div className="rh-value" style={{ fontVariantNumeric: "tabular-nums" }}>{date}</div>
        </div>
        <PickCell
          label="Warehouse"
          value={warehouse}
          onChange={(id) => setWarehouse(id)}
          options={warehouseOpts}
          placeholder="Primary Vault"
        />
        <div className="rh-cell">
          <div className="rh-label">Carrier / waybill</div>
          <input
            className="pick-cell"
            value={carrier}
            onChange={(e) => setCarrier(e.target.value)}
            placeholder="Optional"
            style={{ fontSize: 14, fontWeight: 600, color: "var(--text-1)" }}
          />
        </div>
      </div>

      <RitualSheet
        cols={cols}
        rows={rows}
        onRowsChange={setRows}
        sumCol="line_total"
        countLabel="lines"
        searchMasters={searchMasters}
        onPickMaster={onPickMaster}
        firstColPlaceholder="Type a PO #, supplier, strain or SKU…"
        addRowPrompt="+ click or just start typing a PO #, strain, or SKU"
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
        <span>Total qty <b style={{ color: "var(--text-1)" }}>{sumQty.toLocaleString()} g</b></span>
        <span>Total cost <b style={{ color: "var(--text-1)" }}>{fmtCurrency(sumCost)}</b></span>
        {billDraft && (
          <span style={{ color: "var(--text-1)", fontWeight: 600 }}>
            Will create bill: {fmtCurrency(sumCost)}
          </span>
        )}
      </div>

      <div className="ritual-bar">
        <input
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Notes for the warehouse (optional)"
          style={{
            all: "unset", flex: 1, fontSize: 12, color: "var(--text-2)",
            background: "#F4F4F6", padding: "6px 10px", borderRadius: 6,
          }}
        />
        <button className="btn-ghost" onClick={() => toast("Saved draft")}>Save draft</button>
        <button
          className="btn-primary"
          disabled={rows.every((r) => !r.ref_po && !r.item_label)}
          onClick={() => toast.success(`Posted receipt — ${sumQty.toLocaleString()}g across ${rows.filter((r) => r.qty_received).length} batch(es)`)}
        >
          Post receipt
        </button>
      </div>

      <SheetTabBar
        tabs={[
          { key: "lines",   label: "Lines",     count: rows.filter((r) => r.qty_received).length, color: "#FF9500" },
          { key: "bill",    label: "Bill draft" },
          { key: "qa",      label: "QA / Photos" },
          { key: "history", label: "History" },
        ]}
        active="lines"
        onSelect={() => toast("Tab switching — demo")}
        position="bottom"
      />
    </SheetAppShell>
  );
}

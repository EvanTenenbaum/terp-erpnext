/*
 * /buy/new — Purchase Draft sheet.
 *
 * Mirrors SellSheet but in the opposite direction. The user picks a Supplier
 * cell, then types Strain or Item name in column A. The dropdown shows
 * matching items, with a "Create new strain 'X'" option at the bottom when
 * nothing matches — so adding an unknown SKU is one keystroke + Enter, no
 * modal. Defaults: Consignment + Primary Vault. One primary action commits
 * the draft to a Purchase Order + Receipt + Batches in one go.
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

export default function BuySheet() {
  const procurement = SHEETS.find((s) => s.slug === "procurement")!;

  const [supplierId, setSupplierId] = useState<string | null>(null);
  const [date] = useState(addDays(0));
  const [intakeDate, setIntakeDate] = useState<string>(addDays(3));
  const [pricingMode, setPricingMode] = useState<string | null>("Consignment");
  const [warehouse, setWarehouse] = useState<string | null>("Primary Vault");
  const [notes, setNotes] = useState("");

  const [rows, setRows] = useState<RitualRow[]>([{}, {}, {}]);

  const suppliers = DATA["supplier"] ?? [];
  const items = DATA["item"] ?? [];
  const strains = DATA["thca-strain"] ?? [];
  const warehouses = DATA["warehouse"] ?? [];

  const supplierOpts = suppliers.map((s: any) => ({
    id: s.name,
    label: s.name,
    meta: s.is_buyer ? "also buys" : s.supplier_type,
    tint: s.is_buyer ? "#AF52DE" : "#34C759",
  }));

  const warehouseOpts = warehouses.map((w: any) => ({
    id: w.name, label: w.name, meta: w.warehouse_type,
  }));

  const pricingModeOpts = [
    { id: "Consignment", label: "Consignment", meta: "default" },
    { id: "Owned",       label: "Owned",       meta: "pay on receipt" },
    { id: "Sample",      label: "Sample",      meta: "no cost" },
  ];

  const sumQty   = useMemo(() => rows.reduce((a, r) => a + (Number(r.qty) || 0), 0), [rows]);
  const sumCost  = useMemo(() => rows.reduce((a, r) => a + (Number(r.line_total) || 0), 0), [rows]);

  // Estimated margin: sum of (mid sell price * qty) − cost, when item is known
  const estRevenue = useMemo(() => rows.reduce((acc, r) => {
    const item = items.find((i: any) => i.item_name === r.item_label || i.strain === r.strain);
    if (!item) return acc;
    const mid = Number(item.cogs_mid) || Number(item.cogs_fixed) || 0;
    const sell = mid > 0 ? Math.round(mid * 1.35 * 100) / 100 : 0;
    return acc + sell * (Number(r.qty) || 0);
  }, 0), [rows, items]);
  const estMargin = sumCost > 0 ? estRevenue - sumCost : 0;

  // ── Inline type-to-search over items + strains ────────────────
  const searchMasters = (query: string): MasterMatch[] => {
    const q = query.trim().toLowerCase();
    if (!q) {
      // Empty: top items by recent activity (use first 8)
      return items.slice(0, 8).map(itemToMatch);
    }
    const itemHits = items
      .filter((i: any) => {
        const hay = [i.item_name, i.strain, i.product_grade, i.product_type, i.name]
          .join(" ").toLowerCase();
        return hay.includes(q);
      })
      .slice(0, 8)
      .map(itemToMatch);

    const strainHits = strains
      .filter((s: any) => s.strain_name.toLowerCase().includes(q))
      .filter((s: any) => !itemHits.some((m) => m.ref?.strain === s.strain_name))
      .slice(0, 3)
      .map((s: any) => ({
        id: `strain:${s.strain_name}`,
        primary: s.strain_name,
        secondary: `${s.strain_type} · existing strain (no SKU yet)`,
        meta: "create SKU on intake",
        tint: "#FF9500",
        ref: { __strainOnly: true, strain: s.strain_name },
      } satisfies MasterMatch));

    const list = [...itemHits, ...strainHits];

    // Inline "create new strain" affordance — one keystroke to add an unknown variety.
    if (list.length === 0
        || (!list.some((m) => m.primary.toLowerCase() === q.toLowerCase())
            && q.length >= 3)) {
      list.push({
        id: `__create:${query}`,
        primary: `Create new strain "${query.trim()}"`,
        secondary: "Adds a placeholder strain row; SKU created at intake",
        tint: "#007AFF",
        isCreate: true,
        ref: { __create: true, query: query.trim() },
      });
    }
    return list;
  };

  function itemToMatch(i: any): MasterMatch {
    const supplierLabel = supplierId ?? "—";
    return {
      id: i.name,
      primary: `${i.strain} · ${i.product_grade}`,
      secondary: `${i.item_name} · SKU ${i.name}`,
      meta: `${i.product_type} · last cost ${fmtCurrency(Number(i.cogs_mid) || Number(i.cogs_fixed) || 0)}/g`,
      tint:
        i.workflow_status === "Live"          ? "#34C759"
        : i.workflow_status === "Photographed" ? "#5AC8FA"
        : "#A7A7AC",
      ref: { ...i, __supplierLabel: supplierLabel },
    };
  }

  const onPickMaster = (rowIndex: number, m: MasterMatch) => {
    setRows((rs) => {
      const next = [...rs];
      const prev = next[rowIndex] ?? {};

      if (m.ref?.__create) {
        next[rowIndex] = {
          ...prev,
          item_label: m.ref.query,
          strain: m.ref.query,
          grade: prev.grade ?? "AA",
          qty: prev.qty ?? null,
          unit_cost: prev.unit_cost ?? null,
          line_total: 0,
          __new_strain: true,
        };
        toast(`"${m.ref.query}" will be created on commit`);
        return next;
      }
      if (m.ref?.__strainOnly) {
        next[rowIndex] = {
          ...prev,
          item_label: m.ref.strain,
          strain: m.ref.strain,
          grade: prev.grade ?? "AA",
          __strain_only: true,
        };
        return next;
      }

      const i = m.ref;
      const guessCost = Number(i.cogs_mid) || Number(i.cogs_fixed) || 0;
      const qty = prev.qty ?? null;
      next[rowIndex] = {
        ...prev,
        item_label: i.item_name,
        strain: i.strain,
        grade: i.product_grade,
        type: i.product_type,
        qty,
        unit_cost: prev.unit_cost ?? guessCost,
        line_total: (Number(qty) || 0) * (Number(prev.unit_cost ?? guessCost) || 0),
        sku_ref: i.name,
      };
      return next;
    });
  };

  const cols: Col[] = [
    { key: "item_label",  label: "Strain / Item (search)", kind: "text",              width: 260 },
    { key: "grade",       label: "Grade",                  kind: "select",            width: 90, options: ["AAA","AA","A","B"] },
    { key: "type",        label: "Type",                   kind: "readonly-text",     width: 110 },
    { key: "qty",         label: "Qty",                    kind: "number",            width: 90,  align: "right", suffix: "g" },
    { key: "unit_cost",   label: "Unit cost",              kind: "currency",          width: 110, align: "right" },
    { key: "line_total",  label: "Line cost",              kind: "readonly-currency", width: 130, align: "right" },
    { key: "lot_number",  label: "Lot #",                  kind: "text",              width: 130 },
  ];

  const supplier = suppliers.find((s: any) => s.name === supplierId);

  return (
    <SheetAppShell title={`Purchase · ${supplier?.name ?? "(pick supplier)"}`} subtitle="Purchase Draft">
      <div
        className="ritual-head"
        style={{ gridTemplateColumns: "minmax(220px, 2fr) 140px 140px minmax(160px, 1.2fr) minmax(160px, 1.2fr) minmax(160px, 1.4fr)" }}
      >
        <PickCell
          label="Supplier"
          value={supplierId}
          onChange={setSupplierId}
          options={supplierOpts}
          placeholder="Pick a supplier…"
        />
        <div className="rh-cell">
          <div className="rh-label">Draft #</div>
          <div className="rh-value">PO-DRAFT-{String(2400 + rows.length).padStart(4, "0")}</div>
        </div>
        <div className="rh-cell">
          <div className="rh-label">Date</div>
          <div className="rh-value" style={{ fontVariantNumeric: "tabular-nums" }}>{date}</div>
        </div>
        <div className="rh-cell">
          <div className="rh-label">Expected intake</div>
          <input
            className="pick-cell"
            value={intakeDate}
            onChange={(e) => setIntakeDate(e.target.value)}
            style={{ fontSize: 14, fontWeight: 600, color: "var(--text-1)" }}
          />
        </div>
        <PickCell
          label="Pricing mode"
          value={pricingMode}
          onChange={setPricingMode}
          options={pricingModeOpts}
        />
        <PickCell
          label="Warehouse"
          value={warehouse}
          onChange={setWarehouse}
          options={warehouseOpts}
        />
      </div>

      <RitualSheet
        cols={cols}
        rows={rows}
        onRowsChange={setRows}
        sumCol="line_total"
        countLabel="line items"
        searchMasters={searchMasters}
        onPickMaster={onPickMaster}
        firstColPlaceholder="Type a strain, item name, or SKU — or a brand-new strain"
        addRowPrompt="+ click or just start typing the next strain / SKU"
      />

      {/* Totals strip */}
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
        {estMargin !== 0 && (
          <span>Est. margin <b style={{ color: estMargin > 0 ? "var(--success)" : "var(--danger)" }}>{fmtCurrency(estMargin)}</b></span>
        )}
      </div>

      <div className="ritual-bar">
        <input
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Internal notes (optional)"
          style={{
            all: "unset", flex: 1, fontSize: 12, color: "var(--text-2)",
            background: "#F4F4F6", padding: "6px 10px", borderRadius: 6,
          }}
        />
        <button className="btn-ghost" onClick={() => toast("Saved draft")}>Save draft</button>
        <button
          className="btn-primary"
          disabled={!supplierId || rows.every((r) => !r.item_label)}
          onClick={() => {
            const newStrains = rows.filter((r) => r.__new_strain).length;
            const lines = rows.filter((r) => r.item_label).length;
            const msg = `Created PO + Receipt for ${supplier?.name ?? "supplier"} — ${lines} line${lines === 1 ? "" : "s"}` +
                        (newStrains ? ` · ${newStrains} new strain${newStrains === 1 ? "" : "s"} added` : "");
            toast.success(msg);
          }}
        >
          Commit PO + Receipt
        </button>
      </div>

      <SheetTabBar
        tabs={[
          { key: "items",    label: "Items",   count: rows.filter((r) => r.item_label).length, color: procurement.ink as string },
          { key: "totals",   label: "Totals" },
          { key: "shipping", label: "Shipping" },
          { key: "history",  label: "History" },
        ]}
        active="items"
        onSelect={() => toast("Tab switching — demo")}
        position="bottom"
      />
    </SheetAppShell>
  );
}

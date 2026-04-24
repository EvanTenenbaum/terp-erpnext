/**
 * Intake — single spreadsheet, no wizard.
 *
 * The team's existing intake ritual is "open a fresh sheet and type each new
 * batch as a row". This page is exactly that: one row per incoming batch,
 * Strain / Qty / Unit cost / Lot / Expiry / Warehouse / Photo / Stage. The
 * old 6-step wizard (Supplier → Batches → Costs → Photography → Warehouse →
 * Review) was a form bolt-on — it has been collapsed into:
 *   - one Supplier picker at the top of the sheet (single PickCell)
 *   - one row per batch with a Stage column carrying the per-row workflow
 *   - one sticky Commit bar at the bottom that posts the receipt
 */
import { useMemo, useState } from "react";
import { toast } from "sonner";
import SheetAppShell from "@/components/numbers/SheetAppShell";
import SheetTable from "@/components/numbers/SheetTable";
import PickCell from "@/components/numbers/PickCell";
import type { DocTypeDef } from "@/data/schema";
import { supplier, warehouse } from "@/data/seed";
import { fmtCurrency, fmtNum } from "@/lib/format";

interface BatchDraft {
  id: string;
  item: string | null;       // strain / SKU
  qty: number;
  unit_cost: number;
  lot_number: string;
  expiry: string | null;
  warehouse: string | null;
  photo: boolean;
  stage: "Receiving" | "Counted" | "Photography" | "Stored";
}

const INTAKE_DOCTYPE: DocTypeDef = {
  slug: "intake-row", label: "Intake rows", singular: "Batch",
  sheet: "inventory", statusField: "stage",
  fields: [
    { name: "item",       label: "Strain / SKU", type: "link",     options: "item",      width: 220, required: true },
    { name: "qty",        label: "Qty",          type: "float",    width: 90 },
    { name: "unit_cost",  label: "Unit cost",    type: "currency", width: 110 },
    { name: "lot_number", label: "Lot #",        type: "data",     width: 130 },
    { name: "expiry",     label: "Expiry",       type: "date",     width: 110 },
    { name: "warehouse",  label: "Warehouse",    type: "link",     options: "warehouse", width: 150 },
    { name: "photo",      label: "Photo",        type: "check",    width: 70 },
    { name: "stage",      label: "Stage",        type: "select",
      options: ["Receiving","Counted","Photography","Stored"], width: 130 },
  ],
};

let nextId = 2;
function blankRow(): BatchDraft {
  return {
    id: "b" + nextId++,
    item: null, qty: 0, unit_cost: 0, lot_number: "",
    expiry: null,
    warehouse: warehouse[0]?.name ?? null,
    photo: true, stage: "Receiving",
  };
}

export default function IntakeWizard() {
  const [supp, setSupp] = useState<string>(supplier[0]?.name ?? "");
  const [rows, setRows] = useState<BatchDraft[]>([
    { id: "b1", item: null, qty: 0, unit_cost: 0, lot_number: "",
      expiry: null, warehouse: warehouse[0]?.name ?? null, photo: true, stage: "Receiving" },
    blankRow(),
  ]);

  const total = useMemo(
    () => rows.reduce((a, r) => a + (Number(r.qty) || 0) * (Number(r.unit_cost) || 0), 0),
    [rows]
  );
  const filled = rows.filter((r) => r.item && Number(r.qty) > 0).length;

  return (
    <SheetAppShell sheet="inventory" title="" subtitle="">
      {/* One supplier-pick row, no form chrome */}
      <div style={{
        display: "flex", alignItems: "center", gap: 12,
        padding: "10px 16px", background: "var(--surface)",
        borderBottom: "1px solid var(--border-hair)",
      }}>
        <span style={{ fontSize: 12, color: "var(--text-3)", textTransform: "uppercase", letterSpacing: ".06em" }}>
          Supplier
        </span>
        <div style={{ flex: 1, maxWidth: 320 }}>
          <PickCell
            value={supp}
            options={supplier.map((s) => ({
              id: s.name, label: s.name,
              meta: s.license_number ? `Lic ${s.license_number}` : s.supplier_type,
            }))}
            onChange={(v) => setSupp(String(v ?? ""))}
            placeholder="Type to find supplier…"
          />
        </div>
        <span style={{ fontSize: 12, color: "var(--text-3)" }}>
          {filled} {filled === 1 ? "batch" : "batches"} ready · running cost <strong style={{ color: "var(--text-1)" }}>{fmtCurrency(total)}</strong>
        </span>
      </div>

      <SheetTable
        doctype={INTAKE_DOCTYPE}
        rows={rows}
        onRowChange={(idx, patch) => {
          setRows((rs) => {
            const next = rs.map((r, i) => (i === idx ? { ...r, ...patch } : r));
            // Auto-add a new blank row when the last is filled in — keeps
            // the spreadsheet always inviting another entry, no toolbar.
            const last = next[next.length - 1];
            if (last && last.item && Number(last.qty) > 0) next.push(blankRow());
            return next;
          });
        }}
      />

      {/* Sticky commit bar — exactly one obvious action, mirrors Sell/Buy */}
      <div style={{
        display: "flex", justifyContent: "space-between", alignItems: "center",
        padding: "10px 16px", background: "var(--surface)",
        borderTop: "1px solid var(--border-hair)", boxShadow: "0 -2px 6px rgba(0,0,0,.04)",
      }}>
        <div style={{ fontSize: 12, color: "var(--text-3)" }}>
          Each filled row will become one Batch + one Purchase Receipt line, and the supplier bill will be queued.
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <span style={{ fontSize: 13, color: "var(--text-2)" }}>
            Total cost <strong style={{ color: "var(--text-1)", fontVariantNumeric: "tabular-nums" }}>{fmtCurrency(total)}</strong>
            {" "}· {fmtNum(filled)} batches
          </span>
          <button
            className="primary-pill"
            onClick={() => toast.success(`Posted ${filled} batches from ${supp}`)}
            disabled={filled === 0 || !supp}
            style={{
              padding: "8px 14px", borderRadius: 8,
              background: filled === 0 || !supp ? "#C7C7CC" : "linear-gradient(180deg, #007AFF, #0062D6)",
              color: "white", border: "none", fontSize: 13, fontWeight: 600,
              cursor: filled === 0 || !supp ? "not-allowed" : "pointer",
            }}
          >
            Commit intake
          </button>
        </div>
      </div>
    </SheetAppShell>
  );
}

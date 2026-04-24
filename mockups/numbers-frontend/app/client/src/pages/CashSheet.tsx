/*
 * /cash/new — Cash Ledger ritual.
 *
 * Z-style cash workflow: a single sheet with In / Out / Note rows,
 * a running balance computed in the rightmost column, and one
 * "Post to ledger" action that fans out to Payment Entry + GL Entry.
 *
 * Optional: each row can be tagged with a Customer or Supplier (search),
 * but if the user just types a date, an amount, and a note — that works.
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

export default function CashSheet() {
  const [cashLocation, setCashLocation] = useState<string | null>("Primary Vault Safe");
  const [openingBalance] = useState(18_400);
  const [shiftDate] = useState(addDays(0));
  const [closedBy] = useState<string>("you@terp.io");

  // Pre-populate with a couple of common rows so the sheet is never empty
  const [rows, setRows] = useState<RitualRow[]>([
    { date: shiftDate, party_label: "", in_amt: null, out_amt: null, note: "" },
    {},
    {},
  ]);

  const customers = DATA["customer"] ?? [];
  const suppliers = DATA["supplier"] ?? [];
  const cashLocs = DATA["cash-location"] ?? [];

  const cashLocOpts = cashLocs.map((c: any) => ({
    id: c.location_name,
    label: c.location_name,
    meta: fmtCurrency(c.current_balance),
  }));

  // Search across customers + suppliers; first column is "Party (search)"
  const searchMasters = (q: string): MasterMatch[] => {
    const query = q.trim().toLowerCase();
    const all = [
      ...customers.map((c: any) => ({ ...c, __kind: "Customer" as const })),
      ...suppliers.map((s: any) => ({ ...s, __kind: "Supplier" as const })),
    ];
    const filtered = query
      ? all.filter((p) => p.name.toLowerCase().includes(query))
      : all.slice(0, 8);
    return filtered.slice(0, 10).map((p: any) => ({
      id: p.name,
      primary: p.name,
      secondary: p.__kind === "Customer" ? "Customer" : "Supplier",
      tint: p.__kind === "Customer" ? "#34C759" : "#5AC8FA",
      ref: p,
    }));
  };

  const onPickMaster = (rowIndex: number, m: MasterMatch) => {
    setRows((rs) => {
      const next = [...rs];
      const prev = next[rowIndex] ?? {};
      next[rowIndex] = {
        ...prev,
        party_label: m.primary,
        party_kind: m.secondary,
        date: prev.date ?? shiftDate,
      };
      return next;
    });
  };

  const cols: Col[] = [
    { key: "date",        label: "Date",          kind: "text",              width: 110 },
    { key: "party_label", label: "Party (search)",kind: "text",              width: 220 },
    { key: "in_amt",      label: "In",            kind: "currency",          width: 110, align: "right" },
    { key: "out_amt",     label: "Out",           kind: "currency",          width: 110, align: "right" },
    { key: "note",        label: "Note",          kind: "text",              width: 280 },
    { key: "balance",     label: "Balance",       kind: "readonly-currency", width: 130, align: "right" },
  ];

  // Compute running balance + write into each row
  const rowsWithBalance = useMemo(() => {
    let bal = openingBalance;
    return rows.map((r) => {
      bal = bal + (Number(r.in_amt) || 0) - (Number(r.out_amt) || 0);
      return { ...r, balance: bal };
    });
  }, [rows, openingBalance]);

  const totalIn  = rows.reduce((a, r) => a + (Number(r.in_amt)  || 0), 0);
  const totalOut = rows.reduce((a, r) => a + (Number(r.out_amt) || 0), 0);
  const closing  = openingBalance + totalIn - totalOut;

  return (
    <SheetAppShell title={`Cash · ${cashLocation ?? "(pick location)"}`} subtitle="Cash Ledger — shift">
      <div
        className="ritual-head"
        style={{ gridTemplateColumns: "minmax(220px, 2fr) 140px 140px minmax(180px, 1.4fr) minmax(140px, 1fr)" }}
      >
        <PickCell
          label="Cash location"
          value={cashLocation}
          onChange={setCashLocation}
          options={cashLocOpts}
          placeholder="Pick a location…"
        />
        <div className="rh-cell">
          <div className="rh-label">Date</div>
          <div className="rh-value" style={{ fontVariantNumeric: "tabular-nums" }}>{shiftDate}</div>
        </div>
        <div className="rh-cell">
          <div className="rh-label">Opening</div>
          <div className="rh-value" style={{ fontVariantNumeric: "tabular-nums" }}>{fmtCurrency(openingBalance)}</div>
        </div>
        <div className="rh-cell">
          <div className="rh-label">Closed by</div>
          <div className="rh-value">{closedBy}</div>
        </div>
        <div className="rh-cell">
          <div className="rh-label">Closing</div>
          <div className="rh-value" style={{ fontVariantNumeric: "tabular-nums", color: closing < openingBalance ? "var(--danger)" : "var(--text-1)" }}>
            {fmtCurrency(closing)}
          </div>
        </div>
      </div>

      <RitualSheet
        cols={cols}
        rows={rowsWithBalance}
        onRowsChange={(next) => {
          // Strip the computed balance before storing — it's recomputed each render
          setRows(next.map(({ balance: _b, ...rest }) => rest));
        }}
        sumCol="in_amt"
        countLabel="entries"
        searchMasters={searchMasters}
        onPickMaster={onPickMaster}
        firstColPlaceholder="(date) — or just type an amount in the next column"
        addRowPrompt="+ click or just start typing a date / amount"
      />

      <div
        style={{
          height: 36, background: "var(--surface)",
          borderTop: "1px solid var(--border-hair)",
          display: "flex", alignItems: "center", justifyContent: "flex-end",
          padding: "0 16px", gap: 28, fontSize: 12, color: "var(--text-2)",
          fontVariantNumeric: "tabular-nums",
        }}
      >
        <span>Total in <b style={{ color: "var(--success)" }}>{fmtCurrency(totalIn)}</b></span>
        <span>Total out <b style={{ color: "var(--danger)" }}>{fmtCurrency(totalOut)}</b></span>
        <span style={{ fontSize: 13, color: "var(--text-1)", fontWeight: 600 }}>Net {fmtCurrency(totalIn - totalOut)}</span>
      </div>

      <div className="ritual-bar">
        <span style={{ fontSize: 12, color: "var(--text-3)", marginRight: "auto" }}>
          Posts as Payment Entries (Receive / Pay) + GL contra to <b>1000 — Cash</b>
        </span>
        <button className="btn-ghost" onClick={() => toast("Saved draft")}>Save draft</button>
        <button
          className="btn-primary"
          disabled={rows.every((r) => !(r.in_amt || r.out_amt))}
          onClick={() => {
            const n = rows.filter((r) => (r.in_amt || r.out_amt)).length;
            toast.success(`Posted ${n} cash entr${n === 1 ? "y" : "ies"} — closing ${fmtCurrency(closing)}`);
          }}
        >
          Post to ledger
        </button>
      </div>

      <SheetTabBar
        tabs={[
          { key: "shift",      label: "Shift",     count: rows.filter((r) => (r.in_amt || r.out_amt)).length, color: "#FF9500" },
          { key: "yesterday",  label: "Yesterday" },
          { key: "this-week",  label: "This week" },
          { key: "audit",      label: "Audit" },
        ]}
        active="shift"
        onSelect={() => toast("Tab switching — demo")}
        position="bottom"
      />
    </SheetAppShell>
  );
}

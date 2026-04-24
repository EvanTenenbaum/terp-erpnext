/*
 * /pay/new — Payment sheet (handles both directions).
 *
 * Direction picker (Receive money / Pay money) at the top determines
 * whether the party is a Customer or Supplier and what invoices appear.
 *
 * The user types in column A:
 *   • an invoice # (INV-00121 or PI-0403)  → row autofills with party + amount due
 *   • OR a party name                     → all of that party's outstanding invoices
 * Type the amount in the "This payment" column (defaults to the full balance);
 * Tab to allocate the next one. One Commit → posts a Payment Entry that
 * auto-allocates across the lines.
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
const isoDay = today.toISOString().slice(0, 10);

export default function PaySheet() {
  const [direction, setDirection] = useState<"Receive" | "Pay">("Receive");
  const [partyId, setPartyId] = useState<string | null>(null);
  const [mode, setMode] = useState<string | null>("ACH");
  const [refNo, setRefNo] = useState<string>("");
  const [notes, setNotes] = useState("");

  const [rows, setRows] = useState<RitualRow[]>([{}, {}, {}]);

  const customers = DATA["customer"] ?? [];
  const suppliers = DATA["supplier"] ?? [];
  const salesInvoices = (DATA["sales-invoice"] ?? []) as any[];
  const purchaseInvoices = (DATA["purchase-invoice"] ?? []) as any[];

  const isReceive = direction === "Receive";
  const partyOpts = (isReceive ? customers : suppliers).map((p: any) => ({
    id: p.name, label: p.name,
    meta: isReceive
      ? `owes ${fmtCurrency(p.credit_used ?? 0)}`
      : (p.is_buyer ? "also buys from us" : (p.supplier_type ?? "")),
    tint: isReceive ? "#34C759" : "#FF9500",
  }));

  const modeOpts = [
    { id: "ACH",         label: "ACH",         meta: "default" },
    { id: "Wire",        label: "Wire" },
    { id: "Cash",        label: "Cash" },
    { id: "Check",       label: "Check" },
    { id: "Credit Card", label: "Credit Card" },
  ];

  const openInvoices = useMemo(() => {
    const pool = isReceive ? salesInvoices : purchaseInvoices;
    return pool.filter((iv: any) => Number(iv.outstanding_amount) > 0);
  }, [isReceive, salesInvoices, purchaseInvoices]);

  const partyInvoices = useMemo(() => {
    if (!partyId) return [];
    return openInvoices.filter((iv: any) =>
      isReceive ? iv.customer === partyId : iv.supplier === partyId,
    );
  }, [openInvoices, partyId, isReceive]);

  const totalApplied = useMemo(
    () => rows.reduce((a, r) => a + (Number(r.applied) || 0), 0),
    [rows],
  );

  // ── Type-to-search for invoices ──────────────────────────────
  const searchMasters = (query: string): MasterMatch[] => {
    const q = query.trim().toLowerCase();
    const pool = partyId ? partyInvoices : openInvoices;
    if (!q) return pool.slice(0, 8).map(invToMatch);
    const hits = pool.filter((iv: any) => {
      const partyKey = isReceive ? iv.customer : iv.supplier;
      const hay = [iv.name, partyKey, iv.status].join(" ").toLowerCase();
      return hay.includes(q);
    });
    return hits.slice(0, 10).map(invToMatch);
  };

  function invToMatch(iv: any): MasterMatch {
    const partyKey = isReceive ? iv.customer : iv.supplier;
    const overdue = (iv.due_date && iv.due_date < isoDay);
    return {
      id: iv.name,
      primary: `${iv.name} · ${partyKey}`,
      secondary: `${iv.status}${iv.due_date ? ` · due ${iv.due_date}` : ""}${overdue ? " · overdue" : ""}${iv.due_now ? " · due now" : ""}`,
      meta: fmtCurrency(iv.outstanding_amount),
      tint: overdue || iv.due_now ? "#FF3B30"
          : iv.status === "Partly Paid" ? "#FF9500"
          : "#34C759",
      ref: iv,
    };
  }

  const onPickMaster = (rowIndex: number, m: MasterMatch) => {
    setRows((rs) => {
      const next = [...rs];
      const iv = m.ref;
      next[rowIndex] = {
        ...next[rowIndex],
        ref_inv: iv.name,
        party_label: isReceive ? iv.customer : iv.supplier,
        due_date: iv.due_date,
        balance: iv.outstanding_amount,
        applied: iv.outstanding_amount,
      };
      // Auto-set party picker on first pick
      if (!partyId) setPartyId(isReceive ? iv.customer : iv.supplier);
      return next;
    });
  };

  const cols: Col[] = [
    { key: "ref_inv",      label: "Invoice (search)", kind: "text",              width: 180 },
    { key: "party_label",  label: isReceive ? "Customer" : "Supplier", kind: "readonly-text", width: 180 },
    { key: "due_date",     label: "Due",              kind: "readonly-text",     width: 110 },
    { key: "balance",      label: "Balance",          kind: "readonly-currency", width: 120, align: "right" },
    { key: "applied",      label: "This payment",     kind: "currency",          width: 130, align: "right" },
  ];

  return (
    <SheetAppShell
      title={`${isReceive ? "Money in" : "Money out"} · ${partyId ?? "(any party)"}`}
      subtitle={`${isReceive ? "Receive payment" : "Pay supplier"} — draft`}
    >
      <div
        className="ritual-head"
        style={{ gridTemplateColumns: "180px minmax(220px, 2fr) 130px 140px minmax(160px, 1.2fr)" }}
      >
        <PickCell
          label="Direction"
          value={direction}
          onChange={(id) => {
            setDirection(id as any);
            setPartyId(null);
            setRows([{}, {}, {}]);
          }}
          options={[
            { id: "Receive", label: "Receive money", meta: "from a customer", tint: "#34C759" },
            { id: "Pay",     label: "Pay money",     meta: "to a supplier",   tint: "#FF9500" },
          ]}
        />
        <PickCell
          label={isReceive ? "Customer" : "Supplier"}
          value={partyId}
          onChange={(id) => setPartyId(id)}
          options={partyOpts}
          placeholder={isReceive ? "Any customer with a balance" : "Any supplier with a balance"}
        />
        <div className="rh-cell">
          <div className="rh-label">Date</div>
          <div className="rh-value" style={{ fontVariantNumeric: "tabular-nums" }}>{isoDay}</div>
        </div>
        <PickCell
          label="Method"
          value={mode}
          onChange={(id) => setMode(id)}
          options={modeOpts}
        />
        <div className="rh-cell">
          <div className="rh-label">Reference #</div>
          <input
            className="pick-cell"
            value={refNo}
            onChange={(e) => setRefNo(e.target.value)}
            placeholder={mode === "Wire" ? "WIRE-…" : mode === "ACH" ? "ACH-…" : "Optional"}
            style={{ fontSize: 14, fontWeight: 600, color: "var(--text-1)" }}
          />
        </div>
      </div>

      <RitualSheet
        cols={cols}
        rows={rows}
        onRowsChange={setRows}
        sumCol="applied"
        countLabel="invoices"
        searchMasters={searchMasters}
        onPickMaster={onPickMaster}
        firstColPlaceholder="Type an invoice # or party name…"
        addRowPrompt="+ click or just start typing an invoice # or party name"
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
        <span>Total applied <b style={{ color: "var(--text-1)" }}>{fmtCurrency(totalApplied)}</b></span>
      </div>

      <div className="ritual-bar">
        <input
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Memo (optional)"
          style={{
            all: "unset", flex: 1, fontSize: 12, color: "var(--text-2)",
            background: "#F4F4F6", padding: "6px 10px", borderRadius: 6,
          }}
        />
        <button className="btn-ghost" onClick={() => toast("Saved draft")}>Save draft</button>
        <button
          className="btn-primary"
          disabled={totalApplied <= 0}
          onClick={() => toast.success(
            `${isReceive ? "Received" : "Paid"} ${fmtCurrency(totalApplied)} across ${rows.filter((r) => r.applied).length} invoice(s)`,
          )}
        >
          {isReceive ? "Record receipt" : "Record payment"}
        </button>
      </div>

      <SheetTabBar
        tabs={[
          { key: "draft",   label: "Draft",   count: rows.filter((r) => r.applied).length, color: isReceive ? "#34C759" : "#FF9500" },
          { key: "history", label: "History" },
          { key: "audit",   label: "Audit" },
        ]}
        active="draft"
        onSelect={() => toast("Tab switching — demo")}
        position="bottom"
      />
    </SheetAppShell>
  );
}

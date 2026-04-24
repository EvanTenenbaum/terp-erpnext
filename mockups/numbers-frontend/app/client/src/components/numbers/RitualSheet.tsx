/*
 * RitualSheet — the shared body for Sell / Buy / Receive / Pay.
 * Interaction rules (NO copy-paste anywhere):
 *   • Each row's first cell is a type-to-search field.
 *   • As the user types, a dropdown below the cell shows matching master records
 *     (batches, items, strains, customers, suppliers — whatever the caller
 *     feeds in via `searchMasters`).
 *   • Arrow-keys navigate, Enter or Tab commits. Picking a row runs
 *     `onPickMaster` so the caller can autofill the remaining columns.
 *   • All other cells are ordinary inline editors (currency, number, select,
 *     readonly).
 *   • Column letters (A, B, C…) + row numbers on the gutter keep the Numbers
 *     look; live Count / Sum / Avg footer.
 */
import { useEffect, useMemo, useRef, useState, type KeyboardEvent } from "react";
import { fmtCurrency } from "@/lib/format";

export type ColKind =
  | "text" | "number" | "currency" | "select"
  | "readonly-text" | "readonly-currency" | "readonly-number";

export interface Col {
  key: string;
  label: string;
  kind: ColKind;
  width: number;
  options?: string[];
  align?: "left" | "right";
  suffix?: string;
}

export interface RitualRow {
  [key: string]: any;
  __warn?: Record<string, string>;
}

export interface MasterMatch {
  id: string;
  primary: string;          // bold top line, usually strain/name
  secondary?: string;       // smaller subtitle (SKU / batch / supplier)
  /** right-aligned meta, e.g. "120g · $85" */
  meta?: string;
  /** Tiny coloured dot */
  tint?: string;
  /** Raw reference — caller gets it back through onPickMaster */
  ref: any;
  /** When true, this is a "create new" hint row */
  isCreate?: boolean;
}

const colLetter = (i: number) => {
  let s = ""; let n = i;
  while (true) {
    s = String.fromCharCode(65 + (n % 26)) + s;
    n = Math.floor(n / 26) - 1; if (n < 0) break;
  }
  return s;
};

export default function RitualSheet({
  cols, rows, onRowsChange,
  sumCol, countLabel = "rows",
  searchMasters, onPickMaster,
  firstColPlaceholder = "Type a strain, SKU, batch…",
  addRowPrompt = "+ add row — or just start typing below",
}: {
  cols: Col[];
  rows: RitualRow[];
  onRowsChange: (next: RitualRow[]) => void;
  sumCol?: string;
  countLabel?: string;
  /** Called as the user types in the first column. Must be synchronous. */
  searchMasters?: (query: string) => MasterMatch[];
  /** Called when the user picks (click or Enter). Caller fills the row. */
  onPickMaster?: (rowIndex: number, match: MasterMatch) => void;
  firstColPlaceholder?: string;
  addRowPrompt?: string;
}) {
  const gridTemplate =
    "28px " + cols.map((c) => `minmax(${Math.max(80, c.width)}px, ${c.width}px)`).join(" ");

  const [editing, setEditing] = useState<null | { r: number; c: number; }>(null);
  const [draft, setDraft] = useState("");
  const [showDrop, setShowDrop] = useState(false);
  const [hover, setHover] = useState(0);
  const tableRef = useRef<HTMLDivElement>(null);

  const matches = useMemo<MasterMatch[]>(() => {
    if (!showDrop || !searchMasters) return [];
    return searchMasters(draft);
  }, [draft, showDrop, searchMasters]);

  useEffect(() => { setHover(0); }, [matches]);

  const updateCell = (r: number, k: string, v: any) => {
    const next = [...rows];
    const row = { ...(next[r] ?? {}) };
    row[k] = v;
    if (("qty" in row) && ("unit_price" in row)) row.line_total = (Number(row.qty) || 0) * (Number(row.unit_price) || 0);
    if (("qty" in row) && ("unit_cost" in row))  row.line_total = (Number(row.qty) || 0) * (Number(row.unit_cost) || 0);
    next[r] = row;
    onRowsChange(next);
  };

  const commit = () => {
    if (!editing) return;
    const col = cols[editing.c];
    const r = editing.r;
    let v: any = draft;
    if (col.kind === "number" || col.kind === "currency") {
      v = draft === "" ? null : Number(String(draft).replace(/[^0-9.\-]/g, ""));
    }
    updateCell(r, col.key, v);
    setEditing(null); setDraft(""); setShowDrop(false);
  };

  const onCellKey = (e: KeyboardEvent) => {
    if (!editing) return;
    // First column: if dropdown is open, keys navigate matches
    if (editing.c === 0 && showDrop && matches.length > 0) {
      if (e.key === "ArrowDown") { e.preventDefault(); setHover((h) => Math.min(h + 1, matches.length - 1)); return; }
      if (e.key === "ArrowUp")   { e.preventDefault(); setHover((h) => Math.max(h - 1, 0)); return; }
      if (e.key === "Enter" || e.key === "Tab") {
        e.preventDefault();
        const m = matches[hover];
        onPickMaster?.(editing.r, m);
        setEditing(null); setDraft(""); setShowDrop(false);
        return;
      }
    }
    if (e.key === "Enter") { e.preventDefault(); commit(); }
    else if (e.key === "Escape") { setEditing(null); setDraft(""); setShowDrop(false); }
    else if (e.key === "Tab") {
      e.preventDefault(); commit();
      const nextC = editing.c + 1 < cols.length ? editing.c + 1 : 0;
      const nextR = editing.c + 1 < cols.length ? editing.r : editing.r + 1;
      setTimeout(() => {
        if (nextR >= rows.length) { onRowsChange([...rows, {}]); }
        setEditing({ r: nextR, c: nextC }); setDraft(""); setShowDrop(nextC === 0);
      }, 0);
    }
  };

  const startEdit = (r: number, c: number) => {
    const col = cols[c];
    if (col.kind.startsWith("readonly")) return;
    setEditing({ r, c });
    const curr = rows[r]?.[col.key];
    setDraft(curr === undefined || curr === null ? "" : String(curr));
    setShowDrop(c === 0 && !!searchMasters);
  };

  const sum = sumCol ? rows.reduce((acc, row) => acc + (Number(row[sumCol]) || 0), 0) : 0;
  const count = rows.filter((r) => cols.some((c) => r[c.key] !== null && r[c.key] !== undefined && r[c.key] !== "")).length;
  const avg = count ? sum / count : 0;

  const renderValue = (row: RitualRow, col: Col) => {
    const v = row[col.key];
    if (v === null || v === undefined || v === "") return <span style={{ color: "var(--text-3)" }}>—</span>;
    if (col.kind === "currency" || col.kind === "readonly-currency") return fmtCurrency(Number(v));
    if (col.kind === "number" || col.kind === "readonly-number") return new Intl.NumberFormat("en-US").format(Number(v)) + (col.suffix ? " " + col.suffix : "");
    return String(v);
  };

  const rowHasWarn = (row: RitualRow) => row.__warn && Object.keys(row.__warn).length > 0;

  return (
    <div ref={tableRef} style={{ flex: 1, overflow: "auto", background: "var(--canvas)", position: "relative" }} className="num-scroll">
      {/* Column letters */}
      <div
        style={{
          display: "grid", gridTemplateColumns: gridTemplate,
          position: "sticky", top: 0, zIndex: 5,
          background: "#F5F5F7", borderBottom: "1px solid var(--border-hair)",
        }}
      >
        <div style={{ width: 28, height: 20, background: "#F5F5F7", borderRight: "1px solid var(--border-hair)" }} />
        {cols.map((c, i) => (
          <div key={c.key} style={{
            height: 20, fontSize: 10, color: "var(--text-3)", letterSpacing: ".06em",
            textAlign: "center", borderRight: "1px solid var(--border-soft)",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>{colLetter(i)}</div>
        ))}
      </div>

      {/* Caption */}
      <div
        style={{
          display: "grid", gridTemplateColumns: gridTemplate,
          position: "sticky", top: 20, zIndex: 5,
          background: "var(--surface)", borderBottom: "1px solid var(--border-hair)",
        }}
      >
        <div style={{ width: 28, background: "#FAFAFC", borderRight: "1px solid var(--border-hair)" }} />
        {cols.map((c) => (
          <div key={c.key} style={{
            height: 28, padding: "0 12px", fontSize: 11, color: "var(--text-2)",
            letterSpacing: ".04em", textTransform: "uppercase", fontWeight: 600,
            borderRight: "1px solid var(--border-soft)",
            display: "flex", alignItems: "center",
            justifyContent: c.align === "right" ? "flex-end" : "flex-start",
          }}>{c.label}</div>
        ))}
      </div>

      {/* Data rows */}
      {rows.map((row, r) => {
        return (
          <div
            key={r}
            style={{
              display: "grid", gridTemplateColumns: gridTemplate,
              borderBottom: "1px solid var(--border-soft)",
              background: rowHasWarn(row) ? "#FFFBF2" : "var(--surface)",
              transition: "background .12s var(--ease-out)",
            }}
          >
            <div style={{
              width: 28, fontSize: 11, color: "var(--text-3)", textAlign: "center",
              background: "#FAFAFC", borderRight: "1px solid var(--border-hair)",
              display: "flex", alignItems: "center", justifyContent: "center", height: 32,
            }}>{r + 1}</div>

            {cols.map((c, ci) => {
              const editable = !c.kind.startsWith("readonly");
              const isEditing = editing && editing.r === r && editing.c === ci;
              const warn = row.__warn?.[c.key];
              return (
                <div
                  key={c.key}
                  onClick={() => startEdit(r, ci)}
                  onDoubleClick={() => startEdit(r, ci)}
                  tabIndex={editable ? 0 : -1}
                  style={{
                    height: 32, borderRight: "1px solid var(--border-soft)",
                    position: "relative",
                    display: "flex", alignItems: "center",
                    padding: "0 12px",
                    justifyContent: c.align === "right" ? "flex-end" : "flex-start",
                    fontVariantNumeric: (c.kind === "currency" || c.kind === "number" || c.kind === "readonly-currency" || c.kind === "readonly-number") ? "tabular-nums" : "normal",
                    background: isEditing ? "#F4F8FF" : warn ? "#FFF4E5" : "transparent",
                    cursor: editable ? "text" : "default",
                    color: c.kind.startsWith("readonly") ? "var(--text-2)" : "var(--text-1)",
                    fontWeight: c.kind.startsWith("readonly") ? 400 : 500,
                    fontSize: 13,
                    boxShadow: isEditing ? "inset 0 0 0 2px var(--accent-blue)" : undefined,
                    gap: 6,
                  }}
                  title={warn ?? undefined}
                >
                  {isEditing ? (
                    c.kind === "select" ? (
                      <select
                        autoFocus
                        value={draft}
                        onChange={(e) => setDraft(e.target.value)}
                        onBlur={commit}
                        style={{ width: "100%", border: "none", outline: "none", background: "transparent", fontSize: 13 }}
                      >
                        <option value="">—</option>
                        {(c.options ?? []).map((o) => <option key={o} value={o}>{o}</option>)}
                      </select>
                    ) : (
                      <>
                        <input
                          autoFocus
                          value={draft}
                          onChange={(e) => { setDraft(e.target.value); if (ci === 0) setShowDrop(true); }}
                          onBlur={() => setTimeout(commit, 100)}  /* let click in dropdown land first */
                          onKeyDown={onCellKey}
                          style={{ width: "100%", border: "none", outline: "none", background: "transparent", fontSize: 13, textAlign: c.align === "right" ? "right" : "left" }}
                          placeholder={ci === 0 ? firstColPlaceholder : ""}
                        />
                        {/* Dropdown when editing the first column */}
                        {ci === 0 && showDrop && matches.length > 0 && (
                          <div className="pick-pop" style={{
                            top: 32, left: 0, right: "auto", minWidth: 340, maxWidth: 460,
                          }}>
                            {matches.map((m, i) => (
                              <div
                                key={m.id + i}
                                className={"pick-pop-item " + (m.isCreate ? "pick-pop-create" : "")}
                                aria-selected={hover === i}
                                onMouseEnter={() => setHover(i)}
                                onMouseDown={(e) => {
                                  e.preventDefault();
                                  onPickMaster?.(r, m);
                                  setEditing(null); setDraft(""); setShowDrop(false);
                                }}
                              >
                                {m.tint && <span style={{ width: 8, height: 8, borderRadius: 999, background: m.tint, flexShrink: 0 }} />}
                                <div style={{ display: "flex", flexDirection: "column", minWidth: 0 }}>
                                  <div style={{ fontSize: 13, fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                                    {m.primary}
                                  </div>
                                  {m.secondary && (
                                    <div style={{ fontSize: 11, color: "var(--text-3)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                                      {m.secondary}
                                    </div>
                                  )}
                                </div>
                                {m.meta && <span className="meta">{m.meta}</span>}
                              </div>
                            ))}
                          </div>
                        )}
                      </>
                    )
                  ) : (
                    <>
                      <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {renderValue(row, c)}
                      </span>
                      {warn && ci === (cols.length - 1) && <span className="warn-inline">{warn}</span>}
                    </>
                  )}
                </div>
              );
            })}
          </div>
        );
      })}

      {/* Add-row prompt */}
      <div
        onClick={() => {
          const next = [...rows, {}];
          onRowsChange(next);
          setTimeout(() => { setEditing({ r: next.length - 1, c: 0 }); setDraft(""); setShowDrop(!!searchMasters); }, 0);
        }}
        style={{
          display: "grid", gridTemplateColumns: gridTemplate,
          borderBottom: "1px solid var(--border-soft)",
          background: "var(--surface)", cursor: "pointer",
        }}
      >
        <div style={{
          width: 28, fontSize: 13, color: "var(--accent-blue)", textAlign: "center",
          background: "#FAFAFC", borderRight: "1px solid var(--border-hair)",
          display: "flex", alignItems: "center", justifyContent: "center", height: 30,
        }}>+</div>
        <div style={{ gridColumn: `span ${cols.length}`, height: 30, display: "flex", alignItems: "center", padding: "0 12px", fontSize: 12, color: "var(--text-3)" }}>
          {addRowPrompt}
        </div>
      </div>

      {/* Footer summary */}
      <div
        style={{
          display: "grid", gridTemplateColumns: gridTemplate,
          position: "sticky", bottom: 0,
          borderTop: "1px solid var(--border-hair)",
          background: "#F9F9FB",
        }}
      >
        <div style={{ width: 28, background: "#F1F1F3", borderRight: "1px solid var(--border-hair)", height: 30 }} />
        <div style={{
          gridColumn: `span ${cols.length}`, height: 30, display: "flex",
          alignItems: "center", justifyContent: "flex-end", gap: 16,
          padding: "0 12px", fontSize: 12, color: "var(--text-2)", fontVariantNumeric: "tabular-nums",
        }}>
          <span>Count <b style={{ color: "var(--text-1)" }}>{count}</b> {countLabel}</span>
          {sumCol && <span>Sum <b style={{ color: "var(--text-1)" }}>{fmtCurrency(sum)}</b></span>}
          {sumCol && <span>Avg <b style={{ color: "var(--text-1)" }}>{fmtCurrency(avg)}</b></span>}
        </div>
      </div>
    </div>
  );
}

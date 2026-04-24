/*
 * SheetTable — Apple Numbers-faithful spreadsheet surface.
 * No formula authoring. Just: column letters, row number gutter,
 * click-drag range selection with live Count/Sum/Avg in the footer,
 * right-click row + right-click column menus, inline editing,
 * and an empty "+" row at the bottom for direct insertion.
 */
import { useMemo, useState, useRef, useEffect, useCallback } from "react";
import type { DocTypeDef, FieldDef } from "@/data/schema";
import CellEditor from "./CellEditor";
import { ChevronDown, ChevronUp } from "lucide-react";
import { fmtCurrency, fmtNum } from "@/lib/format";
import { toast } from "sonner";

type SortDir = "asc" | "desc" | null;

/** A -> 0, Z -> 25, AA -> 26, etc. */
function colLetter(i: number) {
  let n = i, s = "";
  while (true) {
    s = String.fromCharCode(65 + (n % 26)) + s;
    n = Math.floor(n / 26) - 1;
    if (n < 0) break;
  }
  return s;
}

export default function SheetTable({
  doctype,
  rows,
  onRowChange,
  selectedId,
  onSelect,
  onOpen,
  search = "",
  extraColumnLabel,
  renderExtra,
}: {
  doctype: DocTypeDef;
  rows: any[];
  onRowChange?: (idx: number, patch: any) => void;
  selectedId?: string | null;
  onSelect?: (row: any) => void;
  onOpen?: (row: any) => void;
  search?: string;
  extraColumnLabel?: string;
  renderExtra?: (row: any) => React.ReactNode;
  tint?: string;
}) {
  const [sortField, setSortField] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<SortDir>(null);
  const [editing, setEditing] = useState<{ row: number; col: number } | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Range selection {r1,c1,r2,c2} inclusive row & col indices (col = field index)
  const [range, setRange] = useState<{ r1: number; c1: number; r2: number; c2: number } | null>(null);
  const [dragAnchor, setDragAnchor] = useState<{ r: number; c: number } | null>(null);

  // Row/col context menu
  const [ctx, setCtx] = useState<null | {
    x: number; y: number;
    kind: "row" | "col" | "rownum";
    rowIndex?: number; colIndex?: number;
  }>(null);

  const fields = doctype.fields;

  const filteredRows = useMemo(() => {
    const q = search.trim().toLowerCase();
    let out = rows;
    if (q) {
      out = rows.filter((r) =>
        Object.values(r).some((v) => v !== null && String(v).toLowerCase().includes(q))
      );
    }
    if (sortField && sortDir) {
      out = [...out].sort((a, b) => {
        const av = a[sortField]; const bv = b[sortField];
        if (av === null || av === undefined) return 1;
        if (bv === null || bv === undefined) return -1;
        if (typeof av === "number" && typeof bv === "number")
          return sortDir === "asc" ? av - bv : bv - av;
        return sortDir === "asc"
          ? String(av).localeCompare(String(bv))
          : String(bv).localeCompare(String(av));
      });
    }
    return out;
  }, [rows, search, sortField, sortDir]);

  const totalRows = filteredRows.length;

  // Default summary when nothing selected: sum of the first currency/number column
  const defaultField = useMemo<FieldDef | undefined>(
    () =>
      fields.find((f) => f.type === "currency") ??
      fields.find((f) => f.type === "int" || f.type === "float"),
    [fields]
  );

  /** Given a range, compute Count/Sum/Avg over any numeric cells inside it.
   *  If the range spans a single column, sum/avg describe that column.
   *  Mirrors Numbers' behaviour when you drag-select cells. */
  const rangeStats = useMemo(() => {
    // Build a default range when nothing selected: all rows × defaultField
    const def = defaultField ? fields.findIndex((f) => f.name === defaultField.name) : -1;
    const r = range ?? (def >= 0 ? { r1: 0, c1: def, r2: Math.max(0, totalRows - 1), c2: def } : null);
    if (!r || totalRows === 0)
      return { count: totalRows, sum: 0, avg: null as number | null, scope: "rows" as const };

    const [r1, r2] = [Math.min(r.r1, r.r2), Math.max(r.r1, r.r2)];
    const [c1, c2] = [Math.min(r.c1, r.c2), Math.max(r.c1, r.c2)];

    let count = 0, sum = 0, numericCount = 0;
    const isNumField: boolean[] = fields.map((f) =>
      f.type === "int" || f.type === "float" || f.type === "currency" || f.type === "percent"
    );

    for (let rr = r1; rr <= r2 && rr < totalRows; rr++) {
      for (let cc = c1; cc <= c2 && cc < fields.length; cc++) {
        count++;
        if (isNumField[cc]) {
          const v = filteredRows[rr]?.[fields[cc].name];
          if (typeof v === "number") { sum += v; numericCount++; }
        }
      }
    }
    const avg = numericCount > 0 ? sum / numericCount : null;
    return { count, sum, avg, scope: range ? ("range" as const) : ("rows" as const) };
  }, [range, filteredRows, fields, defaultField, totalRows]);

  const rangeLabel = useMemo(() => {
    if (!range) return null;
    const [r1, r2] = [Math.min(range.r1, range.r2), Math.max(range.r1, range.r2)];
    const [c1, c2] = [Math.min(range.c1, range.c2), Math.max(range.c1, range.c2)];
    const topLeft  = `${colLetter(c1)}${r1 + 1}`;
    const botRight = `${colLetter(c2)}${r2 + 1}`;
    return r1 === r2 && c1 === c2 ? topLeft : `${topLeft}:${botRight}`;
  }, [range]);

  const toggleSort = (name: string) => {
    if (sortField !== name) { setSortField(name); setSortDir("asc"); return; }
    if (sortDir === "asc") { setSortDir("desc"); return; }
    if (sortDir === "desc") { setSortField(null); setSortDir(null); return; }
  };

  const inRange = useCallback((ri: number, ci: number) => {
    if (!range) return false;
    const [r1, r2] = [Math.min(range.r1, range.r2), Math.max(range.r1, range.r2)];
    const [c1, c2] = [Math.min(range.c1, range.c2), Math.max(range.c1, range.c2)];
    return ri >= r1 && ri <= r2 && ci >= c1 && ci <= c2;
  }, [range]);

  // Global keydown: Enter opens, Esc clears selection/edit, arrows navigate
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!(e.target as HTMLElement).closest("[data-sheet-table]")) return;
      if (e.key === "Escape") { setEditing(null); setRange(null); return; }
      if (e.key === "Enter" && selectedId) {
        const r = filteredRows.find((x) => (x.id ?? x.name) === selectedId);
        if (r) onOpen?.(r);
        return;
      }
      if (!range) return;
      const move = (dr: number, dc: number) => {
        const nr = Math.min(Math.max(range.r2 + dr, 0), Math.max(0, totalRows - 1));
        const nc = Math.min(Math.max(range.c2 + dc, 0), fields.length - 1);
        if (e.shiftKey) setRange({ ...range, r2: nr, c2: nc });
        else setRange({ r1: nr, c1: nc, r2: nr, c2: nc });
        e.preventDefault();
      };
      if (e.key === "ArrowDown")  move(1, 0);
      if (e.key === "ArrowUp")    move(-1, 0);
      if (e.key === "ArrowRight") move(0, 1);
      if (e.key === "ArrowLeft")  move(0, -1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [selectedId, filteredRows, onOpen, range, totalRows, fields.length]);

  // Close context menu on outside click / Esc
  useEffect(() => {
    if (!ctx) return;
    const close = () => setCtx(null);
    window.addEventListener("click", close);
    window.addEventListener("scroll", close, true);
    return () => {
      window.removeEventListener("click", close);
      window.removeEventListener("scroll", close, true);
    };
  }, [ctx]);

  return (
    <div ref={containerRef} data-sheet-table
      className="num-scroll" style={{ overflow: "auto", flex: 1, background: "var(--surface)" }}>
      <table className="num-table">
        <colgroup>
          <col style={{ width: 36 }} />
          {fields.map((f) => (
            <col key={f.name} style={{ width: f.width ?? 140, minWidth: f.width ?? 140 }} />
          ))}
          {extraColumnLabel && <col style={{ width: 160 }} />}
        </colgroup>

        <thead>
          {/* Row 1 — column letters (A B C …) */}
          <tr className="col-letters">
            <th className="gutter corner"></th>
            {fields.map((_, i) => (
              <th key={"L" + i}
                onContextMenu={(e) => { e.preventDefault(); setCtx({ x: e.clientX, y: e.clientY, kind: "col", colIndex: i }); }}
              ><div className="cell cell-letter">{colLetter(i)}</div></th>
            ))}
            {extraColumnLabel && <th><div className="cell cell-letter">{colLetter(fields.length)}</div></th>}
          </tr>
          {/* Row 2 — field labels */}
          <tr>
            <th className="gutter"></th>
            {fields.map((f) => {
              const isSorted = sortField === f.name;
              const numeric = ["int","float","currency","percent"].includes(f.type);
              const isStatus = f.type === "select";
              return (
                <th key={f.name}
                  className={isStatus ? "col-status" : undefined}
                  onClick={() => toggleSort(f.name)}
                  onContextMenu={(e) => {
                    e.preventDefault();
                    setCtx({ x: e.clientX, y: e.clientY, kind: "col", colIndex: fields.indexOf(f) });
                  }}
                  style={{ cursor: "pointer" }}>
                  <div className="cell" style={{ justifyContent: numeric ? "flex-end" : "space-between" }}>
                    <span>{f.label}</span>
                    {isSorted && (sortDir === "asc" ? <ChevronUp size={11} /> : <ChevronDown size={11} />)}
                  </div>
                </th>
              );
            })}
            {extraColumnLabel && <th><div className="cell">{extraColumnLabel}</div></th>}
          </tr>
        </thead>

        <tbody>
          {filteredRows.map((r, ri) => {
            const id = r.id ?? r.name ?? JSON.stringify(r).slice(0, 30);
            const selected = selectedId === id;
            return (
              <tr
                key={id}
                className={selected ? "selected" : ""}
                onClick={() => onSelect?.(r)}
                style={{ cursor: "pointer" }}
              >
                <td
                  className="gutter"
                  onContextMenu={(e) => { e.preventDefault(); setCtx({ x: e.clientX, y: e.clientY, kind: "row", rowIndex: ri }); }}
                  onDoubleClick={(e) => { e.stopPropagation(); onOpen?.(r); }}
                  title="Double-click to open row"
                >{ri + 1}</td>

                {fields.map((f, fi) => {
                  const isEdit = editing?.row === ri && editing?.col === fi;
                  const selCell = inRange(ri, fi);
                  return (
                    <td key={f.name}
                      className={selCell ? "range-cell" : undefined}
                      onMouseDown={(e) => {
                        if (isEdit) return;
                        // drag-range start
                        setDragAnchor({ r: ri, c: fi });
                        setRange({ r1: ri, c1: fi, r2: ri, c2: fi });
                        e.stopPropagation();
                      }}
                      onMouseEnter={() => {
                        if (dragAnchor) setRange({ r1: dragAnchor.r, c1: dragAnchor.c, r2: ri, c2: fi });
                      }}
                      onMouseUp={() => setDragAnchor(null)}
                      onDoubleClick={() => { if (!f.readonly) setEditing({ row: ri, col: fi }); }}
                      onContextMenu={(e) => {
                        e.preventDefault();
                        setCtx({ x: e.clientX, y: e.clientY, kind: "row", rowIndex: ri, colIndex: fi });
                      }}
                      onClick={(e) => { if (isEdit) e.stopPropagation(); }}
                    >
                      <CellEditor
                        field={f}
                        value={r[f.name]}
                        editing={isEdit}
                        onStartEdit={() => !f.readonly && setEditing({ row: ri, col: fi })}
                        onStopEdit={() => setEditing(null)}
                        onCommit={(v) => {
                          onRowChange?.(ri, { [f.name]: v });
                          setEditing(null);
                        }}
                      />
                    </td>
                  );
                })}
                {extraColumnLabel && (
                  <td onClick={(e) => e.stopPropagation()}>
                    <div className="cell">{renderExtra?.(r)}</div>
                  </td>
                )}
              </tr>
            );
          })}

          {/* Inline-insert row ("+") at the bottom — Numbers-style */}
          <tr className="add-row"
              onClick={() => toast("Click any cell to start typing a new row")}>
            <td className="gutter">+</td>
            {fields.map((f) => (
              <td key={"add-" + f.name}><div className="cell" style={{ color: "var(--text-3)" }}></div></td>
            ))}
            {extraColumnLabel && <td></td>}
          </tr>
        </tbody>
      </table>

      {/* Footer summary — live Count / Sum / Avg like Numbers */}
      <div className="num-footer">
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          {rangeLabel ? (
            <>
              <span style={{ fontWeight: 600 }}>{rangeLabel}</span>
              <span className="footer-stat">Count <strong>{fmtNum(rangeStats.count)}</strong></span>
              {rangeStats.avg !== null && (
                <>
                  <span className="footer-stat">
                    Sum <strong>
                      {defaultField?.type === "currency" && isSingleCurrencyCol(range, fields)
                        ? fmtCurrency(rangeStats.sum)
                        : fmtNum(rangeStats.sum, 2)}
                    </strong>
                  </span>
                  <span className="footer-stat">
                    Avg <strong>
                      {defaultField?.type === "currency" && isSingleCurrencyCol(range, fields)
                        ? fmtCurrency(rangeStats.avg)
                        : fmtNum(rangeStats.avg, 2)}
                    </strong>
                  </span>
                </>
              )}
            </>
          ) : (
            <>
              <span><strong>{fmtNum(totalRows)}</strong> rows{search ? " · filtered" : ""}</span>
              {defaultField && (
                <span className="footer-stat">
                  Sum {defaultField.label}: <strong>
                    {defaultField.type === "currency"
                      ? fmtCurrency(rangeStats.sum)
                      : fmtNum(rangeStats.sum)}
                  </strong>
                </span>
              )}
            </>
          )}
        </div>
        <div style={{ color: "var(--text-3)", fontSize: 11 }}>
          Drag to select · Right-click for options
        </div>
      </div>

      {/* Context menus */}
      {ctx && <ContextMenu ctx={ctx} doctype={doctype} onClose={() => setCtx(null)}
        onSort={(name, dir) => { setSortField(name); setSortDir(dir); }}
        onOpenRow={(ri) => { const r = filteredRows[ri]; if (r) onOpen?.(r); }}
      />}
    </div>
  );
}

// Helper: is the current range entirely inside a single currency column?
function isSingleCurrencyCol(range: any, fields: FieldDef[]) {
  if (!range) return false;
  if (range.c1 !== range.c2) return false;
  return fields[range.c1]?.type === "currency";
}

/* ────────────── Context menu (row + column) ────────────── */

function ContextMenu({
  ctx, doctype, onClose, onSort, onOpenRow,
}: {
  ctx: { x: number; y: number; kind: "row" | "col" | "rownum"; rowIndex?: number; colIndex?: number };
  doctype: DocTypeDef;
  onClose: () => void;
  onSort: (name: string, dir: SortDir) => void;
  onOpenRow: (ri: number) => void;
}) {
  const { x, y, kind, rowIndex, colIndex } = ctx;
  const field = colIndex !== undefined ? doctype.fields[colIndex] : undefined;
  const unavailable = () => toast("Available in the live build");

  const items: { label: string; sub?: string; onClick?: () => void; divider?: boolean; disabled?: boolean }[] =
    kind === "col" && field ? [
      { label: `Sort ${field.label} ascending`,  onClick: () => { onSort(field.name, "asc");  onClose(); } },
      { label: `Sort ${field.label} descending`, onClick: () => { onSort(field.name, "desc"); onClose(); } },
      { label: "Clear sort",                     onClick: () => { onSort("", null);            onClose(); } },
      { label: "", divider: true },
      { label: `Filter by ${field.label}…`,      onClick: unavailable },
      { label: `Group by ${field.label}`,        onClick: unavailable },
      { label: "", divider: true },
      { label: "Hide column",                    onClick: unavailable },
      { label: "Freeze column",                  onClick: unavailable },
      { label: "Column format…",                 sub: field.type,    onClick: unavailable },
    ] : [
      { label: "Open row",      onClick: () => { if (rowIndex !== undefined) onOpenRow(rowIndex); onClose(); } },
      { label: "", divider: true },
      { label: "Insert row above", onClick: unavailable },
      { label: "Insert row below", onClick: unavailable },
      { label: "Duplicate row",    onClick: unavailable },
      { label: "", divider: true },
      { label: "Copy link",     onClick: unavailable },
      { label: "Share…",        onClick: unavailable },
      { label: "Delete row",    onClick: unavailable },
    ];

  // Clamp to viewport
  const left = Math.min(x, window.innerWidth - 240);
  const top  = Math.min(y, window.innerHeight - items.length * 28 - 16);

  return (
    <div className="ctx-menu" style={{ left, top }}
         onClick={(e) => e.stopPropagation()}>
      {items.map((it, i) => it.divider
        ? <div key={i} className="ctx-sep" />
        : <button key={i} className="ctx-item" disabled={it.disabled} onClick={it.onClick}>
            <span>{it.label}</span>
            {it.sub && <span className="ctx-sub">{it.sub}</span>}
          </button>
      )}
    </div>
  );
}

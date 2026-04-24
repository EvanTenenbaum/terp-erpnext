/**
 * LinkSearch — in-cell type-to-search for any `link` field.
 *
 * Renders an inline input that filters the rows of the linked DocType (looked
 * up via DATA[slug]) and shows a small dropdown list directly under the cell.
 * Selecting a row commits its identity (name) — no copy-paste required.
 *
 * Identity field preference (in order):
 *   1) the row's `name`
 *   2) the row's title field if defined on the doctype (we approximate)
 *   3) JSON of the row (last-resort fallback)
 */
import { useEffect, useMemo, useRef, useState } from "react";
import { DATA } from "@/data/seed";
import { BY_SLUG } from "@/data/schema";

const MAX_RESULTS = 8;

export default function LinkSearch({
  targetSlug,
  value,
  onCommit,
  onCancel,
}: {
  targetSlug: string;
  value: any;
  onCommit: (v: any) => void;
  onCancel: () => void;
}) {
  const [q, setQ] = useState<string>(value ? String(value) : "");
  const [hi, setHi] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => { inputRef.current?.focus(); inputRef.current?.select(); }, []);

  const dt = BY_SLUG[targetSlug];
  const rows: any[] = (DATA as any)?.[targetSlug] ?? [];

  // Pick a sensible "secondary" search field per doctype so users can type a
  // strain, a city, or a SKU — not just the bare name.
  const secondaryField = useMemo(() => {
    if (!dt) return null;
    // First non-name data/longtext field
    const hit = dt.fields.find(
      (f) => f.name !== "name" && (f.type === "data" || f.type === "longtext")
    );
    return hit?.name ?? null;
  }, [dt]);

  const matches = useMemo(() => {
    const needle = q.trim().toLowerCase();
    if (!needle) return rows.slice(0, MAX_RESULTS);
    return rows
      .map((r) => {
        const id = String(r.name ?? r.id ?? "");
        const sec = secondaryField ? String(r[secondaryField] ?? "") : "";
        const idx = id.toLowerCase().indexOf(needle);
        const sIdx = sec.toLowerCase().indexOf(needle);
        if (idx === -1 && sIdx === -1) return null;
        return { row: r, id, sec, score: idx === 0 ? 0 : idx > 0 ? 1 : 2 };
      })
      .filter(Boolean)
      .sort((a: any, b: any) => a.score - b.score)
      .slice(0, MAX_RESULTS) as any[];
  }, [rows, q, secondaryField]);

  const commitMatch = (idx: number) => {
    const m = matches[idx];
    if (!m) {
      // Free-text commit (lets the user keep what they typed if no match yet)
      onCommit(q.trim() || null);
      return;
    }
    onCommit(m.id);
  };

  return (
    <div className="cell" style={{ padding: 0, position: "relative" }}>
      <input
        ref={inputRef}
        value={q}
        placeholder={dt ? `Type to find ${dt.singular.toLowerCase()}…` : "Type to search…"}
        onChange={(e) => { setQ(e.target.value); setHi(0); }}
        onBlur={() => {
          // delay so a click on a list item lands first
          setTimeout(() => onCommit(q.trim() || null), 120);
        }}
        onKeyDown={(e) => {
          if (e.key === "Escape") { onCancel(); return; }
          if (e.key === "Enter") { commitMatch(hi); return; }
          if (e.key === "ArrowDown") {
            setHi((h) => Math.min(h + 1, matches.length - 1));
            e.preventDefault();
          }
          if (e.key === "ArrowUp") {
            setHi((h) => Math.max(h - 1, 0));
            e.preventDefault();
          }
          if (e.key === "Tab") { commitMatch(hi); }
        }}
        style={{
          width: "100%", height: "100%", padding: "0 10px",
          border: "2px solid var(--accent-blue)",
          background: "var(--accent-blue-bg)",
          fontSize: 13, outline: "none", color: "var(--text-1)",
        }}
      />
      {matches.length > 0 && (
        <div
          className="link-pop"
          // The dropdown floats below the cell. Pointer-events on items so a
          // click commits before the input's blur cancels it.
          style={{
            position: "absolute", top: "100%", left: -1, right: -1,
            background: "var(--surface)", border: "1px solid var(--border-2)",
            borderTop: "none",
            boxShadow: "0 8px 24px rgba(0,0,0,0.10)",
            zIndex: 30, maxHeight: 240, overflow: "auto",
            fontSize: 12,
          }}
        >
          {matches.map((m: any, i: number) => (
            <div
              key={m.id + ":" + i}
              onMouseDown={(e) => { e.preventDefault(); commitMatch(i); }}
              onMouseEnter={() => setHi(i)}
              style={{
                padding: "6px 10px",
                background: i === hi ? "var(--accent-blue-bg)" : "transparent",
                cursor: "pointer",
                display: "flex", justifyContent: "space-between", gap: 12,
                borderTop: i === 0 ? "none" : "1px solid var(--border-1)",
              }}
            >
              <span style={{ fontWeight: 600, color: "var(--text-1)" }}>{m.id}</span>
              {m.sec && (
                <span style={{ color: "var(--text-3)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {m.sec}
                </span>
              )}
            </div>
          ))}
        </div>
      )}
      {matches.length === 0 && q.trim() !== "" && (
        <div
          className="link-pop"
          style={{
            position: "absolute", top: "100%", left: -1, right: -1,
            background: "var(--surface)", border: "1px solid var(--border-2)",
            borderTop: "none", padding: "6px 10px", color: "var(--text-3)",
            fontSize: 12, zIndex: 30,
          }}
        >
          No match — press Enter to keep "{q.trim()}"
        </div>
      )}
    </div>
  );
}

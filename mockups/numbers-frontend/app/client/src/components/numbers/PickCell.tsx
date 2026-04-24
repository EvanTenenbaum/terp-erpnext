/*
 * PickCell — a Numbers-style "cell that's actually a picker".
 * Used for header pick-cells (Customer / Supplier / Account).
 *
 * Usage:
 *   <PickCell value={...} onChange={...} options={[{id, label, meta?}]}
 *             placeholder="Type a name…" allowCreate onCreate={...} />
 */
import { useEffect, useRef, useState } from "react";
import { ChevronDown, Plus } from "lucide-react";

export type PickOption = {
  id: string;
  label: string;
  /** Optional secondary text shown to the right (e.g., credit used). */
  meta?: string;
  /** Optional tint shown before the label as a tiny dot. */
  tint?: string;
};

export default function PickCell({
  value, onChange, options, placeholder = "Pick…",
  allowCreate = false, onCreate,
  label,
}: {
  value: string | null;
  onChange: (next: string | null, option?: PickOption) => void;
  options: PickOption[];
  placeholder?: string;
  allowCreate?: boolean;
  onCreate?: (query: string) => void;
  /** Pick-cell label shown above (small uppercase). */
  label?: string;
}) {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const [hover, setHover] = useState(0);
  const wrapRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!open) return;
    const close = (e: MouseEvent) => {
      if (!wrapRef.current?.contains(e.target as Node)) setOpen(false);
    };
    window.addEventListener("mousedown", close);
    return () => window.removeEventListener("mousedown", close);
  }, [open]);

  useEffect(() => { if (open) setTimeout(() => inputRef.current?.focus(), 0); }, [open]);

  const filtered = q.trim()
    ? options.filter((o) => o.label.toLowerCase().includes(q.toLowerCase()))
    : options;

  const canCreate = allowCreate && q.trim() && !filtered.some((o) => o.label.toLowerCase() === q.toLowerCase());

  const commit = (opt: PickOption) => {
    onChange(opt.id, opt);
    setOpen(false); setQ("");
  };

  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") { e.preventDefault(); setHover((h) => Math.min(h + 1, filtered.length - (canCreate ? 0 : 1))); }
    else if (e.key === "ArrowUp") { e.preventDefault(); setHover((h) => Math.max(h - 1, 0)); }
    else if (e.key === "Enter") {
      e.preventDefault();
      if (hover < filtered.length) commit(filtered[hover]);
      else if (canCreate && onCreate) { onCreate(q); setOpen(false); setQ(""); }
    } else if (e.key === "Escape") { setOpen(false); }
  };

  const selected = options.find((o) => o.id === value);

  return (
    <div ref={wrapRef} className="rh-cell" style={{ position: "relative" }}>
      {label && <div className="rh-label">{label}</div>}
      <button
        type="button"
        className="pick-cell"
        onClick={() => setOpen((v) => !v)}
      >
        <span className={"rh-value " + (selected ? "" : "placeholder")}>
          {selected ? selected.label : placeholder}
        </span>
        <ChevronDown size={14} className="caret" />
      </button>

      {open && (
        <div className="pick-pop" style={{ top: "100%", left: 8, right: 8, marginTop: 4 }}>
          <div style={{ padding: "6px 8px" }}>
            <input
              ref={inputRef}
              value={q}
              onChange={(e) => { setQ(e.target.value); setHover(0); }}
              onKeyDown={onKey}
              placeholder="Search…"
              style={{
                width: "100%", outline: "none", border: "1px solid var(--border-hair)",
                borderRadius: 6, height: 26, padding: "0 8px", fontSize: 12,
              }}
            />
          </div>
          {filtered.length === 0 && !canCreate && (
            <div style={{ padding: "8px 12px", fontSize: 12, color: "var(--text-3)" }}>No matches.</div>
          )}
          {filtered.map((o, i) => (
            <div
              key={o.id}
              className="pick-pop-item"
              aria-selected={hover === i}
              onMouseEnter={() => setHover(i)}
              onMouseDown={(e) => { e.preventDefault(); commit(o); }}
            >
              {o.tint && <span style={{ width: 8, height: 8, borderRadius: 999, background: o.tint, flexShrink: 0 }} />}
              <span>{o.label}</span>
              {o.meta && <span className="meta">{o.meta}</span>}
            </div>
          ))}
          {canCreate && (
            <>
              {filtered.length > 0 && <div className="pick-pop-sep" />}
              <div
                className="pick-pop-create"
                onMouseDown={(e) => { e.preventDefault(); onCreate?.(q); setOpen(false); setQ(""); }}
              >
                <Plus size={13} /> Create “{q}”
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}

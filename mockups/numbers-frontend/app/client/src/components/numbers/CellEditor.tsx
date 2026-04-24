import { useEffect, useRef, useState } from "react";
import { Check, ChevronDown } from "lucide-react";
import type { FieldDef } from "@/data/schema";
import { fmtCurrency, fmtDate, fmtDateTime, fmtNum, fmtPct, chipClassFor, shortStatus } from "@/lib/format";

interface Props {
  field: FieldDef;
  value: any;
  onCommit: (v: any) => void;
  editing?: boolean;
  onStartEdit?: () => void;
  onStopEdit?: () => void;
}

export default function CellEditor({
  field, value, onCommit, editing = false, onStartEdit, onStopEdit,
}: Props) {
  const [local, setLocal] = useState<any>(value ?? "");
  const inputRef = useRef<HTMLInputElement | HTMLSelectElement>(null);

  useEffect(() => { setLocal(value ?? ""); }, [value]);
  useEffect(() => { if (editing) inputRef.current?.focus(); }, [editing]);

  const commit = () => {
    onCommit(normalize(field, local));
    onStopEdit?.();
  };
  const cancel = () => {
    setLocal(value ?? "");
    onStopEdit?.();
  };

  const justify = ["int","float","currency","percent"].includes(field.type) ? "flex-end" : "flex-start";

  if (!editing) {
    return (
      <div
        onDoubleClick={onStartEdit}
        className="cell"
        style={{
          justifyContent: justify,
          color: value === null || value === "" || value === undefined ? "var(--text-3)" : "var(--text-1)",
          cursor: "cell",
        }}
      >
        {renderDisplay(field, value)}
      </div>
    );
  }

  if (field.type === "select") {
    const opts = (field.options as string[]) ?? [];
    return (
      <div className="cell" style={{ padding: 0 }}>
        <select
          ref={inputRef as any}
          value={local}
          onChange={(e) => setLocal(e.target.value)}
          onBlur={commit}
          onKeyDown={(e) => {
            if (e.key === "Enter") commit();
            if (e.key === "Escape") cancel();
          }}
          style={{
            width: "100%", height: "100%", padding: "0 10px",
            border: "2px solid var(--accent-blue)",
            background: "var(--accent-blue-bg)", fontSize: 13,
            outline: "none", color: "var(--text-1)",
          }}
        >
          {opts.map((o) => <option key={o} value={o}>{o || "—"}</option>)}
        </select>
      </div>
    );
  }

  if (field.type === "check") {
    return (
      <div className="cell" style={{ justifyContent: "center" }}>
        <input
          type="checkbox"
          checked={!!local}
          onChange={(e) => { setLocal(e.target.checked); onCommit(e.target.checked); onStopEdit?.(); }}
          autoFocus
        />
      </div>
    );
  }

  const inputType =
    field.type === "date" ? "date"
    : field.type === "datetime" ? "datetime-local"
    : field.type === "time" ? "time"
    : field.type === "int" || field.type === "float" || field.type === "currency" || field.type === "percent" ? "number"
    : "text";

  return (
    <div className="cell" style={{ padding: 0, justifyContent: justify }}>
      <input
        ref={inputRef as any}
        type={inputType}
        value={local ?? ""}
        onChange={(e) => setLocal(e.target.value)}
        onBlur={commit}
        onKeyDown={(e) => {
          if (e.key === "Enter") commit();
          if (e.key === "Escape") cancel();
        }}
        style={{
          width: "100%", height: "100%", padding: "0 10px",
          border: "2px solid var(--accent-blue)",
          background: "var(--accent-blue-bg)",
          textAlign: justify === "flex-end" ? "right" : "left",
          fontSize: 13, outline: "none",
        }}
      />
    </div>
  );
}

function normalize(f: FieldDef, v: any) {
  if (v === "" || v === null || v === undefined) return null;
  if (["int"].includes(f.type)) return parseInt(v, 10);
  if (["float","currency","percent"].includes(f.type)) return parseFloat(v);
  return v;
}

function renderDisplay(f: FieldDef, v: any) {
  if (v === null || v === undefined || v === "") return <span style={{ color: "var(--text-3)" }}>—</span>;
  switch (f.type) {
    case "currency": return fmtCurrency(v);
    case "percent":  return fmtPct(v);
    case "int":
    case "float":    return fmtNum(v, f.type === "int" ? 0 : 0);
    case "date":     return fmtDate(v);
    case "datetime": return fmtDateTime(v);
    case "check":    return v ? <Check size={14} color="#34C759" /> : <span style={{ color: "var(--text-3)" }}>—</span>;
    case "select":
      return <span className={chipClassFor(v)} title={String(v)}>{shortStatus(v)}</span>;
    case "link":
      return <a className="cell-link" onClick={(e) => e.preventDefault()} href="#">{String(v)}</a>;
    default:
      return <span>{String(v)}</span>;
  }
}

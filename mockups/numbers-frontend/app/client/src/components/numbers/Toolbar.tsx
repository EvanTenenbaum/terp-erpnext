/*
 * Toolbar — Numbers-style minimal.
 *
 * Numbers has no heavy toolbar strip. The entire toolbar collapses to:
 *   (left)  current View indicator (menu)
 *   (mid)   a light search box
 *   (right) a "⋯" menu that carries Sort / Filter / Group / Export / Share
 * Everything else should be reachable by right-clicking headers, cells, rows.
 */
import { useState, useRef, useEffect } from "react";
import {
  ChevronDown, Search as SearchIcon, MoreHorizontal,
  Table2, Columns3, CalendarDays, FormInput, BarChart3,
  ArrowDownUp, SlidersHorizontal, Group, Plus, Download, Share2,
} from "lucide-react";
import { toast } from "sonner";

export type ViewKind = "table" | "kanban" | "calendar" | "form" | "chart";

const VIEW_META: Record<ViewKind, { label: string; Ico: any }> = {
  table:    { label: "Table",    Ico: Table2 },
  kanban:   { label: "Kanban",   Ico: Columns3 },
  calendar: { label: "Calendar", Ico: CalendarDays },
  form:     { label: "Form",     Ico: FormInput },
  chart:    { label: "Chart",    Ico: BarChart3 },
};

export default function Toolbar({
  view, onViewChange, views = ["table", "kanban", "calendar", "form"],
  search, onSearch, onFilter, onSort, onGroup, onInsert, onExport, onShare,
}: {
  view: ViewKind;
  onViewChange: (v: ViewKind) => void;
  views?: ViewKind[];
  search?: string;
  onSearch?: (v: string) => void;
  onFilter?: () => void;
  onSort?: () => void;
  onGroup?: () => void;
  onInsert?: () => void;
  onExport?: () => void;
  onShare?: () => void;
}) {
  const [viewOpen, setViewOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const viewRef = useRef<HTMLDivElement>(null);
  const moreRef = useRef<HTMLDivElement>(null);
  const { Ico: CurIco, label: curLabel } = VIEW_META[view];

  useEffect(() => {
    const close = (e: MouseEvent) => {
      if (viewRef.current && !viewRef.current.contains(e.target as Node)) setViewOpen(false);
      if (moreRef.current && !moreRef.current.contains(e.target as Node)) setMoreOpen(false);
    };
    window.addEventListener("click", close);
    return () => window.removeEventListener("click", close);
  }, []);

  const demo = (what: string) => () => toast(`${what} — available in the live build`);

  return (
    <div
      className="num-toolbar"
      style={{
        display: "flex", alignItems: "center", gap: 8,
        padding: "0 14px",
        height: "var(--toolbar-h)",
        background: "var(--canvas)",
        borderBottom: "1px solid var(--border-hair)",
      }}
    >
      {/* View menu — subtle chip */}
      <div ref={viewRef} style={{ position: "relative" }}>
        <button
          className="tb-chip"
          onClick={(e) => { e.stopPropagation(); setViewOpen((v) => !v); }}
        >
          <CurIco size={13} /> {curLabel}
          <ChevronDown size={11} style={{ opacity: 0.6 }} />
        </button>
        {viewOpen && (
          <div className="ctx-menu" style={{ position: "absolute", top: 36, left: 0, minWidth: 160 }}>
            {views.map((v) => {
              const { Ico, label } = VIEW_META[v];
              return (
                <button key={v} className="ctx-item"
                  onClick={() => { onViewChange(v); setViewOpen(false); }}>
                  <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
                    <Ico size={12} /> {label}
                  </span>
                  {v === view && <span className="ctx-sub">current</span>}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Search */}
      <div
        style={{
          display: "flex", alignItems: "center", gap: 6,
          height: 28, padding: "0 10px", borderRadius: 7,
          background: "var(--surface)", border: "1px solid var(--border-hair)",
          flex: 1, minWidth: 160, maxWidth: 360,
        }}
      >
        <SearchIcon size={12} color="var(--text-3)" />
        <input
          placeholder="Search this sheet"
          value={search ?? ""}
          onChange={(e) => onSearch?.(e.target.value)}
          style={{ flex: 1, outline: "none", border: 0, background: "transparent", fontSize: 12, color: "var(--text-1)" }}
        />
      </div>

      <div className="flex-1" />

      {/* More menu — holds everything secondary */}
      <div ref={moreRef} style={{ position: "relative" }}>
        <button className="tb-chip" onClick={(e) => { e.stopPropagation(); setMoreOpen((v) => !v); }}>
          <MoreHorizontal size={13} />
        </button>
        {moreOpen && (
          <div className="ctx-menu" style={{ position: "absolute", top: 36, right: 0, minWidth: 220 }}>
            <button className="ctx-item" onClick={() => { setMoreOpen(false); (onSort ?? demo("Sort"))(); }}>
              <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}><ArrowDownUp size={12} /> Sort…</span>
              <span className="ctx-sub">right-click header</span>
            </button>
            <button className="ctx-item" onClick={() => { setMoreOpen(false); (onFilter ?? demo("Filter"))(); }}>
              <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}><SlidersHorizontal size={12} /> Filter…</span>
            </button>
            <button className="ctx-item" onClick={() => { setMoreOpen(false); (onGroup ?? demo("Group"))(); }}>
              <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}><Group size={12} /> Group by…</span>
            </button>
            <div className="ctx-sep" />
            <button className="ctx-item" onClick={() => { setMoreOpen(false); (onInsert ?? demo("Insert row"))(); }}>
              <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}><Plus size={12} /> Insert row</span>
              <span className="ctx-sub">or type in "+" row</span>
            </button>
            <div className="ctx-sep" />
            <button className="ctx-item" onClick={() => { setMoreOpen(false); (onExport ?? demo("Export CSV"))(); }}>
              <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}><Download size={12} /> Export CSV</span>
            </button>
            <button className="ctx-item" onClick={() => { setMoreOpen(false); (onShare ?? demo("Share link"))(); }}>
              <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}><Share2 size={12} /> Share link…</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

/*
 * SheetTabBar — Numbers-style tabs. Can sit at the bottom of a sheet
 * or the top of the content area. Each tab has a tiny color dot,
 * right-click menu, and a "+ new sheet" action at the end.
 */
import { ChevronLeft, ChevronRight, Plus, MoreHorizontal } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

export interface TabDef { key: string; label: string; count?: number; color?: string; }

export default function SheetTabBar({
  tabs, active, onSelect, accent, position = "top",
}: {
  tabs: TabDef[];
  active: string;
  onSelect: (key: string) => void;
  /** Soft tint shown behind tabs */
  accent?: string;
  /** "top" (classic) or "bottom" (Numbers-style). */
  position?: "top" | "bottom";
}) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [overflow, setOverflow] = useState({ left: false, right: false });
  const [ctx, setCtx] = useState<null | { x: number; y: number; tab: TabDef }>(null);

  const recompute = () => {
    const el = scrollerRef.current;
    if (!el) return;
    setOverflow({
      left: el.scrollLeft > 4,
      right: el.scrollLeft + el.clientWidth < el.scrollWidth - 4,
    });
  };

  useEffect(() => {
    recompute();
    const el = scrollerRef.current;
    if (!el) return;
    el.addEventListener("scroll", recompute);
    const ro = new ResizeObserver(recompute);
    ro.observe(el);
    return () => { el.removeEventListener("scroll", recompute); ro.disconnect(); };
  }, [tabs.length]);

  useEffect(() => {
    if (!ctx) return;
    const close = () => setCtx(null);
    window.addEventListener("click", close);
    return () => window.removeEventListener("click", close);
  }, [ctx]);

  const nudge = (dir: 1 | -1) => {
    const el = scrollerRef.current; if (!el) return;
    el.scrollBy({ left: dir * Math.max(160, el.clientWidth * 0.6), behavior: "smooth" });
  };

  const bottomish = position === "bottom";

  return (
    <div
      className="sheet-tabbar"
      style={{
        height: "var(--sheettab-h)",
        background: accent ?? "transparent",
        borderTop: bottomish ? "1px solid var(--border-hair)" : undefined,
        borderBottom: bottomish ? undefined : "1px solid var(--border-hair)",
        display: "flex", alignItems: "center",
        position: "relative",
        paddingLeft: 8, paddingRight: 8,
      }}
    >
      {overflow.left && (
        <button onClick={() => nudge(-1)} className="rounded-full"
          style={{
            position: "absolute", left: 4, top: "50%", transform: "translateY(-50%)",
            zIndex: 4, width: 22, height: 22, background: "var(--surface)",
            border: "1px solid var(--border-hair)", color: "var(--text-2)",
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: "var(--shadow-card)",
          }}
          title="Scroll left">
          <ChevronLeft size={13} />
        </button>
      )}

      <div ref={scrollerRef} className="num-scroll"
        style={{
          display: "flex", alignItems: "center", gap: 2,
          flex: 1, minWidth: 0, overflowX: "auto", overflowY: "hidden",
          scrollbarWidth: "none",
          maskImage: "linear-gradient(to right, transparent 0, #000 16px, #000 calc(100% - 16px), transparent 100%)",
          WebkitMaskImage: "linear-gradient(to right, transparent 0, #000 16px, #000 calc(100% - 16px), transparent 100%)",
          padding: "0 4px",
        }}>
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => onSelect(t.key)}
            onDoubleClick={() => toast("Rename sheet — demo only")}
            onContextMenu={(e) => { e.preventDefault(); setCtx({ x: e.clientX, y: e.clientY, tab: t }); }}
            className={"num-tab " + (active === t.key ? "active" : "")}
            title={t.label}
          >
            <span className="num-tab-dot" style={{ background: t.color ?? "var(--text-3)" }} />
            <span className="num-tab-label">{t.label}</span>
            {t.count !== undefined && <span className="num-tab-count">{t.count}</span>}
          </button>
        ))}
        <button
          onClick={() => toast("Add sheet — demo only")}
          className="num-tab-add"
          title="Add sheet"
        >
          <Plus size={13} />
        </button>
      </div>

      {overflow.right && (
        <button onClick={() => nudge(1)} className="rounded-full"
          style={{
            position: "absolute", right: 4, top: "50%", transform: "translateY(-50%)",
            zIndex: 4, width: 22, height: 22, background: "var(--surface)",
            border: "1px solid var(--border-hair)", color: "var(--text-2)",
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: "var(--shadow-card)",
          }}
          title="Scroll right">
          <ChevronRight size={13} />
        </button>
      )}

      {ctx && (
        <div className="ctx-menu" style={{ left: Math.min(ctx.x, window.innerWidth - 220), top: ctx.y - (bottomish ? 240 : -4) }}
          onClick={(e) => e.stopPropagation()}>
          <button className="ctx-item" onClick={() => { toast("Rename — demo"); setCtx(null); }}>
            <span>Rename</span><span className="ctx-sub">double-click</span>
          </button>
          <button className="ctx-item" onClick={() => { toast("Duplicate — demo"); setCtx(null); }}><span>Duplicate</span></button>
          <div className="ctx-sep" />
          <button className="ctx-item" onClick={() => { toast("Color — demo"); setCtx(null); }}>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
              <span style={{ width: 12, height: 12, borderRadius: 999, background: ctx.tab.color ?? "var(--text-3)" }} /> Color…
            </span>
          </button>
          <button className="ctx-item" onClick={() => { toast("Share link — demo"); setCtx(null); }}><span>Share link…</span></button>
          <button className="ctx-item" onClick={() => { toast("Export CSV — demo"); setCtx(null); }}><span>Export CSV</span></button>
          <div className="ctx-sep" />
          <button className="ctx-item" onClick={() => { toast("Delete — demo"); setCtx(null); }}>
            <span style={{ color: "#D63B3B" }}>Delete sheet</span>
          </button>
        </div>
      )}
    </div>
  );
}

// Unused placeholder to satisfy older import paths that referenced MoreHorizontal explicitly
void MoreHorizontal;

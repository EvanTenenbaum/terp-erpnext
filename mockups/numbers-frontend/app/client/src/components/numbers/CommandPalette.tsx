import { useEffect, useMemo, useState } from "react";
import { useLocation } from "wouter";
import { DOCTYPES, SHEETS } from "@/data/schema";
import { DATA } from "@/data/seed";
import { Search, ChevronRight, TableIcon, FileText, Sparkles, Users, Package as PackageIcon } from "lucide-react";

interface Cmd {
  id: string;
  label: string;
  hint?: string;
  group: string;
  icon: any;
  run: () => void;
}

export default function CommandPalette({
  open, onOpenChange,
}: { open: boolean; onOpenChange: (v: boolean) => void }) {
  const [, setLocation] = useLocation();
  const [q, setQ] = useState("");

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        onOpenChange(!open);
      }
      if (e.key === "Escape" && open) onOpenChange(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onOpenChange]);

  const commands = useMemo<Cmd[]>(() => {
    const list: Cmd[] = [];
    SHEETS.forEach((s) => {
      list.push({ id: "go-sheet-" + s.slug, label: "Go to " + s.label, hint: s.hint,
        group: "Sheets", icon: Sparkles, run: () => setLocation("/" + s.slug) });
    });
    DOCTYPES.forEach((d) => {
      list.push({ id: "open-" + d.slug, label: "Open " + d.label, hint: d.singular,
        group: "Tables", icon: TableIcon, run: () => setLocation("/t/" + d.slug) });
    });
    // record deep-links for a few high-signal entities
    (DATA["customer"] ?? []).slice(0, 30).forEach((c: any) =>
      list.push({ id: "cust-" + c.name, label: c.name, hint: "Customer", group: "Customers",
        icon: Users, run: () => setLocation("/t/customer") }));
    (DATA["sales-order"] ?? []).forEach((o: any) =>
      list.push({ id: "so-" + o.name, label: o.name + " · " + o.customer, hint: "Sales Order",
        group: "Sales Orders", icon: FileText, run: () => setLocation("/sales") }));
    (DATA["batch"] ?? []).forEach((b: any) =>
      list.push({ id: "batch-" + b.name, label: b.name, hint: b.item,
        group: "Batches", icon: PackageIcon, run: () => setLocation("/inventory") }));
    // actions — the everyday rituals come FIRST so Cmd+K is the fastest way in
    list.push({ id: "new-sale",     label: "New sale…",            hint: "Sales invoice",      group: "Actions",
      icon: FileText, run: () => setLocation("/sell/new") });
    list.push({ id: "new-purchase", label: "New purchase draft…",  hint: "Buy from a supplier", group: "Actions",
      icon: PackageIcon, run: () => setLocation("/buy/new") });
    list.push({ id: "new-cash",     label: "Open cash ledger…",    hint: "Cash in/out for a shift", group: "Actions",
      icon: FileText, run: () => setLocation("/cash/new") });
    list.push({ id: "new-intake",   label: "New intake session…",  hint: "Intake wizard", group: "Actions",
      icon: Sparkles, run: () => setLocation("/intake/new") });
    list.push({ id: "new-catalogue", label: "New sales catalogue…", hint: "Catalogue builder", group: "Actions",
      icon: Sparkles, run: () => setLocation("/catalogues/CAT-0101") });
    list.push({ id: "new-live",     label: "Start live session…",  group: "Actions",
      icon: Sparkles, run: () => setLocation("/live/LS-0020") });
    return list;
  }, [setLocation]);

  const filtered = useMemo(() => {
    const qq = q.trim().toLowerCase();
    if (!qq) return commands.slice(0, 30);
    return commands.filter((c) => (c.label + " " + (c.hint ?? "")).toLowerCase().includes(qq)).slice(0, 80);
  }, [q, commands]);

  const grouped = useMemo(() => {
    const g: Record<string, Cmd[]> = {};
    filtered.forEach((c) => { (g[c.group] ||= []).push(c); });
    return g;
  }, [filtered]);

  if (!open) return null;
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 80 }}>
      <div style={{ position: "absolute", inset: 0, background: "rgba(29,29,31,0.42)" }}
           onClick={() => onOpenChange(false)} />
      <div
        style={{
          position: "absolute", top: 96, left: "50%", transform: "translateX(-50%)",
          width: 620, maxHeight: "70vh", background: "var(--surface)",
          borderRadius: 14, boxShadow: "var(--shadow-modal)", overflow: "hidden",
          display: "flex", flexDirection: "column",
        }}
      >
        <div className="flex items-center gap-2 px-4" style={{ borderBottom: "1px solid var(--border-hair)", height: 52 }}>
          <Search size={16} color="var(--text-3)" />
          <input
            autoFocus value={q} onChange={(e) => setQ(e.target.value)}
            placeholder="Try ‘new sale’, ‘new purchase’, a strain, a customer, a batch…"
            style={{
              flex: 1, outline: "none", border: 0, background: "transparent",
              fontSize: 15, color: "var(--text-1)",
            }}
          />
          <kbd>ESC</kbd>
        </div>
        <div className="num-scroll" style={{ overflow: "auto", padding: "6px 0" }}>
          {Object.entries(grouped).map(([group, items]) => (
            <div key={group} style={{ padding: "4px 0" }}>
              <div style={{ padding: "6px 16px", fontSize: 11, color: "var(--text-3)",
                textTransform: "uppercase", letterSpacing: ".06em" }}>{group}</div>
              {items.map((c) => {
                const Ico = c.icon;
                return (
                  <button
                    key={c.id}
                    onClick={() => { c.run(); onOpenChange(false); setQ(""); }}
                    className="w-full flex items-center gap-2 text-left px-4 py-2"
                    style={{ fontSize: 13 }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = "#F4F6FA")}
                    onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                  >
                    <Ico size={14} color="var(--text-2)" />
                    <span style={{ fontWeight: 500, flex: 1 }}>{c.label}</span>
                    {c.hint && <span style={{ color: "var(--text-3)", fontSize: 12 }}>{c.hint}</span>}
                    <ChevronRight size={13} color="var(--text-3)" />
                  </button>
                );
              })}
            </div>
          ))}
          {filtered.length === 0 && (
            <div style={{ padding: 24, textAlign: "center", color: "var(--text-3)", fontSize: 13 }}>
              No matches.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

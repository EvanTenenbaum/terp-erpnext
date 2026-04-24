import { useState, type ReactNode } from "react";
import { Link, useLocation } from "wouter";
import {
  Sparkles, Search, ChevronsLeft, ChevronsRight,
  LayoutGrid, ShoppingCart, Package, Truck, Banknote, Users, ShieldCheck,
  BarChart3, Crown, Settings, TableProperties,
} from "lucide-react";
import { SHEETS, type Sheet } from "@/data/schema";
import NotificationBell from "./NotificationBell";
import CommandPalette from "./CommandPalette";
import { toast } from "sonner";

const sheetIcon: Record<Sheet | "dashboard" | "reports" | "vip", any> = {
  dashboard: LayoutGrid,
  sales: ShoppingCart,
  inventory: Package,
  procurement: Truck,
  finance: Banknote,
  relationships: Users,
  credit: ShieldCheck,
  admin: Settings,
  reports: BarChart3,
  vip: Crown,
};

export default function SheetAppShell({
  sheet,
  title,
  subtitle,
  children,
  inspector,
  actions,
}: {
  sheet?: Sheet | "dashboard" | "reports" | "vip";
  title: string;
  subtitle?: string;
  children: ReactNode;
  inspector?: ReactNode;
  actions?: ReactNode;
}) {
  const [collapsed, setCollapsed] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [location] = useLocation();

  const navItems: { to: string; label: string; key: Sheet | "dashboard" | "reports" | "vip"; tint?: string }[] = [
    { to: "/",               label: "Dashboard",     key: "dashboard" },
    { to: "/sales",          label: "Sales",         key: "sales",         tint: "var(--sheet-sales)" },
    { to: "/inventory",      label: "Inventory",     key: "inventory",     tint: "var(--sheet-inventory)" },
    { to: "/procurement",    label: "Procurement",   key: "procurement",   tint: "var(--sheet-procurement)" },
    { to: "/finance",        label: "Finance",       key: "finance",       tint: "var(--sheet-finance)" },
    { to: "/relationships",  label: "Relationships", key: "relationships", tint: "var(--sheet-relationships)" },
    { to: "/credit",         label: "Client Credit", key: "credit",        tint: "var(--sheet-credit)" },
    { to: "/admin",          label: "Admin",         key: "admin",         tint: "var(--sheet-admin)" },
    { to: "/reports",        label: "Reports",       key: "reports",       tint: "var(--sheet-reports)" },
    { to: "/vip",            label: "VIP Portal",    key: "vip",           tint: "var(--sheet-vip)" },
  ];

  return (
    <div className="h-screen w-screen flex" style={{ background: "var(--canvas)" }}>
      {/* Sidebar rail */}
      <aside
        className="flex flex-col num-scroll"
        style={{
          width: collapsed ? 52 : "var(--rail-width)",
          background: "var(--surface)",
          borderRight: "1px solid var(--border-hair)",
          transition: "width .2s var(--ease-out)",
        }}
      >
        <div className="flex items-center justify-between px-3" style={{ height: 56, borderBottom: "1px solid var(--border-hair)" }}>
          {!collapsed && (
            <Link href="/" style={{ textDecoration: "none", color: "inherit" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
                <div className="rounded-lg" style={{
                  width: 30, height: 30, background: "linear-gradient(135deg, #34C759 0%, #007AFF 100%)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  boxShadow: "0 2px 6px rgba(0,122,255,.25)",
                }}>
                  <Sparkles size={15} color="white" strokeWidth={2.4} />
                </div>
                <div style={{ fontWeight: 700, fontSize: 14, letterSpacing: "-0.01em" }}>TERP</div>
                <span className="chip chip-sm" style={{ background: "#F2F2F4", color: "var(--text-3)" }}>Numbers</span>
              </div>
            </Link>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="rounded-md p-1 hover:bg-[color:var(--accent)]"
            title={collapsed ? "Expand" : "Collapse"}
          >
            {collapsed ? <ChevronsRight size={16} /> : <ChevronsLeft size={16} />}
          </button>
        </div>

        <nav className="px-2 py-3 flex-1 overflow-y-auto num-scroll">
          {!collapsed && (
            <div style={{ fontSize: 11, color: "var(--text-3)", padding: "6px 8px", letterSpacing: ".04em", textTransform: "uppercase" }}>
              Sheets
            </div>
          )}
          {navItems.map((n) => {
            const Ico = sheetIcon[n.key];
            const active = (n.to === "/" ? location === "/" : location.startsWith(n.to));
            return (
              <Link key={n.to} href={n.to}
                style={{
                  position: "relative",
                  display: "flex", alignItems: "center", gap: 9,
                  padding: collapsed ? "8px" : "7px 10px",
                  margin: "1px 0",
                  borderRadius: 7,
                  background: active ? "#F1F4F9" : "transparent",
                  color: active ? "var(--text-1)" : "var(--text-1)",
                  textDecoration: "none",
                  cursor: "pointer",
                  transition: "background .12s var(--ease-out)",
                }}
                onMouseEnter={(e: any) => { if (!active) (e.currentTarget.style.background = "#F6F6F8"); }}
                onMouseLeave={(e: any) => { if (!active) (e.currentTarget.style.background = "transparent"); }}
              >
                {active && (
                  <span style={{
                    position: "absolute", left: 0, top: 6, bottom: 6, width: 3,
                    borderRadius: 2, background: "var(--accent-blue)",
                  }} />
                )}
                <div
                  style={{
                    width: 22, height: 22, borderRadius: 6,
                    background: n.tint ?? "#F2F2F4",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    color: "var(--text-1)", flexShrink: 0,
                  }}
                >
                  <Ico size={13} />
                </div>
                {!collapsed && <div style={{ fontSize: 13, fontWeight: active ? 600 : 500 }}>{n.label}</div>}
              </Link>
            );
          })}

          {!collapsed && (
            <>
              <div style={{ fontSize: 11, color: "var(--text-3)", padding: "14px 8px 6px", letterSpacing: ".04em", textTransform: "uppercase" }}>
                Tools
              </div>
              {[
                { to: "/catalogues/CAT-0101", label: "Catalogue Builder", icon: TableProperties },
                { to: "/intake/new",          label: "Intake Wizard",     icon: Package },
                { to: "/live/LS-0020",         label: "Live Shopping Room", icon: Crown },
              ].map((t) => (
                <Link key={t.to} href={t.to}
                  style={{ display: "flex", alignItems: "center", gap: 8, padding: "6px 8px", borderRadius: 6, fontSize: 13, color: "var(--text-2)", textDecoration: "none", cursor: "pointer" }}
                  onMouseEnter={(e: any) => (e.currentTarget.style.background = "#F2F2F4")}
                  onMouseLeave={(e: any) => (e.currentTarget.style.background = "transparent")}
                >
                  <t.icon size={14} /> {t.label}
                </Link>
              ))}
            </>
          )}
        </nav>

        {!collapsed && (
          <div className="px-3 py-3" style={{ borderTop: "1px solid var(--border-hair)" }}>
            <div className="flex items-center gap-2">
              <div className="rounded-full" style={{
                width: 28, height: 28, background: "#E5F1FF", color: "#0066CC",
                fontSize: 11, fontWeight: 600, display: "flex", alignItems: "center", justifyContent: "center",
              }}>AR</div>
              <div className="flex-1" style={{ minWidth: 0 }}>
                <div style={{ fontSize: 12, fontWeight: 600, lineHeight: 1.15 }}>Alex Admin</div>
                <div style={{ fontSize: 11, color: "var(--text-3)" }}>System Manager</div>
              </div>
              <button onClick={() => toast("Role switcher — demo only")} className="rounded-md p-1 hover:bg-[color:var(--accent)]">
                <Settings size={14} />
              </button>
            </div>
          </div>
        )}
      </aside>

      {/* Main column */}
      <div className="flex flex-col flex-1" style={{ minWidth: 0 }}>
        {/* Top bar — ultra-minimal, Numbers-style */}
        <header
          className="flex items-center px-4 gap-3"
          style={{
            height: 40, background: "var(--canvas)",
            borderBottom: "1px solid var(--border-hair)",
          }}
        >
          {/* Doc title like Numbers' window title */}
          <div style={{ minWidth: 0, display: "flex", alignItems: "baseline", gap: 8 }} className="flex-1">
            <div style={{ fontSize: 13, fontWeight: 600, letterSpacing: "-0.005em", color: "var(--text-1)" }}>{title}</div>
            {subtitle && (
              <span style={{
                fontSize: 11, color: "var(--text-3)",
                whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
              }}>{subtitle}</span>
            )}
          </div>

          <button
            onClick={() => setPaletteOpen(true)}
            className="flex items-center gap-2 rounded-md"
            style={{
              height: 26, padding: "0 8px 0 10px", background: "var(--surface)",
              border: "1px solid var(--border-hair)", color: "var(--text-3)",
              fontSize: 11, minWidth: 220,
              transition: "background .12s, border-color .12s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "#F4F4F6")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "var(--surface)")}
          >
            <Search size={12} />
            <span className="flex-1 text-left">Jump to…</span>
            <kbd style={{ fontSize: 10 }}>⌘K</kbd>
          </button>

          {actions}

          <NotificationBell />

          <div
            className="rounded-full"
            style={{
              width: 24, height: 24, background: "#E5F1FF", color: "#0066CC",
              fontSize: 10, fontWeight: 600, display: "flex",
              alignItems: "center", justifyContent: "center",
            }}
          >
            AR
          </div>
        </header>

        <main className="flex-1 flex" style={{ minHeight: 0 }}>
          <div className="flex-1 flex flex-col" style={{ minWidth: 0 }}>{children}</div>
          {inspector}
        </main>
      </div>

      <CommandPalette open={paletteOpen} onOpenChange={setPaletteOpen} />
    </div>
  );
}

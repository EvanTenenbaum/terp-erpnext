import { useRoute, Link } from "wouter";
import SheetPage from "@/components/numbers/SheetPage";
import SheetAppShell from "@/components/numbers/SheetAppShell";
import Toolbar from "@/components/numbers/Toolbar";
import SheetTable from "@/components/numbers/SheetTable";
import Inspector from "@/components/numbers/Inspector";
import { BY_SLUG, SHEETS } from "@/data/schema";
import { DATA } from "@/data/seed";
import { useState } from "react";
import { Search } from "lucide-react";

export const SalesSheet = () => <SheetPage sheet="sales" />;
export const InventorySheet = () => <SheetPage sheet="inventory" />;
export const ProcurementSheet = () => <SheetPage sheet="procurement" />;
export const FinanceSheet = () => <SheetPage sheet="finance" />;
export const RelationshipsSheet = () => <SheetPage sheet="relationships" />;
export const CreditSheet = () => <SheetPage sheet="credit" />;
export const AdminSheet = () => <SheetPage sheet="admin" />;

/** Generic Table Browser — ensures ZERO feature loss for every DocType. */
export function TableBrowser() {
  const [, params] = useRoute<{ slug: string }>("/t/:slug");
  const [view, setView] = useState<"table"|"kanban"|"calendar"|"form"|"chart">("table");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<any>(null);
  const dt = params && BY_SLUG[params.slug];
  const [rows, setRows] = useState<any[]>(params ? [...(DATA[params.slug] ?? [])] : []);
  if (!dt) return (
    <SheetAppShell title="Not Found">
      <div className="empty-state" style={{ marginTop: 80 }}>
        <div className="ill"><Search size={20} /></div>
        <div className="title">That sheet doesn’t exist</div>
        <div className="desc">No DocType is registered at <kbd>/t/{params?.slug}</kbd>. Try the command palette (⌘K) or jump back to the dashboard.</div>
        <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
          <Link href="/" className="ghost-btn">Back to Dashboard</Link>
        </div>
      </div>
    </SheetAppShell>
  );

  const sheetMeta = SHEETS.find((s) => s.slug === dt.sheet);

  return (
    <SheetAppShell sheet={dt.sheet} title={dt.label} subtitle={`${dt.singular} · ${dt.sheet}`}>
      <Toolbar
        view={view} onViewChange={setView}
        views={["table", ...(dt.altViews ?? [])].filter((v,i,a)=>a.indexOf(v)===i) as any}
        search={search} onSearch={setSearch}
      />
      <div className="flex" style={{ flex: 1, minHeight: 0 }}>
        <div className="flex-1 flex flex-col" style={{ minWidth: 0 }}>
          <SheetTable
            doctype={dt}
            rows={rows}
            search={search}
            selectedId={selected?.name ?? null}
            onSelect={setSelected}
            onOpen={setSelected}
            onRowChange={(idx, patch) => {
              setRows((rs) => {
                const next = [...rs];
                next[idx] = { ...next[idx], ...patch };
                return next;
              });
            }}
          />
        </div>
        {selected && (
          <Inspector
            doctype={dt}
            row={selected}
            onClose={() => setSelected(null)}
            accent={sheetMeta?.tint}
            sheetInk={sheetMeta?.ink}
          />
        )}
      </div>
    </SheetAppShell>
  );
}

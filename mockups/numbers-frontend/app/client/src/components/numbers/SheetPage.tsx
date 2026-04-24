import { useMemo, useState } from "react";
import SheetAppShell from "./SheetAppShell";
import SheetTabBar, { type TabDef } from "./SheetTabBar";
import Toolbar, { type ViewKind } from "./Toolbar";
import SheetTable from "./SheetTable";
import KanbanView from "./KanbanView";
import Inspector from "./Inspector";
import { BY_SHEET, SHEETS, type Sheet, type DocTypeDef } from "@/data/schema";
import { DATA } from "@/data/seed";
import { chipClassFor } from "@/lib/format";
import { Crown } from "lucide-react";
import { toast } from "sonner";

export default function SheetPage({ sheet }: { sheet: Sheet }) {
  const sheetMeta = SHEETS.find((s) => s.slug === sheet)!;
  const doctypes = BY_SHEET[sheet] ?? [];
  const [activeSlug, setActiveSlug] = useState(doctypes[0]?.slug);
  const [view, setView] = useState<ViewKind>("table");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<any>(null);
  // per-doctype mutable row state for demo
  const [rowsBySlug, setRowsBySlug] = useState<Record<string, any[]>>(() => {
    const init: Record<string, any[]> = {};
    doctypes.forEach((d) => { init[d.slug] = [...(DATA[d.slug] ?? [])]; });
    return init;
  });

  const dt = doctypes.find((d) => d.slug === activeSlug)!;
  const rows = rowsBySlug[activeSlug] ?? [];

  // pick the right views based on doctype altViews
  const availableViews = useMemo<ViewKind[]>(() => {
    const base: ViewKind[] = ["table"];
    if (dt?.altViews?.includes("kanban"))   base.push("kanban");
    if (dt?.altViews?.includes("calendar")) base.push("calendar");
    if (dt?.altViews?.includes("form"))     base.push("form");
    return base;
  }, [dt]);

  // force back to table if the chosen view isn't offered by this table
  const effectiveView: ViewKind = availableViews.includes(view) ? view : "table";

  // Sheet tabs: one per DocType within the sheet — Numbers-style "sheet tabs"
  // Tiny color dot per tab, cycling through the sheet's ink + soft variants.
  const dotPalette = [sheetMeta.ink, "#FF9F0A", "#30B58B", "#AF52DE", "#5B8DEF", "#D97757", "#3C8DDB"]; 
  const tabs: TabDef[] = doctypes.map((d, i) => ({
    key: d.slug, label: d.label,
    count: (rowsBySlug[d.slug] ?? []).length,
    color: dotPalette[i % dotPalette.length],
  }));

  return (
    <SheetAppShell
      sheet={sheet}
      title={sheetMeta.label}
      subtitle={sheetMeta.hint}
    >
      <Toolbar
        view={effectiveView}
        onViewChange={setView}
        views={availableViews}
        search={search}
        onSearch={setSearch}
        onInsert={() => {
          const shell: any = {};
          dt.fields.forEach((f) => { shell[f.name] = f.type === "check" ? false : null; });
          if (dt.namingPrefix) shell.name = dt.namingPrefix + String(Math.floor(Math.random() * 10_000)).padStart(4, "0");
          setRowsBySlug((m) => ({ ...m, [activeSlug!]: [shell, ...(m[activeSlug!] ?? [])] }));
          toast.success("Row inserted — double-click a cell to edit");
        }}
      />

      <div className="flex" style={{ flex: 1, minHeight: 0 }}>
        <div className="flex-1 flex flex-col" style={{ minWidth: 0 }}>
          {effectiveView === "table" && (
            <SheetTable
              doctype={dt}
              rows={rows}
              search={search}
              selectedId={selected?.name ?? selected?.id ?? null}
              onSelect={(r) => setSelected(r)}
              onOpen={(r) => setSelected(r)}
              onRowChange={(idx, patch) => {
                setRowsBySlug((m) => {
                  const next = [...(m[activeSlug!] ?? [])];
                  next[idx] = { ...next[idx], ...patch };
                  return { ...m, [activeSlug!]: next };
                });
              }}
            />
          )}
          {effectiveView === "kanban" && dt.statusField && (
            <KanbanView
              doctype={dt}
              rows={rows}
              groupField={dt.statusField}
              onOpen={(r) => setSelected(r)}
              titleField={dt.titleField ?? dt.fields[0].name}
              subtitleField={
                dt.fields.find((f) => f.type === "link")?.name
              }
              amountField={dt.fields.find((f) => f.type === "currency")?.name}
            />
          )}
          {effectiveView === "calendar" && (
            <CalendarPreview dt={dt} rows={rows} onOpen={(r) => setSelected(r)} />
          )}
          {effectiveView === "form" && selected && (
            <FormView dt={dt} row={selected} />
          )}
          {effectiveView === "form" && !selected && (
            <div style={{ padding: 40, color: "var(--text-3)", fontSize: 13 }}>
              Select a row to see the form view.
            </div>
          )}

        </div>

        {selected && (
          <Inspector
            doctype={dt}
            row={selected}
            onClose={() => setSelected(null)}
            accent={sheetMeta.tint}
            sheetInk={sheetMeta.ink}
          />
        )}
      </div>

      {/* Bottom sheet tabs — Numbers-style */}
      <SheetTabBar
        tabs={tabs}
        active={activeSlug ?? ""}
        onSelect={(k) => { setActiveSlug(k); setSelected(null); }}
        position="bottom"
      />
    </SheetAppShell>
  );
}

function CalendarPreview({ dt, rows, onOpen }: { dt: DocTypeDef; rows: any[]; onOpen: (r: any) => void; }) {
  // find a date-like field
  const dateField = dt.fields.find((f) => f.type === "date" || f.type === "datetime")?.name;
  const titleField = dt.titleField ?? dt.fields[0].name;
  if (!dateField) return <div style={{ padding: 40, color: "var(--text-3)" }}>No date field to calendar.</div>;
  const now = new Date("2026-04-23T12:00:00Z");
  const year = now.getFullYear();
  const month = now.getMonth();
  const firstDay = new Date(year, month, 1);
  const startDow = firstDay.getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const byDay: Record<number, any[]> = {};
  rows.forEach((r) => {
    const v = r[dateField];
    if (!v) return;
    const d = new Date(String(v).replace(" ", "T"));
    if (d.getMonth() === month && d.getFullYear() === year) {
      (byDay[d.getDate()] ||= []).push(r);
    }
  });

  return (
    <div style={{ padding: 16, background: "var(--canvas)", flex: 1, overflow: "auto" }}>
      <div style={{ background: "var(--surface)", border: "1px solid var(--border-hair)",
        borderRadius: 12, overflow: "hidden", boxShadow: "var(--shadow-card)" }}>
        <div className="flex items-center justify-between px-3 py-2" style={{ borderBottom: "1px solid var(--border-hair)" }}>
          <div style={{ fontWeight: 600, fontSize: 14 }}>
            {now.toLocaleString("en-US", { month: "long" })} {year}
          </div>
          <div style={{ fontSize: 11, color: "var(--text-3)" }}>{rows.length} events</div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", background: "#F2F2F4" }}>
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
            <div key={d} style={{ padding: 8, fontSize: 11, color: "var(--text-3)", textTransform: "uppercase", borderBottom: "1px solid var(--border-hair)" }}>
              {d}
            </div>
          ))}
          {Array.from({ length: startDow }).map((_, i) => <div key={"e" + i} style={{ background: "#FAFAFC", minHeight: 90 }} />)}
          {Array.from({ length: daysInMonth }).map((_, i) => {
            const day = i + 1;
            const events = byDay[day] ?? [];
            const isToday = day === now.getDate();
            return (
              <div key={day} style={{
                borderRight: "1px solid var(--border-hair)", borderBottom: "1px solid var(--border-hair)",
                background: "var(--surface)", padding: 6, minHeight: 90, fontSize: 11,
              }}>
                <div style={{
                  fontWeight: 600, fontSize: 11,
                  color: isToday ? "#fff" : "var(--text-2)",
                  background: isToday ? "var(--accent-blue)" : "transparent",
                  width: 20, height: 20, borderRadius: 999, display: "inline-flex",
                  alignItems: "center", justifyContent: "center",
                }}>{day}</div>
                {events.slice(0, 3).map((r, ei) => (
                  <div key={ei} onClick={() => onOpen(r)}
                    style={{
                      marginTop: 2, padding: "2px 6px", background: "var(--accent-blue-bg)",
                      color: "#0066CC", borderRadius: 4, fontSize: 11, cursor: "pointer",
                      overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                    }}>
                    {r[titleField]}
                  </div>
                ))}
                {events.length > 3 && <div style={{ fontSize: 10, color: "var(--text-3)", marginTop: 2 }}>+{events.length - 3} more</div>}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function FormView({ dt, row }: { dt: DocTypeDef; row: any; }) {
  return (
    <div style={{ padding: 24, overflow: "auto", flex: 1, background: "var(--canvas)" }}>
      <div style={{
        maxWidth: 720, margin: "0 auto", background: "var(--surface)",
        border: "1px solid var(--border-hair)", borderRadius: 12, padding: 24,
        boxShadow: "var(--shadow-card)",
      }}>
        <div style={{ fontSize: 11, color: "var(--text-3)", letterSpacing: ".06em", textTransform: "uppercase" }}>
          {dt.singular}
        </div>
        <div style={{ fontSize: 22, fontWeight: 700, letterSpacing: "-0.02em", marginTop: 4 }}>
          {row[dt.titleField ?? dt.fields[0].name]}
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginTop: 20 }}>
          {dt.fields.map((f) => (
            <div key={f.name}>
              <div style={{ fontSize: 11, color: "var(--text-3)", marginBottom: 4 }}>{f.label}</div>
              <div style={{
                fontSize: 13, padding: "6px 10px", border: "1px solid var(--border-hair)",
                borderRadius: 6, minHeight: 30, background: "var(--surface)",
              }}>
                {row[f.name] === null || row[f.name] === "" || row[f.name] === undefined ? (
                  <span style={{ color: "var(--text-3)" }}>—</span>
                ) : f.type === "select" ? (
                  <span className={chipClassFor(row[f.name])}>{row[f.name]}</span>
                ) : (
                  String(row[f.name])
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

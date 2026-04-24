import type { DocTypeDef } from "@/data/schema";
import { chipClassFor, fmtCurrency, fmtDate } from "@/lib/format";

export default function KanbanView({
  doctype, rows, groupField, onOpen, titleField, subtitleField, amountField,
}: {
  doctype: DocTypeDef;
  rows: any[];
  groupField: string;
  onOpen?: (row: any) => void;
  titleField?: string;
  subtitleField?: string;
  amountField?: string;
}) {
  const field = doctype.fields.find((f) => f.name === groupField);
  const cols = (field?.options as string[]) ??
    Array.from(new Set(rows.map((r) => r[groupField]).filter(Boolean)));

  const grouped: Record<string, any[]> = {};
  cols.forEach((c) => (grouped[c] = []));
  rows.forEach((r) => {
    const k = r[groupField] ?? "—";
    (grouped[k] ||= []).push(r);
  });

  const tField = titleField ?? doctype.titleField ?? doctype.fields[0].name;

  return (
    <div
      className="num-scroll"
      style={{ flex: 1, overflow: "auto", padding: 16, background: "var(--canvas)" }}
    >
      <div style={{ display: "flex", gap: 12, minWidth: "100%" }}>
        {Object.entries(grouped).map(([col, items]) => (
          <div
            key={col}
            style={{
              width: 280, flexShrink: 0, background: "var(--surface)",
              borderRadius: 12, border: "1px solid var(--border-hair)",
              overflow: "hidden", boxShadow: "var(--shadow-card)",
            }}
          >
            <div
              className="flex items-center justify-between px-3 py-2"
              style={{ borderBottom: "1px solid var(--border-hair)" }}
            >
              <div className="flex items-center gap-2">
                <span className={chipClassFor(col)}>{col || "—"}</span>
              </div>
              <span style={{ fontSize: 11, color: "var(--text-3)" }}>{items.length}</span>
            </div>
            <div className="num-scroll" style={{ padding: 8, maxHeight: "calc(100vh - 240px)", overflow: "auto" }}>
              {items.map((r, i) => (
                <div
                  key={r.id ?? r.name ?? i}
                  onClick={() => onOpen?.(r)}
                  style={{
                    background: "var(--surface)", padding: "8px 10px",
                    border: "1px solid var(--border-hair)", borderRadius: 8,
                    marginBottom: 6, cursor: "pointer",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.boxShadow = "var(--shadow-card)")}
                  onMouseLeave={(e) => (e.currentTarget.style.boxShadow = "none")}
                >
                  <div style={{ fontSize: 12, fontWeight: 600, color: "var(--text-1)" }}>
                    {r[tField]}
                  </div>
                  {subtitleField && r[subtitleField] && (
                    <div style={{ fontSize: 11, color: "var(--text-2)", marginTop: 2 }}>
                      {r[subtitleField]}
                    </div>
                  )}
                  {amountField && r[amountField] !== undefined && (
                    <div style={{ fontSize: 12, fontWeight: 600, marginTop: 4, color: "var(--text-1)" }}>
                      {fmtCurrency(r[amountField])}
                    </div>
                  )}
                </div>
              ))}
              {items.length === 0 && (
                <div style={{ padding: 20, textAlign: "center", fontSize: 11, color: "var(--text-3)" }}>
                  No cards
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

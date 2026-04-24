import { X, History, Link2, MessageSquare, Pencil, Copy, MoreHorizontal, ExternalLink } from "lucide-react";
import type { DocTypeDef } from "@/data/schema";
import { fmtCurrency, fmtDate, fmtDateTime, fmtNum, fmtPct, chipClassFor, shortStatus } from "@/lib/format";
import { toast } from "sonner";

export default function Inspector({
  doctype, row, onClose, extraTabs, accent, sheetInk,
}: {
  doctype: DocTypeDef;
  row: any | null;
  onClose: () => void;
  extraTabs?: React.ReactNode;
  /** Soft tint shown on the top strip */
  accent?: string;
  /** Optional ink colour matched to the sheet */
  sheetInk?: string;
}) {
  if (!row) return null;
  const titleField = doctype.titleField ?? doctype.fields[0].name;
  const title = row[titleField] ?? "Untitled";

  // Pick a "primary value" to show big — first currency, else first numeric
  const primary =
    doctype.fields.find((f) => f.type === "currency" && row[f.name] !== null && row[f.name] !== undefined)
    ?? doctype.fields.find((f) => (f.type === "int" || f.type === "float") && row[f.name] !== null && row[f.name] !== undefined);
  const status = doctype.fields.find((f) => f.type === "select");
  const statusValue = status ? row[status.name] : null;

  const accentColor = sheetInk ?? "var(--accent-blue)";
  const stripBg = accent ?? "var(--accent-blue-bg)";

  return (
    <aside
      className="num-scroll"
      style={{
        width: "var(--inspector-width)",
        background: "var(--surface)",
        borderLeft: "1px solid var(--border-hair)",
        display: "flex", flexDirection: "column", minWidth: 0,
        boxShadow: "-2px 0 8px rgba(0,0,0,.04)",
      }}
    >
      {/* Top accent strip */}
      <div style={{ height: 4, background: accentColor }} />

      {/* Header */}
      <div
        style={{
          padding: "14px 16px 12px",
          borderBottom: "1px solid var(--border-hair)",
          background: `linear-gradient(180deg, ${stripBg} 0%, var(--surface) 100%)`,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{
            fontSize: 11, color: accentColor, letterSpacing: ".06em",
            textTransform: "uppercase", fontWeight: 700,
          }}>
            {doctype.singular}
          </div>
          <button onClick={onClose} className="rounded-md p-1 hover:bg-[color:var(--accent)]" title="Close">
            <X size={14} />
          </button>
        </div>

        <div style={{ marginTop: 6, fontSize: 18, fontWeight: 700, letterSpacing: "-0.015em",
          color: "var(--text-1)", lineHeight: 1.2,
          whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
        }}>
          {String(title)}
        </div>

        <div style={{ marginTop: 8, display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
          {statusValue && (
            <span className={chipClassFor(statusValue)} title={String(statusValue)}>
              {shortStatus(statusValue)}
            </span>
          )}
          {primary && (
            <div style={{
              fontSize: 22, fontWeight: 700, fontVariantNumeric: "tabular-nums",
              letterSpacing: "-0.015em", color: "var(--text-1)", marginLeft: "auto",
            }}>
              {primary.type === "currency" ? fmtCurrency(row[primary.name]) : fmtNum(row[primary.name])}
            </div>
          )}
        </div>

        <div style={{ marginTop: 10, display: "flex", gap: 6 }}>
          <ActionButton icon={<Pencil size={12} />} label="Edit" primary onClick={() => toast("Edit — demo only")} />
          <ActionButton icon={<ExternalLink size={12} />} label="Open" onClick={() => toast("Open record — demo only")} />
          <ActionButton icon={<Copy size={12} />} label="Duplicate" onClick={() => toast("Duplicate — demo only")} />
          <ActionButton icon={<MoreHorizontal size={12} />} label="" onClick={() => toast("More — demo only")} />
        </div>
      </div>

      {/* Body */}
      <div className="num-scroll" style={{ overflow: "auto", flex: 1, padding: "14px 16px" }}>
        <SectionHeader>Details</SectionHeader>
        <div style={{ display: "grid", gridTemplateColumns: "120px 1fr", rowGap: 10, columnGap: 10 }}>
          {doctype.fields.map((f) => {
            // skip the title and primary fields in the details list — already shown above
            if (f.name === titleField) return null;
            if (primary && f.name === primary.name) return null;
            if (status && f.name === status.name) return null;

            const v = row[f.name];
            let display: React.ReactNode;
            if (v === null || v === undefined || v === "") display = <span style={{ color: "var(--text-3)" }}>—</span>;
            else if (f.type === "currency") display = fmtCurrency(v);
            else if (f.type === "percent")  display = fmtPct(v);
            else if (f.type === "int" || f.type === "float") display = fmtNum(v);
            else if (f.type === "date")     display = fmtDate(v);
            else if (f.type === "datetime") display = fmtDateTime(v);
            else if (f.type === "check")    display = v ? "Yes" : "No";
            else if (f.type === "select")   display = <span className={chipClassFor(v)}>{shortStatus(v)}</span>;
            else if (f.type === "link")     display = <span style={{ color: "var(--accent-blue)" }}>{String(v)}</span>;
            else display = String(v);
            return (
              <div key={f.name} style={{ display: "contents" }}>
                <div style={{ fontSize: 11, color: "var(--text-3)", paddingTop: 2,
                  textTransform: "uppercase", letterSpacing: ".04em", fontWeight: 600 }}>
                  {f.label}
                </div>
                <div style={{ fontSize: 13, color: "var(--text-1)", fontVariantNumeric: "tabular-nums",
                  display: "flex", alignItems: "center", minWidth: 0, overflow: "hidden", textOverflow: "ellipsis" }}>
                  {display}
                </div>
              </div>
            );
          })}
        </div>

        {extraTabs && (
          <>
            <SectionDivider />
            <SectionHeader>Related</SectionHeader>
            {extraTabs}
          </>
        )}

        <SectionDivider />
        <SectionHeader>Activity</SectionHeader>
        <ActivityItem icon={<History size={13} />} title="Record updated"
          meta="Alex Admin · 2 hours ago" />
        <ActivityItem icon={<Link2 size={13} />} title="Linked to 3 related records"
          meta="via relations" />
        <ActivityItem icon={<MessageSquare size={13} />} title="No comments yet"
          meta="⌘⇧M to add" />
      </div>
    </aside>
  );
}

function SectionHeader({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      fontSize: 11, color: "var(--text-3)", textTransform: "uppercase",
      letterSpacing: ".06em", marginBottom: 10, fontWeight: 700,
    }}>{children}</div>
  );
}

function SectionDivider() {
  return <div style={{ marginTop: 18, borderTop: "1px solid var(--border-soft)", paddingTop: 14 }} />;
}

function ActivityItem({ icon, title, meta }: { icon: React.ReactNode; title: string; meta: string }) {
  return (
    <div style={{ display: "flex", gap: 8, alignItems: "flex-start", marginBottom: 8 }}>
      <div style={{
        width: 22, height: 22, borderRadius: 6, background: "#F2F2F4",
        display: "flex", alignItems: "center", justifyContent: "center",
        color: "var(--text-3)", flexShrink: 0,
      }}>{icon}</div>
      <div style={{ minWidth: 0 }}>
        <div style={{ fontSize: 12, fontWeight: 500 }}>{title}</div>
        <div style={{ fontSize: 11, color: "var(--text-3)" }}>{meta}</div>
      </div>
    </div>
  );
}

function ActionButton({ icon, label, onClick, primary }: {
  icon: React.ReactNode; label: string; onClick: () => void; primary?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      style={{
        height: 28, padding: label ? "0 10px" : "0 8px", borderRadius: 6,
        background: primary ? "var(--accent-blue)" : "var(--surface)",
        color: primary ? "#fff" : "var(--text-1)",
        border: primary ? "1px solid var(--accent-blue)" : "1px solid var(--border-hair)",
        fontSize: 12, fontWeight: 600,
        display: "inline-flex", alignItems: "center", gap: 5,
        boxShadow: primary ? "0 1px 2px rgba(0,122,255,.25)" : "none",
        transition: "background .12s var(--ease-out)",
      }}
    >
      {icon} {label}
    </button>
  );
}

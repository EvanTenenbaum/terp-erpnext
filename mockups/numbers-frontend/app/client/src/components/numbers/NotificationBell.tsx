import { useState } from "react";
import { Bell, AlertTriangle, Clock, UserCheck, FileWarning, Sprout, Receipt } from "lucide-react";
import { notifications } from "@/data/seed";
import { fmtDateTime } from "@/lib/format";

const ICONS: Record<string, any> = {
  credit_override: AlertTriangle,
  sample_due:      Clock,
  need_matched:    UserCheck,
  invoice_dispute: FileWarning,
  harvest_due:     Sprout,
  payment_received: Receipt,
};
const COLORS: Record<string, string> = {
  credit_override: "#FF9500",
  sample_due:      "#007AFF",
  need_matched:    "#34C759",
  invoice_dispute: "#FF3B30",
  harvest_due:     "#8E44AD",
  payment_received: "#00838F",
};

export default function NotificationBell() {
  const [open, setOpen] = useState(false);
  const unread = notifications.filter((n) => n.unread).length;

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="relative rounded-md p-1.5 hover:bg-[color:var(--accent)]"
        title="Notifications"
      >
        <Bell size={16} />
        {unread > 0 && (
          <span
            style={{
              position: "absolute", top: 0, right: 0,
              background: "var(--danger)", color: "#fff",
              fontSize: 9, fontWeight: 700, padding: "1px 4px",
              borderRadius: 999, minWidth: 16, textAlign: "center",
            }}
          >{unread}</span>
        )}
      </button>

      {open && (
        <>
          <div className="fixed inset-0" style={{ zIndex: 30 }} onClick={() => setOpen(false)} />
          <div
            className="absolute right-0"
            style={{
              top: "calc(100% + 8px)", width: 360, maxHeight: 440, overflow: "auto",
              background: "var(--surface)", border: "1px solid var(--border-hair)",
              borderRadius: "var(--radius-lg)", boxShadow: "var(--shadow-drop)", zIndex: 31,
            }}
          >
            <div className="flex items-center justify-between px-3 py-2" style={{ borderBottom: "1px solid var(--border-hair)" }}>
              <div style={{ fontSize: 13, fontWeight: 600 }}>Notifications</div>
              <button className="chip chip-blue" onClick={() => setOpen(false)}>Mark all read</button>
            </div>
            <div>
              {notifications.map((n) => {
                const Ico = ICONS[n.kind] ?? Bell;
                return (
                  <div key={n.id}
                    className="flex items-start gap-2 px-3 py-2.5"
                    style={{
                      borderBottom: "1px solid var(--border-soft)",
                      background: n.unread ? "rgba(0,122,255,0.03)" : "transparent",
                      cursor: "pointer",
                    }}
                  >
                    <div style={{
                      width: 28, height: 28, borderRadius: 8,
                      background: COLORS[n.kind] + "20", color: COLORS[n.kind],
                      display: "flex", alignItems: "center", justifyContent: "center",
                      flexShrink: 0,
                    }}>
                      <Ico size={14} />
                    </div>
                    <div style={{ minWidth: 0, flex: 1 }}>
                      <div style={{ fontSize: 12, fontWeight: 600 }}>{n.title}</div>
                      <div style={{ fontSize: 12, color: "var(--text-2)", marginTop: 1 }}>{n.body}</div>
                      <div style={{ fontSize: 11, color: "var(--text-3)", marginTop: 2 }}>{fmtDateTime(n.at)}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

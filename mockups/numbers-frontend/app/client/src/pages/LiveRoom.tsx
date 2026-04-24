import { useRoute } from "wouter";
import SheetAppShell from "@/components/numbers/SheetAppShell";
import { live_shopping_session, batch, item } from "@/data/seed";
import { Video, Mic, Users, Send, ShoppingCart, Square, Pause, Plus } from "lucide-react";
import { useState } from "react";
import { fmtCurrency, fmtDateTime, chipClassFor, shortStatus } from "@/lib/format";
import { toast } from "sonner";

export default function LiveRoom() {
  const [, params] = useRoute<{ id: string }>("/live/:id");
  const id = params?.id ?? "LS-0020";
  const session = live_shopping_session.find((s) => s.name === id) ?? live_shopping_session[0];
  const [picked, setPicked] = useState<string | null>(batch[0].name);
  const currentBatch = batch.find((b) => b.name === picked) ?? batch[0];
  const currentItem = item.find((i) => i.name === currentBatch.item);

  const [messages, setMessages] = useState([
    { id: 1, who: "rep", user: "Adil (rep)",       text: "Welcome everyone — we'll start with Blue Dream." },
    { id: 2, who: "cust", user: "Green Lotus",      text: "Ready! How's the terp profile today?" },
    { id: 3, who: "rep", user: "Adil (rep)",       text: "Loud on the berry — same as last batch." },
  ]);
  const [text, setText] = useState("");

  return (
    <SheetAppShell
      sheet="sales"
      title={"Live · " + session.session_title}
      subtitle={`${session.customer ?? "Open session"} · started ${fmtDateTime(session.start_time)}`}
      actions={
        <div className="flex items-center gap-2">
          <span className={chipClassFor(session.status)}>{shortStatus(session.status)}</span>
          <span style={{
            display: "inline-flex", alignItems: "center", gap: 4,
            fontSize: 11, fontWeight: 600, color: "var(--text-2)",
            padding: "3px 8px", background: "#F2F2F4", borderRadius: 999,
          }}>
            <Users size={11} /> 18 watching
          </span>
        </div>
      }
    >
      <div style={{ display: "grid", gridTemplateColumns: "1fr 360px", flex: 1, minHeight: 0 }}>
        {/* Stage */}
        <div style={{ background: "#111", color: "#fff", minWidth: 0, display: "flex", flexDirection: "column" }}>
          <div style={{ flex: 1, position: "relative",
            background: "radial-gradient(circle at 30% 30%, rgba(0,122,255,0.22), transparent 60%), radial-gradient(circle at 80% 70%, rgba(173,20,87,0.18), transparent 55%), #0a0a0c",
            display: "flex", alignItems: "center", justifyContent: "center",
            overflow: "hidden",
          }}>
            {/* Subtle grain */}
            <div style={{
              position: "absolute", inset: 0,
              backgroundImage: "radial-gradient(rgba(255,255,255,0.04) 1px, transparent 1px)",
              backgroundSize: "3px 3px", opacity: 0.6, pointerEvents: "none",
            }} />
            {/* Live pulse */}
            <div style={{
              position: "absolute", top: 16, left: 16,
              display: "inline-flex", alignItems: "center", gap: 6,
              padding: "4px 10px", borderRadius: 999,
              background: "rgba(255,59,48,0.92)", color: "#fff",
              fontSize: 11, fontWeight: 700, letterSpacing: ".04em",
              boxShadow: "0 0 0 4px rgba(255,59,48,0.18)",
            }}>
              <span style={{ width: 6, height: 6, borderRadius: 999, background: "#fff", animation: "livepulse 1.2s ease-in-out infinite" }} /> LIVE
            </div>
            <div style={{ textAlign: "center" }}>
              <div style={{
                width: 84, height: 84, borderRadius: 999,
                background: "linear-gradient(135deg, #AD1457, #FF3B30)",
                display: "flex", alignItems: "center", justifyContent: "center",
                margin: "0 auto", boxShadow: "0 0 0 6px rgba(255,59,48,0.2)",
              }}>
                <Video size={32} />
              </div>
              <div style={{ fontSize: 14, fontWeight: 600, marginTop: 14 }}>{session.session_title}</div>
              <div style={{ fontSize: 11, color: "rgba(255,255,255,0.6)", marginTop: 2 }}>
                Room {session.room_code} · <span style={{ color: "#FF3B30" }}>● LIVE</span>
              </div>
            </div>

            {/* Pinned item card */}
            <div style={{
              position: "absolute", left: 20, bottom: 20,
              background: "rgba(0,0,0,0.6)", backdropFilter: "blur(12px)",
              borderRadius: 12, padding: 14, border: "1px solid rgba(255,255,255,0.1)",
              minWidth: 260,
            }}>
              <div style={{ fontSize: 10, color: "rgba(255,255,255,0.6)", textTransform: "uppercase", letterSpacing: ".06em" }}>Now showing</div>
              <div style={{ fontSize: 14, fontWeight: 700, marginTop: 2 }}>{currentItem?.item_name}</div>
              <div style={{ fontSize: 11, color: "rgba(255,255,255,0.7)", marginTop: 1 }}>Batch {currentBatch.name} · {currentBatch.qty} avail.</div>
              <div style={{ fontSize: 18, fontWeight: 700, marginTop: 6 }}>{fmtCurrency((currentBatch.unit_cost ?? 0) * 1.4)}</div>
              <div className="flex gap-2 mt-2">
                <button style={{
                  padding: "6px 12px", background: "#007AFF", color: "#fff",
                  borderRadius: 6, fontSize: 11, fontWeight: 600,
                }} onClick={() => toast.success("Added to sales order — demo")}>
                  <ShoppingCart size={11} style={{ display: "inline", marginRight: 4 }} /> Add to order
                </button>
                <button style={{ padding: "6px 12px", background: "rgba(255,255,255,0.1)", color: "#fff", borderRadius: 6, fontSize: 11 }}>
                  <Plus size={11} />
                </button>
              </div>
            </div>
          </div>

          {/* Stage controls */}
          <div style={{
            background: "rgba(0,0,0,0.6)", padding: "10px 16px", display: "flex", alignItems: "center", gap: 10,
            borderTop: "1px solid rgba(255,255,255,0.1)",
          }}>
            <button className="stage-btn"><Mic size={14} /> Mic</button>
            <button className="stage-btn"><Video size={14} /> Cam</button>
            <button className="stage-btn"><Users size={14} /> Invite</button>
            <div style={{ flex: 1 }} />
            <button className="stage-btn"><Pause size={14} /> Pause</button>
            <button style={{
              padding: "8px 14px", background: "#FF3B30", color: "#fff",
              borderRadius: 8, fontSize: 12, fontWeight: 600,
            }}><Square size={12} style={{ display: "inline", marginRight: 4 }} /> End session</button>
          </div>
        </div>

        {/* Right: products pick + chat */}
        <aside style={{ display: "flex", flexDirection: "column", minWidth: 0, background: "var(--surface)", borderLeft: "1px solid var(--border-hair)" }}>
          <div style={{ padding: "10px 14px", borderBottom: "1px solid var(--border-hair)" }}>
            <div style={{ fontSize: 11, color: "var(--text-3)", textTransform: "uppercase", letterSpacing: ".06em" }}>Featured items</div>
          </div>
          <div className="num-scroll" style={{ maxHeight: 260, overflow: "auto" }}>
            {batch.slice(0, 6).map((b) => (
              <div key={b.name} onClick={() => setPicked(b.name)}
                className="list-row" style={{
                  background: picked === b.name ? "var(--accent-blue-bg)" : "transparent",
                  cursor: "pointer",
                }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 12, fontWeight: 600 }}>{b.item}</div>
                  <div style={{ fontSize: 11, color: "var(--text-3)" }}>{b.name} · {b.qty}g</div>
                </div>
                <div style={{ fontSize: 12, fontWeight: 600 }}>{fmtCurrency((b.unit_cost ?? 0) * 1.4)}</div>
              </div>
            ))}
          </div>

          <div className="flex-1" style={{ display: "flex", flexDirection: "column", minHeight: 0, borderTop: "1px solid var(--border-hair)" }}>
            <div style={{ padding: "10px 14px", borderBottom: "1px solid var(--border-hair)" }}>
              <div style={{ fontSize: 11, color: "var(--text-3)", textTransform: "uppercase", letterSpacing: ".06em" }}>Chat · {messages.length}</div>
            </div>
            <div className="num-scroll" style={{ flex: 1, overflow: "auto", padding: 12 }}>
              {messages.map((m) => (
                <div key={m.id} style={{
                  marginBottom: 8,
                  background: m.who === "rep" ? "var(--accent-blue-bg)" : "#F2F2F4",
                  padding: "6px 10px", borderRadius: 8,
                }}>
                  <div style={{ fontSize: 10, color: "var(--text-3)" }}>{m.user}</div>
                  <div style={{ fontSize: 12, color: "var(--text-1)" }}>{m.text}</div>
                </div>
              ))}
            </div>
            <div className="flex items-center gap-2 px-3 py-2" style={{ borderTop: "1px solid var(--border-hair)" }}>
              <input value={text} onChange={(e) => setText(e.target.value)}
                placeholder="Say something…"
                style={{
                  flex: 1, padding: "6px 10px", borderRadius: 6,
                  border: "1px solid var(--border-hair)", fontSize: 12,
                }}
                onKeyDown={(e) => { if (e.key === "Enter" && text.trim()) { setMessages(m => [...m, { id: m.length + 1, who: "rep", user: "You", text }]); setText(""); } }}
              />
              <button style={{
                height: 28, width: 28, borderRadius: 6, background: "var(--accent-blue)",
                color: "#fff", display: "flex", alignItems: "center", justifyContent: "center",
              }}
                onClick={() => { if (text.trim()) { setMessages(m => [...m, { id: m.length + 1, who: "rep", user: "You", text }]); setText(""); } }}
              >
                <Send size={12} />
              </button>
            </div>
          </div>
        </aside>
      </div>
    </SheetAppShell>
  );
}

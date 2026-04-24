import { Link } from "wouter";
import SheetAppShell from "@/components/numbers/SheetAppShell";
import {
  kpi, sales_order, sales_invoice, batch, credit_override_request,
  photography_queue, supplier_harvest_reminder, client_leaderboard, revenue_trends,
} from "@/data/seed";
import { SHEETS } from "@/data/schema";
import { fmtCurrency, fmtNum, fmtDate, chipClassFor, shortStatus } from "@/lib/format";
import {
  TrendingUp, AlertTriangle, Camera, Sprout, Crown, Package,
  FileText, ArrowUpRight, ArrowDownRight, ChevronRight, DollarSign,
} from "lucide-react";

export default function Home() {
  return (
    <SheetAppShell
      sheet="dashboard"
      title="Today"
      subtitle="Monday, April 23 · Welcome back, Alex"
    >
      <div className="num-scroll" style={{ flex: 1, overflow: "auto", padding: 20, background: "var(--canvas)" }}>
        <div style={{ maxWidth: 1400, margin: "0 auto" }}>

          {/* KPI strip */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 12, marginBottom: 16 }}>
            <KpiCard label="Orders today"       value={fmtNum(kpi.orders_today)}    delta={{ dir: "up",   text: "+1 vs yesterday" }}   tint="#34C759" icon={FileText} />
            <KpiCard label="Revenue · 30 d"     value={fmtCurrency(kpi.revenue_30d)} delta={{ dir: "up",   text: "+9.4% MoM" }}        tint="#007AFF" icon={TrendingUp} />
            <KpiCard label="Receivables"        value={fmtCurrency(kpi.receivables)} delta={{ dir: "down", text: "2 overdue" }}         tint="#FF9500" icon={DollarSign} />
            <KpiCard label="Live batches"       value={fmtNum(kpi.live_batches)}    delta={{ dir: "flat", text: `${kpi.photography_backlog} photo backlog` }} tint="#00838F" icon={Package} />
            <KpiCard label="Override queue"     value={fmtNum(kpi.override_queue)}  delta={{ dir: "down", text: "awaiting review" }} tint="#AF52DE" icon={AlertTriangle} />
          </div>

          {/* Two-column */}
          <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 12, marginBottom: 12 }}>
            {/* Revenue trend card */}
            <Card title="Revenue" subtitle="Feb – Apr · demo data" right={<Link href="/reports" className="link">Open Reports <ChevronRight size={12} /></Link>}>
              <div style={{ padding: "16px 20px 14px" }}>
                <RevenueChart data={revenue_trends} />
              </div>
            </Card>

            {/* Override queue */}
            <Card title="Credit overrides" subtitle={`${credit_override_request.filter(r=>r.status==="Pending").length} awaiting review`} right={<Link href="/credit" className="link">All <ChevronRight size={12} /></Link>}>
              <div>
                {credit_override_request.filter(r => r.status === "Pending").map((r) => (
                  <div key={r.name} className="list-row">
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 12, fontWeight: 600 }}>{r.customer}</div>
                      <div style={{ fontSize: 11, color: "var(--text-3)" }}>{r.sales_order ?? "—"} · {fmtCurrency(r.requested_amount)}</div>
                    </div>
                    <button className="ghost-btn">Approve</button>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Three column row */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, marginBottom: 12 }}>
            <Card title="Orders · This week" right={<Link href="/sales" className="link">Open sheet <ChevronRight size={12} /></Link>}>
              <div>
                {sales_order.slice(0, 6).map((o) => (
                  <div key={o.name} className="list-row">
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 12, fontWeight: 600 }}>{o.name}</div>
                      <div style={{ fontSize: 11, color: "var(--text-3)" }}>{o.customer}</div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <div style={{ fontSize: 12, fontWeight: 600, fontVariantNumeric: "tabular-nums" }}>{fmtCurrency(o.grand_total)}</div>
                      <span className={chipClassFor(o.status)} style={{ marginTop: 2 }}>{shortStatus(o.status)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            <Card title="Aging invoices" right={<Link href="/finance" className="link">Open sheet <ChevronRight size={12} /></Link>}>
              <div>
                {sales_invoice.filter((i) => i.outstanding_amount > 0).slice(0, 6).map((i) => (
                  <div key={i.name} className="list-row">
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 12, fontWeight: 600 }}>{i.name}</div>
                      <div style={{ fontSize: 11, color: "var(--text-3)" }}>{i.customer} · due {fmtDate(i.due_date)}</div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <div style={{ fontSize: 12, fontWeight: 600, fontVariantNumeric: "tabular-nums" }}>{fmtCurrency(i.outstanding_amount)}</div>
                      <span className={chipClassFor(i.status)} style={{ marginTop: 2 }}>{shortStatus(i.status)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            <Card title="Operations" right={<Link href="/inventory" className="link">Open sheet <ChevronRight size={12} /></Link>}>
              <div>
                <BlockRow icon={Camera} label="Photography backlog" value={`${photography_queue.filter(r=>r.status==="Pending").length} pending`} tint="#007AFF" />
                <BlockRow icon={Package} label="Batches · Awaiting intake" value={`${batch.filter(b=>b.batch_status==="Awaiting Intake").length} batches`} tint="#34C759" />
                <BlockRow icon={Sprout} label="Harvest reminders · 7 days" value={`${supplier_harvest_reminder.filter(h=>h.status==="Pending").length} pending`} tint="#8E44AD" />
                <BlockRow icon={Crown}  label="VIP leaderboard top" value={client_leaderboard[0].customer} tint="#AF52DE" />
              </div>
            </Card>
          </div>

          {/* Sheet navigator */}
          <div style={{ fontSize: 11, color: "var(--text-3)", textTransform: "uppercase", letterSpacing: ".06em",
            marginTop: 18, marginBottom: 8 }}>
            Sheets
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10 }}>
            {SHEETS.filter((s) => s.slug !== "vip").map((s) => (
              <Link key={s.slug} href={"/" + s.slug}
                className="sheet-nav-card"
                style={{
                  display: "flex", alignItems: "center", gap: 10,
                  padding: "12px 14px", borderRadius: 10,
                  background: "var(--surface)", border: "1px solid var(--border-hair)",
                  textDecoration: "none", color: "inherit",
                  transition: "transform .12s var(--ease-out), box-shadow .12s var(--ease-out), border-color .12s var(--ease-out)",
                }}
                onMouseEnter={(e) => { (e.currentTarget as any).style.boxShadow = "var(--shadow-drop)"; (e.currentTarget as any).style.transform = "translateY(-1px)"; (e.currentTarget as any).style.borderColor = s.ink + "44"; }}
                onMouseLeave={(e) => { (e.currentTarget as any).style.boxShadow = "none"; (e.currentTarget as any).style.transform = "translateY(0)"; (e.currentTarget as any).style.borderColor = "var(--border-hair)"; }}
              >
                <div style={{
                  width: 30, height: 30, borderRadius: 8, background: s.tint,
                  border: "1px solid " + s.ink + "22",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: s.ink, fontSize: 13, fontWeight: 700, flexShrink: 0,
                }}>{s.label[0]}</div>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text-1)" }}>{s.label}</div>
                  <div style={{ fontSize: 11, color: "var(--text-3)",
                    whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{s.hint}</div>
                </div>
              </Link>
            ))}
            <Link href="/vip"
              style={{
                display: "flex", alignItems: "center", gap: 10,
                padding: "12px 14px", borderRadius: 10,
                background: "linear-gradient(135deg, #EDE7F6 0%, #F5F1FF 100%)",
                border: "1px solid #7E57C233", textDecoration: "none",
              }}>
              <div style={{
                width: 30, height: 30, borderRadius: 8, background: "#7E57C2",
                color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
              }}><Crown size={14} /></div>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: "#4527A0" }}>VIP Portal</div>
                <div style={{ fontSize: 11, color: "#7E57C2",
                  whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>Customer-facing experience</div>
              </div>
            </Link>
          </div>

          <div style={{ height: 20 }} />
        </div>
      </div>
    </SheetAppShell>
  );
}

function KpiCard({ label, value, delta, tint, icon: Ico }: any) {
  const deltaCls = delta?.dir === "up" ? "delta delta-up" : delta?.dir === "down" ? "delta delta-down" : "delta";
  return (
    <div className="stat-card">
      <div className="flex items-center justify-between">
        <div className="label">{label}</div>
        <div style={{
          width: 26, height: 26, borderRadius: 7, background: tint + "1A",
          color: tint, display: "flex", alignItems: "center", justifyContent: "center",
        }}><Ico size={14} /></div>
      </div>
      <div className="value">{value}</div>
      {delta && (
        <div className={deltaCls} style={{ display: "inline-flex", alignItems: "center", gap: 3 }}>
          {delta.dir === "up" && <ArrowUpRight size={11} />}
          {delta.dir === "down" && <ArrowDownRight size={11} />}
          <span style={{ color: delta.dir === "up" ? "#1E7C36" : delta.dir === "down" ? "#B7200F" : "var(--text-3)" }}>
            {delta.text}
          </span>
        </div>
      )}
    </div>
  );
}

function RevenueChart({ data }: { data: { period: string; revenue: number; orders: number }[] }) {
  const max = Math.max(...data.map((d) => d.revenue));
  const niceTicks = [1, 0.5, 0]; // 100% / 50% / 0
  return (
    <div>
      <div style={{ display: "flex", height: 168 }}>
        {/* Y axis */}
        <div style={{ width: 56, position: "relative", marginRight: 4 }}>
          {niceTicks.map((t, i) => (
            <div key={i} style={{
              position: "absolute", right: 6, top: `calc(${(1 - t) * 100}% - 6px)`,
              fontSize: 10, color: "var(--text-3)", textAlign: "right",
              fontVariantNumeric: "tabular-nums",
            }}>{fmtCurrency(max * t)}</div>
          ))}
        </div>
        {/* Plot */}
        <div style={{ position: "relative", flex: 1 }}>
          {/* gridlines */}
          {niceTicks.map((t, i) => (
            <div key={i} style={{
              position: "absolute", left: 0, right: 0, top: `calc(${(1 - t) * 100}% - 1px)`,
              borderTop: "1px dashed var(--border-soft)",
            }} />
          ))}
          {/* bars */}
          <div style={{ display: "flex", alignItems: "flex-end", gap: 18, height: "100%", padding: "0 6px" }}>
            {data.map((p) => {
              const pct = p.revenue / max;
              const isMax = p.revenue === max;
              return (
                <div key={p.period} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 6, minWidth: 0 }}>
                  <div style={{
                    fontSize: 11, fontWeight: 700, color: isMax ? "#1E7C36" : "var(--text-1)",
                    fontVariantNumeric: "tabular-nums",
                  }}>{fmtCurrency(p.revenue)}</div>
                  <div style={{
                    width: "100%", maxWidth: 64,
                    height: `${Math.max(pct * 100, 6)}%`, minHeight: 18,
                    background: isMax
                      ? "linear-gradient(180deg, #34C759 0%, #5DD986 100%)"
                      : "linear-gradient(180deg, #007AFF 0%, #6EA9FF 100%)",
                    borderRadius: "7px 7px 3px 3px",
                    boxShadow: isMax ? "0 2px 4px rgba(52,199,89,.22)" : "0 2px 4px rgba(0,122,255,.18)",
                  }} />
                </div>
              );
            })}
          </div>
        </div>
      </div>
      <div style={{ display: "flex", marginTop: 6, paddingLeft: 60 }}>
        {data.map((p) => (
          <div key={p.period} style={{ flex: 1, textAlign: "center", fontSize: 11, color: "var(--text-3)" }}>
            <div style={{ fontWeight: 600, color: "var(--text-2)" }}>{p.period}</div>
            <div>{p.orders} orders</div>
          </div>
        ))}
      </div>
    </div>
  );
}
function Card({ title, subtitle, right, children }: any) {
  return (
    <div style={{
      background: "var(--surface)", border: "1px solid var(--border-hair)",
      borderRadius: 12, boxShadow: "var(--shadow-card)", overflow: "hidden",
    }}>
      <div className="flex items-center justify-between px-3 py-2" style={{ borderBottom: "1px solid var(--border-hair)" }}>
        <div>
          <div style={{ fontSize: 12, fontWeight: 600 }}>{title}</div>
          {subtitle && <div style={{ fontSize: 11, color: "var(--text-3)" }}>{subtitle}</div>}
        </div>
        {right}
      </div>
      {children}
    </div>
  );
}
function BlockRow({ icon: Ico, label, value, tint }: any) {
  return (
    <div className="list-row">
      <div style={{
        width: 24, height: 24, borderRadius: 6, background: tint + "22",
        color: tint, display: "flex", alignItems: "center", justifyContent: "center",
      }}><Ico size={13} /></div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 12, fontWeight: 600 }}>{label}</div>
      </div>
      <div style={{ fontSize: 12, color: "var(--text-2)" }}>{value}</div>
    </div>
  );
}

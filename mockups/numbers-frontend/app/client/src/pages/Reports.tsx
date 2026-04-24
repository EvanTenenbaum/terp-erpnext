import { useState } from "react";
import SheetAppShell from "@/components/numbers/SheetAppShell";
import SheetTabBar, { type TabDef } from "@/components/numbers/SheetTabBar";
import Toolbar from "@/components/numbers/Toolbar";
import { SHEETS } from "@/data/schema";
import {
  client_leaderboard, inventory_aging, revenue_trends, shrinkage, top_clients,
  sales_invoice, purchase_invoice,
} from "@/data/seed";
import { fmtCurrency, fmtNum, fmtPct, chipClassFor, shortStatus } from "@/lib/format";
import { TrendingUp, Package, Users, AlertTriangle, Banknote } from "lucide-react";

const tabs: TabDef[] = [
  { key: "leaderboard", label: "Client Leaderboard",  count: 10 },
  { key: "aging",       label: "Inventory Aging",     count: 8 },
  { key: "revenue",     label: "Revenue Trends",      count: 3 },
  { key: "shrinkage",   label: "Shrinkage",           count: 3 },
  { key: "top_clients", label: "Top Clients",         count: 5 },
  { key: "ar",          label: "AR Summary",          count: 8 },
  { key: "ap",          label: "AP Summary",          count: 5 },
];

export default function Reports() {
  const [active, setActive] = useState<string>("leaderboard");
  const [view, setView] = useState<"table"|"kanban"|"calendar"|"form"|"chart">("chart");
  const meta = SHEETS.find((s) => s.slug === "reports")!;

  return (
    <SheetAppShell sheet="reports" title="Reports" subtitle="Insight sheets · All data live from your ledgers">
      <SheetTabBar tabs={tabs} active={active} onSelect={setActive} accent={meta.tint} />
      <Toolbar
        view={view} onViewChange={setView as any}
        views={["chart", "table"]}
      />

      <div className="num-scroll" style={{ flex: 1, overflow: "auto", background: "var(--canvas)", padding: 16 }}>
        {active === "leaderboard" && <Leaderboard view={view} />}
        {active === "aging"       && <Aging view={view} />}
        {active === "revenue"     && <Revenue view={view} />}
        {active === "shrinkage"   && <Shrink view={view} />}
        {active === "top_clients" && <TopClients view={view} />}
        {active === "ar"          && <ARSummary view={view} />}
        {active === "ap"          && <APSummary view={view} />}
      </div>
    </SheetAppShell>
  );
}

function Card({ title, subtitle, right, children }: any) {
  return (
    <div style={{
      background: "var(--surface)", border: "1px solid var(--border-hair)",
      borderRadius: 12, boxShadow: "var(--shadow-card)", marginBottom: 14, overflow: "hidden",
    }}>
      <div className="flex items-center justify-between" style={{ padding: "10px 14px", borderBottom: "1px solid var(--border-hair)" }}>
        <div>
          <div style={{ fontSize: 13, fontWeight: 600, letterSpacing: "-0.005em" }}>{title}</div>
          {subtitle && <div style={{ fontSize: 11, color: "var(--text-3)", marginTop: 1 }}>{subtitle}</div>}
        </div>
        {right}
      </div>
      <div>{children}</div>
    </div>
  );
}

function StatRow({ items }: { items: { label: string; value: string; icon?: any; tint?: string }[] }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: `repeat(${items.length}, 1fr)`, gap: 10, marginBottom: 12 }}>
      {items.map((it) => (
        <div key={it.label} className="stat-card" style={{ padding: 12 }}>
          <div className="flex items-center justify-between">
            <div className="label" style={{ fontSize: 10 }}>{it.label}</div>
            {it.icon && (
              <div style={{
                width: 22, height: 22, borderRadius: 6,
                background: (it.tint ?? "#007AFF") + "1A", color: it.tint ?? "#007AFF",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}><it.icon size={12} /></div>
            )}
          </div>
          <div className="value" style={{ fontSize: 18, marginTop: 4 }}>{it.value}</div>
        </div>
      ))}
    </div>
  );
}

function Leaderboard(_: any) {
  const top = client_leaderboard;
  const maxScore = 100;
  const avg = top.reduce((a, c) => a + c.master_score, 0) / top.length;
  return (
    <>
    <StatRow items={[
      { label: "Clients ranked", value: fmtNum(top.length), icon: Users, tint: "#7E57C2" },
      { label: "Top score", value: top[0].master_score.toFixed(1), icon: TrendingUp, tint: "#34C759" },
      { label: "Average score", value: avg.toFixed(1), icon: TrendingUp, tint: "#007AFF" },
    ]} />
    <Card title="VIP Client Leaderboard" subtitle="Weighted: Financial 40 · Visit Frequency 20 · Payment Behavior 20 · Growth 10 · Referrals 10">
      <div style={{ padding: 12 }}>
        {top.map((c) => (
          <div key={c.rank} className="flex items-center gap-3" style={{ padding: "8px 10px", borderBottom: "1px solid var(--border-soft)" }}>
            <div style={{
              width: 28, height: 28, borderRadius: 6,
              background: c.rank <= 3 ? "linear-gradient(135deg, #FFD54F, #FFB300)" : "#EEEEF1",
              color: c.rank <= 3 ? "#5D4000" : "var(--text-2)",
              fontSize: 12, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center",
            }}>{c.rank}</div>
            <div style={{ flex: 1, minWidth: 180 }}>
              <div style={{ fontSize: 13, fontWeight: 600 }}>{c.customer}</div>
              <div style={{ fontSize: 11, color: "var(--text-3)" }}>
                Fin {c.financial} · Visits {c.engagement} · Pay {c.reliability} · Grw {c.growth}
              </div>
            </div>
            <div style={{ flex: 1, height: 6, background: "#EEEEF1", borderRadius: 999, overflow: "hidden" }}>
              <div style={{
                width: `${(c.master_score / maxScore) * 100}%`, height: "100%",
                background: "linear-gradient(90deg, #34C759 0%, #007AFF 100%)",
                borderRadius: 999,
              }} />
            </div>
            <div style={{ fontSize: 13, fontWeight: 600, minWidth: 60, textAlign: "right", fontVariantNumeric: "tabular-nums" }}>
              {c.master_score.toFixed(1)}
            </div>
          </div>
        ))}
      </div>
    </Card>
    </>
  );
}

function Aging(_: any) {
  const buckets = ["0-14d", "15-30d", "31-60d", "60+d"];
  const sums: Record<string, number> = {};
  buckets.forEach((b) => (sums[b] = 0));
  inventory_aging.forEach((r) => (sums[r.age_bucket] = (sums[r.age_bucket] ?? 0) + r.value));
  const max = Math.max(...Object.values(sums), 1);

  const totalValue = inventory_aging.reduce((a, r) => a + r.value, 0);
  const old = inventory_aging.filter((r) => r.age_bucket === "60+d").reduce((a, r) => a + r.value, 0);
  return (
    <>
      <StatRow items={[
        { label: "Total inventory value", value: fmtCurrency(totalValue), icon: Package, tint: "#00838F" },
        { label: "Aged 60+ days", value: fmtCurrency(old), icon: AlertTriangle, tint: "#FF3B30" },
        { label: "Batches tracked", value: fmtNum(inventory_aging.length), icon: Package, tint: "#34C759" },
      ]} />
      <Card title="Inventory Aging" subtitle="Value by age bucket">
        <div style={{ padding: 16 }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12 }}>
            {buckets.map((b) => {
              const val = sums[b] ?? 0;
              const pct = (val / max) * 100;
              return (
                <div key={b}>
                  <div style={{ fontSize: 11, color: "var(--text-3)", textTransform: "uppercase", letterSpacing: ".04em" }}>{b}</div>
                  <div style={{ fontSize: 18, fontWeight: 700, marginTop: 2 }}>{fmtCurrency(val)}</div>
                  <div style={{ height: 6, background: "#EEEEF1", borderRadius: 999, marginTop: 6, overflow: "hidden" }}>
                    <div style={{
                      height: "100%", width: pct + "%",
                      background: b === "60+d" ? "#FF3B30" : b === "31-60d" ? "#FF9500" : b === "15-30d" ? "#007AFF" : "#34C759",
                      borderRadius: 999,
                    }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </Card>
      <Card title="Batches · oldest first">
        <div style={{ padding: 8 }}>
          {inventory_aging.sort((a,b)=>b.age_days - a.age_days).map((r) => (
            <div key={r.batch} className="flex items-center gap-2" style={{ padding: "6px 8px", borderBottom: "1px solid var(--border-soft)" }}>
              <div style={{ flex: 1 }}><div style={{ fontSize: 12, fontWeight: 600 }}>{r.batch}</div><div style={{ fontSize: 11, color: "var(--text-3)" }}>{r.item} · {r.warehouse}</div></div>
              <span className={chipClassFor(r.age_bucket)}>{r.age_bucket}</span>
              <div style={{ fontSize: 12, fontWeight: 600, width: 90, textAlign: "right" }}>{fmtNum(r.qty)}</div>
              <div style={{ fontSize: 12, width: 100, textAlign: "right", fontVariantNumeric: "tabular-nums" }}>{fmtCurrency(r.value)}</div>
            </div>
          ))}
        </div>
      </Card>
    </>
  );
}

function Revenue(_: any) {
  const max = Math.max(...revenue_trends.map((r) => r.revenue));
  const total = revenue_trends.reduce((a, p) => a + p.revenue, 0);
  const totalOrders = revenue_trends.reduce((a, p) => a + p.orders, 0);
  return (
    <>
    <StatRow items={[
      { label: "Revenue · last 3 mo", value: fmtCurrency(total), icon: TrendingUp, tint: "#007AFF" },
      { label: "Orders · last 3 mo", value: fmtNum(totalOrders), icon: Banknote, tint: "#34C759" },
      { label: "Average month", value: fmtCurrency(total / revenue_trends.length), icon: TrendingUp, tint: "#FF9500" },
    ]} />
    <Card title="Revenue Trends" subtitle="Monthly — last 3 months">
      <div style={{ padding: 20, display: "flex", alignItems: "flex-end", gap: 24, height: 280 }}>
        {revenue_trends.map((p) => (
          <div key={p.period} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
            <div style={{ fontSize: 14, fontWeight: 700 }}>{fmtCurrency(p.revenue)}</div>
            <div style={{
              width: "70%", height: `${(p.revenue / max) * 220}px`, minHeight: 40,
              background: "linear-gradient(180deg, #34C759 0%, #007AFF 100%)",
              borderRadius: "10px 10px 2px 2px",
              boxShadow: "0 6px 16px rgba(0,122,255,.2)",
            }} />
            <div style={{ fontSize: 12, color: "var(--text-2)", fontWeight: 500 }}>{p.period}</div>
            <div style={{ fontSize: 11, color: "var(--text-3)" }}>{p.orders} orders</div>
          </div>
        ))}
      </div>
    </Card>
    </>
  );
}

function Shrink(_: any) {
  return (
    <Card title="Shrinkage · by Batch">
      <div style={{ padding: 8 }}>
        {shrinkage.map((r) => (
          <div key={r.batch} className="flex items-center gap-2" style={{ padding: "6px 8px", borderBottom: "1px solid var(--border-soft)" }}>
            <div style={{ flex: 1 }}><div style={{ fontSize: 12, fontWeight: 600 }}>{r.batch}</div><div style={{ fontSize: 11, color: "var(--text-3)" }}>{r.item}</div></div>
            <div style={{ fontSize: 12, width: 100, textAlign: "right" }}>Expected {fmtNum(r.expected)}</div>
            <div style={{ fontSize: 12, width: 90, textAlign: "right" }}>Actual {fmtNum(r.actual)}</div>
            <div style={{ width: 70, textAlign: "right" }}>
              <span className={chipClassFor(r.shrinkage > 0.15 ? "warning" : "allowed")}>{fmtPct(r.shrinkage)}</span>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

function TopClients(_: any) {
  const max = Math.max(...top_clients.map((c) => c.revenue));
  return (
    <Card title="Top Clients · Last 30 days">
      <div style={{ padding: 12 }}>
        {top_clients.map((c) => (
          <div key={c.rank} className="flex items-center gap-3" style={{ padding: "8px 8px", borderBottom: "1px solid var(--border-soft)" }}>
            <div style={{
              width: 26, height: 26, borderRadius: 6, background: "#EEEEF1", color: "var(--text-2)",
              display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700,
            }}>{c.rank}</div>
            <div style={{ minWidth: 180, flex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 600 }}>{c.customer}</div>
              <div style={{ fontSize: 11, color: "var(--text-3)" }}>{c.orders} orders · AOV {fmtCurrency(c.aov)}</div>
            </div>
            <div style={{ flex: 2, height: 10, background: "#EEEEF1", borderRadius: 999, overflow: "hidden" }}>
              <div style={{
                width: `${(c.revenue / max) * 100}%`, height: "100%",
                background: "linear-gradient(90deg, #007AFF 0%, #34C759 100%)", borderRadius: 999,
              }} />
            </div>
            <div style={{ fontSize: 13, fontWeight: 600, minWidth: 90, textAlign: "right", fontVariantNumeric: "tabular-nums" }}>
              {fmtCurrency(c.revenue)}
            </div>
            <span className={chipClassFor(c.growth > 0.1 ? "up" : "flat")} style={{ width: 60, justifyContent: "center" }}>
              {fmtPct(c.growth)}
            </span>
          </div>
        ))}
      </div>
    </Card>
  );
}

function ARSummary(_: any) {
  const outstanding = sales_invoice.filter((i) => i.outstanding_amount > 0);
  const overdue = outstanding.filter((i) => i.status === "Overdue");
  const total = outstanding.reduce((a, b) => a + b.outstanding_amount, 0);
  return (
    <Card title="Accounts Receivable" subtitle={`${outstanding.length} open · ${fmtCurrency(total)} outstanding · ${overdue.length} overdue`}>
      <div style={{ padding: 8 }}>
        {outstanding.map((i) => (
          <div key={i.name} className="flex items-center gap-2" style={{ padding: "6px 8px", borderBottom: "1px solid var(--border-soft)" }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 12, fontWeight: 600 }}>{i.name}</div>
              <div style={{ fontSize: 11, color: "var(--text-3)" }}>{i.customer}</div>
            </div>
            <span className={chipClassFor(i.status)}>{shortStatus(i.status)}</span>
            <div style={{ fontSize: 12, width: 120, textAlign: "right", fontVariantNumeric: "tabular-nums" }}>{fmtCurrency(i.outstanding_amount)}</div>
          </div>
        ))}
      </div>
    </Card>
  );
}
function APSummary(_: any) {
  const open = purchase_invoice.filter((i) => i.outstanding_amount > 0);
  const total = open.reduce((a, b) => a + b.outstanding_amount, 0);
  return (
    <Card title="Accounts Payable" subtitle={`${open.length} open · ${fmtCurrency(total)} outstanding`}>
      <div style={{ padding: 8 }}>
        {open.map((i) => (
          <div key={i.name} className="flex items-center gap-2" style={{ padding: "6px 8px", borderBottom: "1px solid var(--border-soft)" }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 12, fontWeight: 600 }}>{i.name}</div>
              <div style={{ fontSize: 11, color: "var(--text-3)" }}>{i.supplier}</div>
            </div>
            <span className={chipClassFor(i.status)}>{shortStatus(i.status)}</span>
            <div style={{ fontSize: 12, width: 120, textAlign: "right", fontVariantNumeric: "tabular-nums" }}>{fmtCurrency(i.outstanding_amount)}</div>
          </div>
        ))}
      </div>
    </Card>
  );
}

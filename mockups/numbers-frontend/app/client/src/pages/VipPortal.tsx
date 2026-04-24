import SheetAppShell from "@/components/numbers/SheetAppShell";
import SheetTabBar, { type TabDef } from "@/components/numbers/SheetTabBar";
import {
  vip_portal_configuration, client_leaderboard, appointment_request,
  sales_catalogue, live_shopping_session, referral_credit, client_need,
  sales_invoice,
} from "@/data/seed";
import { fmtCurrency, fmtDate, fmtDateTime, chipClassFor, shortStatus } from "@/lib/format";
import { useState } from "react";
import { Crown, Sparkles, Calendar as CalendarIco, Video, UserPlus } from "lucide-react";

const tabs: TabDef[] = [
  { key: "overview",   label: "Overview" },
  { key: "catalogues", label: "Catalogues" },
  { key: "live",       label: "Live Shopping" },
  { key: "leaderboard", label: "Leaderboard" },
  { key: "appointments", label: "Appointments" },
  { key: "referrals",  label: "Referrals" },
  { key: "invoices",   label: "My Invoices" },
  { key: "needs",      label: "My Requests" },
];

export default function VipPortal() {
  const [active, setActive] = useState("overview");
  const customer = "Green Lotus Wellness";
  const cfg = vip_portal_configuration.find((v) => v.customer === customer)!;
  const rank = client_leaderboard.find((l) => l.customer === customer);

  return (
    <SheetAppShell
      sheet="vip"
      title={"VIP Portal · " + customer}
      subtitle="Customer-facing experience — what Green Lotus sees when they sign in"
    >
      <div style={{
        position: "relative", overflow: "hidden",
        background: "linear-gradient(135deg, #EDE7F6 0%, #D1C4E9 60%, #B39DDB 100%)",
        padding: "20px 24px", borderBottom: "1px solid var(--border-hair)",
      }}>
        {/* Decorative glow */}
        <div style={{
          position: "absolute", right: -60, top: -60, width: 220, height: 220, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(255,255,255,.55) 0%, rgba(255,255,255,0) 70%)",
          pointerEvents: "none",
        }} />
        <div style={{ display: "flex", alignItems: "center", gap: 18, position: "relative" }}>
          <div style={{
            width: 56, height: 56, borderRadius: 14,
            background: "linear-gradient(135deg, #9575CD, #5E35B1)",
            color: "#fff", display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: "0 8px 24px rgba(81, 45, 168, .3)",
          }}><Crown size={28} /></div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 11, color: "#512DA8", textTransform: "uppercase", letterSpacing: ".06em", fontWeight: 600 }}>
              VIP Tier · Rank #{rank?.rank ?? "—"}
            </div>
            <div style={{ fontSize: 24, fontWeight: 700, color: "#311B92", letterSpacing: "-0.02em" }}>
              Welcome back, {customer}
            </div>
            <div style={{ fontSize: 12, color: "#4527A0", marginTop: 2 }}>
              Master score {rank?.master_score.toFixed(1)} — unlock Tier 2 perks at 95.0
            </div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 11, color: "#512DA8" }}>Referral credit available</div>
            <div style={{ fontSize: 20, fontWeight: 700, color: "#311B92" }}>{fmtCurrency(250)}</div>
          </div>
        </div>
      </div>

      <SheetTabBar tabs={tabs} active={active} onSelect={setActive} accent="var(--sheet-vip)" />

      <div className="num-scroll" style={{ flex: 1, overflow: "auto", padding: 20, background: "var(--canvas)" }}>
        {active === "overview" && <Overview />}
        {active === "catalogues" && <CatalogueList />}
        {active === "live" && <LiveList />}
        {active === "leaderboard" && <LeaderBoard />}
        {active === "appointments" && <Appointments />}
        {active === "referrals" && <Referrals />}
        {active === "invoices" && <Invoices />}
        {active === "needs" && <Needs />}
      </div>
    </SheetAppShell>
  );
}

function Card({ title, right, children }: any) {
  return (
    <div style={{
      background: "var(--surface)", border: "1px solid var(--border-hair)",
      borderRadius: 12, boxShadow: "var(--shadow-card)", overflow: "hidden", marginBottom: 12,
    }}>
      <div className="flex items-center justify-between px-3 py-2" style={{ borderBottom: "1px solid var(--border-hair)" }}>
        <div style={{ fontSize: 12, fontWeight: 600 }}>{title}</div>
        {right}
      </div>
      {children}
    </div>
  );
}

function Overview() {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 12 }}>
      <div>
        <Card title="Featured catalogues">
          <div style={{ padding: 12, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            {sales_catalogue.filter((c) => c.status === "Published").map((c) => (
              <div key={c.name} style={{
                background: "linear-gradient(135deg, #F3E5F5 0%, #E1BEE7 100%)",
                border: "1px solid #CE93D822", borderRadius: 10, padding: 14,
              }}>
                <div style={{ fontSize: 11, color: "#6A1B9A", textTransform: "uppercase", letterSpacing: ".06em" }}>Catalogue</div>
                <div style={{ fontSize: 15, fontWeight: 700, color: "#311B92", marginTop: 2 }}>{c.catalogue_name}</div>
                <div style={{ fontSize: 11, color: "#4527A0", marginTop: 4 }}>{c.items_count} items · token {c.share_token || "—"}</div>
                <button className="ghost-btn" style={{ marginTop: 10 }}>Open catalogue</button>
              </div>
            ))}
          </div>
        </Card>
        <Card title="Live shopping">
          <div style={{ padding: 12 }}>
            {live_shopping_session.map((s) => (
              <div key={s.name} className="list-row">
                <Video size={14} color="#AD1457" />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 12, fontWeight: 600 }}>{s.session_title}</div>
                  <div style={{ fontSize: 11, color: "var(--text-3)" }}>{fmtDateTime(s.start_time)}</div>
                </div>
                <span className={chipClassFor(s.status)}>{shortStatus(s.status)}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
      <div>
        <Card title="Your score">
          <div style={{ padding: 16 }}>
            <div style={{ fontSize: 44, fontWeight: 700, color: "#311B92", lineHeight: 1 }}>94.1</div>
            <div style={{ fontSize: 11, color: "var(--text-3)" }}>Rank #1 of 10 · up 2 ranks</div>
            <div style={{ marginTop: 12 }}>
              {["Financial 96","Visits 92","Pay 98","Growth 88","Referrals 95"].map((l) => (
                <div key={l} className="flex items-center gap-2" style={{ padding: "6px 0" }}>
                  <span style={{ fontSize: 11, color: "var(--text-2)", width: 90 }}>{l.split(" ")[0]}</span>
                  <div style={{ flex: 1, height: 6, background: "#EEEEF1", borderRadius: 999 }}>
                    <div style={{ width: l.split(" ")[1] + "%", height: "100%",
                      background: "linear-gradient(90deg, #5E35B1, #9575CD)", borderRadius: 999 }} />
                  </div>
                  <span style={{ fontSize: 11, color: "var(--text-2)", width: 24, textAlign: "right" }}>{l.split(" ")[1]}</span>
                </div>
              ))}
            </div>
          </div>
        </Card>
        <Card title="Invite a colleague">
          <div style={{ padding: 12 }}>
            <div style={{ fontSize: 12, color: "var(--text-2)" }}>Earn $250 credit when they place their first order.</div>
            <div className="flex gap-2 mt-2">
              <div style={{
                flex: 1, padding: "8px 10px", background: "#F2F2F4", borderRadius: 8,
                fontSize: 11, fontFamily: "ui-monospace",
              }}>terp.io/r/greenlotus-9A3X</div>
              <button className="ghost-btn">Copy</button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

function CatalogueList() {
  return (
    <Card title="All catalogues shared with you">
      <div style={{ padding: 8 }}>
        {sales_catalogue.map((c) => (
          <div key={c.name} className="list-row">
            <Sparkles size={14} color="#6A1B9A" />
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 12, fontWeight: 600 }}>{c.catalogue_name}</div>
              <div style={{ fontSize: 11, color: "var(--text-3)" }}>
                {c.customer ?? "Public"} · {c.items_count} items · expires {fmtDateTime(c.token_expires_at)}
              </div>
            </div>
            <span className={chipClassFor(c.status)}>{shortStatus(c.status)}</span>
          </div>
        ))}
      </div>
    </Card>
  );
}
function LiveList() {
  return (
    <Card title="Live shopping schedule">
      <div style={{ padding: 8 }}>
        {live_shopping_session.map((s) => (
          <div key={s.name} className="list-row">
            <Video size={14} color="#AD1457" />
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 12, fontWeight: 600 }}>{s.session_title}</div>
              <div style={{ fontSize: 11, color: "var(--text-3)" }}>{fmtDateTime(s.start_time)} · Room {s.room_code}</div>
            </div>
            <span className={chipClassFor(s.status)}>{shortStatus(s.status)}</span>
            {s.status === "Active" && <button className="ghost-btn">Join</button>}
          </div>
        ))}
      </div>
    </Card>
  );
}
function LeaderBoard() {
  return (
    <Card title="VIP leaderboard">
      <div style={{ padding: 8 }}>
        {client_leaderboard.map((c) => (
          <div key={c.rank} className="list-row">
            <div style={{
              width: 26, height: 26, borderRadius: 6,
              background: c.rank <= 3 ? "linear-gradient(135deg, #FFD54F, #FFB300)" : "#EEEEF1",
              color: c.rank <= 3 ? "#5D4000" : "var(--text-2)", fontWeight: 700, fontSize: 12,
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>{c.rank}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 12, fontWeight: 600 }}>{c.customer}</div>
            </div>
            <div style={{ fontSize: 12, fontWeight: 600, fontVariantNumeric: "tabular-nums" }}>{c.master_score.toFixed(1)}</div>
          </div>
        ))}
      </div>
    </Card>
  );
}
function Appointments() {
  return (
    <Card title="Your appointments">
      <div style={{ padding: 8 }}>
        {appointment_request.map((a) => (
          <div key={a.name} className="list-row">
            <CalendarIco size={14} color="#455A64" />
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 12, fontWeight: 600 }}>{a.appointment_type}</div>
              <div style={{ fontSize: 11, color: "var(--text-3)" }}>{fmtDate(a.requested_date)} at {a.requested_time}</div>
            </div>
            <span className={chipClassFor(a.status)}>{shortStatus(a.status)}</span>
          </div>
        ))}
      </div>
    </Card>
  );
}
function Referrals() {
  return (
    <Card title="Referral credits">
      <div style={{ padding: 8 }}>
        {referral_credit.map((r) => (
          <div key={r.name} className="list-row">
            <UserPlus size={14} color="#00838F" />
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 12, fontWeight: 600 }}>{r.referred_customer}</div>
              <div style={{ fontSize: 11, color: "var(--text-3)" }}>Referred by {r.referrer_customer}</div>
            </div>
            <span className={chipClassFor(r.status)}>{shortStatus(r.status)}</span>
            <div style={{ fontSize: 12, fontWeight: 600, width: 80, textAlign: "right" }}>{fmtCurrency(r.credit_amount)}</div>
          </div>
        ))}
      </div>
    </Card>
  );
}
function Invoices() {
  const mine = sales_invoice.filter((i) => i.customer === "Green Lotus Wellness");
  return (
    <Card title="My invoices">
      <div style={{ padding: 8 }}>
        {mine.map((i) => (
          <div key={i.name} className="list-row">
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 12, fontWeight: 600 }}>{i.name}</div>
              <div style={{ fontSize: 11, color: "var(--text-3)" }}>Due {fmtDate(i.due_date)}</div>
            </div>
            <span className={chipClassFor(i.status)}>{shortStatus(i.status)}</span>
            <div style={{ fontSize: 12, fontWeight: 600, width: 110, textAlign: "right" }}>{fmtCurrency(i.outstanding_amount)}</div>
            {i.outstanding_amount > 0 && <button className="ghost-btn">Pay</button>}
          </div>
        ))}
      </div>
    </Card>
  );
}
function Needs() {
  return (
    <Card title="My open requests">
      <div style={{ padding: 8 }}>
        {client_need.filter(n => n.customer === "Atlas Dispensary").concat(client_need.filter(n => n.customer === "Sunrise Collective")).slice(0, 4).map((n) => (
          <div key={n.name} className="list-row">
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 12, fontWeight: 600 }}>{n.strain} · {n.product_type}</div>
              <div style={{ fontSize: 11, color: "var(--text-3)" }}>{n.quantity_needed}{n.unit} · max {fmtCurrency(n.max_price ?? 0)}/{n.unit} · due {fmtDate(n.expiry_date)}</div>
            </div>
            <span className={chipClassFor(n.urgency)}>{shortStatus(n.urgency)}</span>
            <span className={chipClassFor(n.status)}>{shortStatus(n.status)}</span>
          </div>
        ))}
      </div>
    </Card>
  );
}

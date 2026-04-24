import { useRoute } from "wouter";
import { sales_catalogue, batch, item } from "@/data/seed";
import { fmtCurrency, fmtDate, chipClassFor, shortStatus } from "@/lib/format";
import { Sparkles, Mail, Share2, ShoppingCart, Check, Lock } from "lucide-react";
import { useState } from "react";

export default function SharedSheet() {
  const [, params] = useRoute<{ token: string }>("/s/:token");
  const token = params?.token ?? "ATL-APR22-ZM4L";
  const cat = sales_catalogue.find((c) => c.share_token === token) ?? sales_catalogue[0];
  const items = batch.slice(0, cat.items_count).slice(0, 12).map((b) => {
    const i = item.find((x) => x.name === b.item)!;
    return { ...b, itemLabel: i?.item_name ?? b.item, grade: i?.product_grade };
  });
  const [cart, setCart] = useState<Record<string, number>>({});
  const total = Object.entries(cart).reduce((a, [k, q]) => {
    const row = items.find((x) => x.name === k);
    return a + (row?.unit_cost ?? 0) * 1.35 * q;
  }, 0);

  return (
    <div style={{ minHeight: "100vh", background: "var(--canvas)" }}>
      {/* Brand strip */}
      <div style={{ height: 4, background: "linear-gradient(90deg, #34C759, #007AFF)" }} />

      {/* Hero header */}
      <header style={{
        background: "var(--surface)", borderBottom: "1px solid var(--border-hair)",
        padding: "18px 28px",
      }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{
            width: 40, height: 40, borderRadius: 10,
            background: "linear-gradient(135deg, #34C759, #007AFF)",
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: "0 8px 24px rgba(0,122,255,.18)",
          }}><Sparkles size={18} color="#fff" /></div>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: 11, color: "var(--text-3)", letterSpacing: ".06em",
              textTransform: "uppercase", fontWeight: 600 }}>TERP · Catalogue</div>
            <div style={{ fontSize: 20, fontWeight: 700, letterSpacing: "-0.015em", marginTop: 1 }}>
              {cat.catalogue_name}
            </div>
            <div style={{ fontSize: 11, color: "var(--text-3)", marginTop: 3, display: "inline-flex", alignItems: "center", gap: 6 }}>
              <Lock size={11} /> Private · Token <code style={{ background: "#F2F2F4", padding: "1px 5px", borderRadius: 4, fontSize: 10 }}>{cat.share_token}</code>
              · expires {fmtDate(cat.token_expires_at?.slice(0,10))}
            </div>
          </div>
          <div style={{ flex: 1 }} />
          <span className={chipClassFor(cat.status)}>{shortStatus(cat.status)}</span>
        </div>
      </header>

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: 24, display: "grid", gridTemplateColumns: "1fr 300px", gap: 16 }}>
        {/* Table */}
        <div style={{ background: "var(--surface)", border: "1px solid var(--border-hair)", borderRadius: 12,
          boxShadow: "var(--shadow-card)", overflow: "hidden" }}>
          <table className="num-table">
            <thead><tr>
              <th className="gutter"></th>
              <th><div className="cell">Batch</div></th>
              <th><div className="cell">Item</div></th>
              <th><div className="cell">Grade</div></th>
              <th><div className="cell" style={{ justifyContent: "flex-end" }}>Qty avail.</div></th>
              <th><div className="cell" style={{ justifyContent: "flex-end" }}>Price</div></th>
              <th><div className="cell">Add</div></th>
            </tr></thead>
            <tbody>
              {items.map((r, i) => {
                const price = (r.unit_cost ?? 0) * 1.35;
                const qty = cart[r.name] ?? 0;
                return (
                  <tr key={r.name}>
                    <td className="gutter">{i + 1}</td>
                    <td><div className="cell">{r.name}</div></td>
                    <td><div className="cell">{r.itemLabel}</div></td>
                    <td><div className="cell"><span className="chip">{r.grade}</span></div></td>
                    <td><div className="cell" style={{ justifyContent: "flex-end", fontVariantNumeric: "tabular-nums" }}>{r.qty}</div></td>
                    <td><div className="cell" style={{ justifyContent: "flex-end", fontVariantNumeric: "tabular-nums", fontWeight: 600 }}>{fmtCurrency(price)}</div></td>
                    <td>
                      <div className="cell">
                        <button
                          className="ghost-btn"
                          onClick={() => setCart((c) => ({ ...c, [r.name]: (c[r.name] ?? 0) + 1 }))}
                        ><ShoppingCart size={11} style={{ display: "inline", marginRight: 4 }} /> Add{qty ? ` (${qty})` : ""}</button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Cart / Request */}
        <div style={{ background: "var(--surface)", border: "1px solid var(--border-hair)", borderRadius: 12,
          boxShadow: "var(--shadow-card)", padding: 16, height: "fit-content", position: "sticky", top: 16 }}>
          <div style={{ fontSize: 11, color: "var(--text-3)", textTransform: "uppercase", letterSpacing: ".06em" }}>Your order</div>
          <div style={{ fontSize: 20, fontWeight: 700, marginTop: 4, fontVariantNumeric: "tabular-nums" }}>{fmtCurrency(total)}</div>
          <div style={{ fontSize: 11, color: "var(--text-3)" }}>{Object.values(cart).reduce((a,b)=>a+b,0)} lines</div>

          {Object.keys(cart).length === 0 ? (
            <div style={{
              marginTop: 14, padding: "14px 12px", borderRadius: 10,
              background: "#F8F9FB", border: "1px dashed var(--border-soft)",
              fontSize: 12, color: "var(--text-3)", textAlign: "center",
            }}>
              <ShoppingCart size={18} style={{ display: "block", margin: "0 auto 6px", color: "var(--text-3)" }} />
              Your cart is empty.
              <div style={{ fontSize: 11, marginTop: 4 }}>Tap <b>Add</b> on any row to start an order.</div>
            </div>
          ) : (
            <div style={{ marginTop: 12, borderTop: "1px solid var(--border-soft)" }}>
              {Object.entries(cart).map(([k, q]) => {
                const row = items.find((x) => x.name === k)!;
                return (
                  <div key={k} className="list-row" style={{ padding: "8px 0" }}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 12, fontWeight: 600 }}>{row.itemLabel}</div>
                      <div style={{ fontSize: 11, color: "var(--text-3)" }}>{q} × {fmtCurrency((row.unit_cost ?? 0) * 1.35)}</div>
                    </div>
                    <button onClick={() => setCart((c) => { const n = { ...c }; delete n[k]; return n; })}
                      style={{ fontSize: 11, color: "var(--danger)" }}>Remove</button>
                  </div>
                );
              })}
            </div>
          )}

          <button style={{
            marginTop: 16, width: "100%", height: 36, background: "var(--accent-blue)", color: "#fff",
            borderRadius: 8, fontSize: 13, fontWeight: 600,
          }}><Check size={13} style={{ display: "inline", marginRight: 6 }} /> Submit request</button>

          <div style={{ marginTop: 12, fontSize: 11, color: "var(--text-3)" }}>
            Your rep will confirm pricing, availability, and delivery once submitted.
          </div>

          <div style={{ marginTop: 16, paddingTop: 12, borderTop: "1px solid var(--border-soft)" }}>
            <div className="flex items-center gap-2" style={{ fontSize: 11, color: "var(--text-3)" }}>
              <Mail size={11} /> rep@terp.io
              <Share2 size={11} style={{ marginLeft: 8 }} /> share link
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

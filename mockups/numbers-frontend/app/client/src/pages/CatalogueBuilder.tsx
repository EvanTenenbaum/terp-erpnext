import { useRoute } from "wouter";
import SheetAppShell from "@/components/numbers/SheetAppShell";
import { sales_catalogue, batch, pricing_profile } from "@/data/seed";
import { fmtCurrency, fmtDateTime, chipClassFor, shortStatus } from "@/lib/format";
import { useMemo, useState } from "react";
import { Search, Share2, Copy, Check, Plus, Trash2, Package, Eye } from "lucide-react";
import { toast } from "sonner";

export default function CatalogueBuilder() {
  const [, params] = useRoute<{ id: string }>("/catalogues/:id");
  const id = params?.id ?? "CAT-0101";
  const cat = sales_catalogue.find((c) => c.name === id) ?? sales_catalogue[0];

  const [included, setIncluded] = useState<string[]>(batch.slice(0, 8).map((b) => b.name));
  const [q, setQ] = useState("");
  const available = useMemo(() => batch.filter((b) =>
    !included.includes(b.name) && (b.name.toLowerCase().includes(q.toLowerCase()) || b.item.toLowerCase().includes(q.toLowerCase()))
  ), [included, q]);

  const rowsIn = included.map((n) => batch.find((b) => b.name === n)!).filter(Boolean);

  return (
    <SheetAppShell
      sheet="sales"
      title={"Catalogue · " + cat.catalogue_name}
      subtitle={`${cat.name} · ${cat.customer ?? "Public"}`}
    >
      <div style={{
        background: "var(--sheet-sales)", padding: "10px 16px",
        borderBottom: "1px solid var(--border-hair)",
        display: "flex", gap: 10, alignItems: "center",
      }}>
        <div style={{ flex: 1, display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 6,
            padding: "3px 8px", borderRadius: 999,
            background: "#fff", border: "1px solid var(--sheet-sales-ink)22",
            fontSize: 11, fontWeight: 600, color: "var(--sheet-sales-ink)",
          }}>
            <Package size={11} /> {rowsIn.length} items
          </div>
          <span className={chipClassFor(cat.status)}>{shortStatus(cat.status)}</span>
        </div>
        <button className="ghost-btn"><Eye size={11} style={{ display: "inline", marginRight: 4 }} /> Preview shared view</button>
        <button className="ghost-btn"><Share2 size={11} style={{ display: "inline", marginRight: 4 }} /> Share link</button>
        <button style={{
          height: 28, padding: "0 14px", background: "var(--accent-blue)", color: "#fff",
          borderRadius: 8, fontSize: 12, fontWeight: 600,
          boxShadow: "0 1px 2px rgba(0,122,255,.25)",
        }} onClick={() => toast.success("Catalogue published — demo only")}>
          <Check size={12} style={{ display: "inline", marginRight: 4 }} /> Publish
        </button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "260px 1fr 320px", flex: 1, minHeight: 0 }}>
        {/* Inventory picker */}
        <div style={{ borderRight: "1px solid var(--border-hair)", background: "var(--surface)", display: "flex", flexDirection: "column", minWidth: 0 }}>
          <div className="flex items-center gap-2" style={{ padding: 10, borderBottom: "1px solid var(--border-hair)" }}>
            <Search size={12} color="var(--text-3)" />
            <input placeholder="Search inventory" value={q} onChange={(e) => setQ(e.target.value)}
              style={{ flex: 1, outline: "none", border: 0, background: "transparent", fontSize: 12 }} />
          </div>
          <div className="num-scroll" style={{ overflow: "auto", flex: 1 }}>
            {available.map((b) => (
              <div key={b.name} className="list-row" style={{ padding: "8px 10px" }}>
                <Package size={12} color="var(--text-3)" />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 12, fontWeight: 600, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{b.item}</div>
                  <div style={{ fontSize: 11, color: "var(--text-3)" }}>{b.name} · {b.qty}g</div>
                </div>
                <button onClick={() => setIncluded((x) => [...x, b.name])}
                  className="ghost-btn" style={{ padding: "0 8px" }}>
                  <Plus size={11} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Catalogue canvas — sheet table of included items */}
        <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column" }} className="num-scroll">
          <div style={{ padding: "10px 16px", borderBottom: "1px solid var(--border-hair)", background: "var(--surface)" }}>
            <div style={{ fontSize: 11, color: "var(--text-3)", textTransform: "uppercase", letterSpacing: ".06em" }}>Catalogue items</div>
            <div style={{ fontSize: 13, color: "var(--text-1)", marginTop: 2 }}>Drag rows or click <Trash2 size={11} style={{ display: "inline", verticalAlign: "middle" }} /> to remove</div>
          </div>
          <div style={{ flex: 1, overflow: "auto" }}>
            <table className="num-table">
              <colgroup>
                <col style={{ width: 36 }} />
                <col style={{ width: 180 }} />
                <col style={{ width: 200 }} />
                <col style={{ width: 100 }} />
                <col style={{ width: 90 }} />
                <col style={{ width: 110 }} />
                <col style={{ width: 50 }} />
              </colgroup>
              <thead><tr>
                <th className="gutter"></th>
                <th><div className="cell">Batch</div></th>
                <th><div className="cell">Item</div></th>
                <th><div className="cell">Supplier</div></th>
                <th><div className="cell" style={{ justifyContent: "flex-end" }}>Qty</div></th>
                <th><div className="cell" style={{ justifyContent: "flex-end" }}>List price</div></th>
                <th></th>
              </tr></thead>
              <tbody>
                {rowsIn.map((b, i) => (
                  <tr key={b.name}>
                    <td className="gutter">{i + 1}</td>
                    <td><div className="cell">{b.name}</div></td>
                    <td><div className="cell">{b.item}</div></td>
                    <td><div className="cell">{b.supplier}</div></td>
                    <td><div className="cell" style={{ justifyContent: "flex-end", fontVariantNumeric: "tabular-nums" }}>{b.qty}</div></td>
                    <td><div className="cell" style={{ justifyContent: "flex-end", fontWeight: 600 }}>{fmtCurrency((b.unit_cost ?? 0) * 1.35)}</div></td>
                    <td>
                      <div className="cell">
                        <button onClick={() => setIncluded((x) => x.filter((n) => n !== b.name))} style={{ color: "var(--text-3)" }}>
                          <Trash2 size={12} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {rowsIn.length === 0 && (
                  <tr><td colSpan={7} style={{ padding: 40, textAlign: "center", color: "var(--text-3)", fontSize: 12 }}>No items yet — add from the left panel.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Config inspector */}
        <aside style={{ borderLeft: "1px solid var(--border-hair)", background: "var(--surface)", padding: 16, minWidth: 0, overflow: "auto" }}
          className="num-scroll">
          <div style={{ fontSize: 11, color: "var(--text-3)", textTransform: "uppercase", letterSpacing: ".06em", marginBottom: 8 }}>Catalogue</div>

          <Field label="Catalogue name" value={cat.catalogue_name} />
          <Field label="Audience" value={cat.customer ?? "Public"} />
          <Field label="Status" value={<span className={chipClassFor(cat.status)}>{shortStatus(cat.status)}</span>} />
          <Field label="Pricing profile" value={
            <select style={input()}>
              {pricing_profile.map((p) => <option key={p.profile_name}>{p.profile_name}</option>)}
            </select>
          } />

          <div style={{ fontSize: 11, color: "var(--text-3)", textTransform: "uppercase", letterSpacing: ".06em", marginTop: 14, marginBottom: 8 }}>Sharing</div>
          <Field label="Share token" value={
            <div className="flex items-center gap-2">
              <code style={{ padding: "4px 6px", background: "#F2F2F4", borderRadius: 6, fontSize: 11 }}>{cat.share_token || "—"}</code>
              <button className="ghost-btn" onClick={() => { toast.success("Link copied"); }}><Copy size={11} /></button>
            </div>
          } />
          <Field label="Expires" value={fmtDateTime(cat.token_expires_at)} />
          <Field label="Audience mode" value={
            <select style={input()}>
              <option>Any audience</option>
              <option>Signed-in customers only</option>
              <option>Internal reps only</option>
            </select>
          } />
          <Field label="Allow add-to-cart" value={
            <input type="checkbox" defaultChecked />
          } />
        </aside>
      </div>
    </SheetAppShell>
  );
}

function Field({ label, value }: any) {
  return (
    <div style={{ marginBottom: 10 }}>
      <div style={{ fontSize: 11, color: "var(--text-3)", marginBottom: 4 }}>{label}</div>
      <div style={{ fontSize: 12 }}>{value}</div>
    </div>
  );
}
function input() {
  return {
    width: "100%", padding: "4px 8px", borderRadius: 6,
    border: "1px solid var(--border-hair)", background: "var(--surface)",
    fontSize: 12,
  } as React.CSSProperties;
}

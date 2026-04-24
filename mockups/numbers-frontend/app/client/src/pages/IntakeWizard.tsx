import SheetAppShell from "@/components/numbers/SheetAppShell";
import { supplier, item, warehouse } from "@/data/seed";
import { Check, Package, Camera, Warehouse, User, ClipboardList, ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { fmtCurrency } from "@/lib/format";

interface BatchDraft {
  id: string;
  item: string;
  qty: number;
  unit_cost: number;
  lot_number: string;
  expiry: string;
  photography: boolean;
  warehouse: string;
}

export default function IntakeWizard() {
  const [step, setStep] = useState(0);
  const [supp, setSupp] = useState(supplier[0].name);
  const [batches, setBatches] = useState<BatchDraft[]>([
    { id: "b1", item: item[0].name, qty: 60, unit_cost: 90, lot_number: "", expiry: "2026-10-31", photography: true, warehouse: "Primary Vault" },
  ]);
  const steps = [
    { label: "Supplier",   icon: User },
    { label: "Batches",    icon: Package },
    { label: "Costs",      icon: ClipboardList },
    { label: "Photography", icon: Camera },
    { label: "Warehouse",  icon: Warehouse },
    { label: "Review",     icon: Check },
  ];

  return (
    <SheetAppShell sheet="inventory" title="New Intake Session" subtitle="6 steps · Zero friction intake">
      {/* Stepper with progress rail */}
      <div style={{
        background: "var(--surface)", padding: "16px 24px 14px",
        borderBottom: "1px solid var(--border-hair)",
      }}>
        <div style={{ position: "relative", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          {/* Rail */}
          <div style={{
            position: "absolute", left: 13, right: 13, top: 13, height: 2,
            background: "#EEEEF1", borderRadius: 999,
          }} />
          {/* Progress */}
          <div style={{
            position: "absolute", left: 13, top: 13, height: 2,
            width: `calc(${(step / (steps.length - 1)) * 100}% - 26px * ${step / (steps.length - 1)})`,
            background: "linear-gradient(90deg, #34C759, #007AFF)", borderRadius: 999,
            transition: "width .25s var(--ease-out)",
          }} />
          {steps.map((s, i) => {
            const Ico = s.icon;
            const done = i < step;
            const active = i === step;
            return (
              <button key={s.label} onClick={() => setStep(i)} style={{
                position: "relative", display: "flex", flexDirection: "column",
                alignItems: "center", gap: 6, background: "transparent", padding: 0,
              }}>
                <div style={{
                  width: 26, height: 26, borderRadius: 999,
                  background: active ? "var(--accent-blue)" : done ? "#34C759" : "#fff",
                  border: active ? "none" : done ? "none" : "2px solid #EEEEF1",
                  color: active || done ? "#fff" : "var(--text-3)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 11, fontWeight: 700,
                  boxShadow: active ? "0 4px 10px rgba(0,122,255,.28)" : "none",
                  transition: "all .15s var(--ease-out)",
                }}>{done ? <Check size={12} /> : <Ico size={12} />}</div>
                <div style={{
                  fontSize: 11, color: active ? "var(--text-1)" : done ? "var(--text-2)" : "var(--text-3)",
                  fontWeight: active ? 600 : 500, whiteSpace: "nowrap",
                }}>{s.label}</div>
              </button>
            );
          })}
        </div>
      </div>

      <div className="num-scroll" style={{ flex: 1, overflow: "auto", padding: 24, background: "var(--canvas)" }}>
        <div style={{ maxWidth: 920, margin: "0 auto", background: "var(--surface)",
          border: "1px solid var(--border-hair)", borderRadius: 12, padding: 24,
          boxShadow: "var(--shadow-card)" }}>

          {step === 0 && (
            <>
              <H>Select supplier</H>
              <P>Choose the supplier for this intake session. All batches will be attributed to them.</P>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginTop: 14 }}>
                {supplier.map((s) => (
                  <div key={s.name} onClick={() => setSupp(s.name)}
                    style={{
                      padding: 14, borderRadius: 10, cursor: "pointer",
                      border: "2px solid " + (supp === s.name ? "var(--accent-blue)" : "var(--border-hair)"),
                      background: supp === s.name ? "var(--accent-blue-bg)" : "var(--surface)",
                    }}>
                    <div style={{ fontSize: 13, fontWeight: 600 }}>{s.name}</div>
                    <div style={{ fontSize: 11, color: "var(--text-3)" }}>License {s.license_number} · Reminder {s.harvest_reminder_days}d</div>
                  </div>
                ))}
              </div>
            </>
          )}

          {step === 1 && (
            <>
              <H>Add batches</H>
              <P>Add each batch received today. You can add multiple — photography and warehouse decisions happen later.</P>
              <table className="num-table" style={{ marginTop: 10 }}>
                <thead><tr>
                  <th className="gutter"></th>
                  <th><div className="cell">Item</div></th>
                  <th><div className="cell" style={{justifyContent: "flex-end"}}>Qty</div></th>
                  <th><div className="cell" style={{justifyContent: "flex-end"}}>Cost</div></th>
                  <th><div className="cell">Lot</div></th>
                  <th><div className="cell">Expiry</div></th>
                </tr></thead>
                <tbody>
                  {batches.map((b, i) => (
                    <tr key={b.id}>
                      <td className="gutter">{i + 1}</td>
                      <td><div className="cell">
                        <select value={b.item} onChange={(e) => update(setBatches, i, { item: e.target.value })}
                          style={{ border: 0, background: "transparent", fontSize: 13 }}>
                          {item.map((it) => <option key={it.name}>{it.name}</option>)}
                        </select>
                      </div></td>
                      <td><div className="cell" style={{ justifyContent: "flex-end" }}>
                        <input type="number" value={b.qty} onChange={(e) => update(setBatches, i, { qty: +e.target.value })}
                          style={{ width: "100%", textAlign: "right", border: 0, background: "transparent", fontSize: 13 }} />
                      </div></td>
                      <td><div className="cell" style={{ justifyContent: "flex-end" }}>
                        <input type="number" value={b.unit_cost} onChange={(e) => update(setBatches, i, { unit_cost: +e.target.value })}
                          style={{ width: "100%", textAlign: "right", border: 0, background: "transparent", fontSize: 13 }} />
                      </div></td>
                      <td><div className="cell">
                        <input value={b.lot_number} placeholder="LV-24Q1-05" onChange={(e) => update(setBatches, i, { lot_number: e.target.value })}
                          style={{ width: "100%", border: 0, background: "transparent", fontSize: 13 }} />
                      </div></td>
                      <td><div className="cell">
                        <input type="date" value={b.expiry} onChange={(e) => update(setBatches, i, { expiry: e.target.value })}
                          style={{ width: "100%", border: 0, background: "transparent", fontSize: 13 }} />
                      </div></td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <button className="ghost-btn" style={{ marginTop: 10 }}
                onClick={() => setBatches((bs) => [...bs, { id: "b" + (bs.length + 1), item: item[0].name, qty: 0, unit_cost: 0, lot_number: "", expiry: "2026-10-31", photography: true, warehouse: "Primary Vault" }])}>
                + Add another batch
              </button>
            </>
          )}

          {step === 2 && (
            <>
              <H>Cost & pricing mode</H>
              <P>FIXED uses a single cost; RANGE accepts a low/mid/high band (shown to staff with the right role).</P>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginTop: 12 }}>
                <div style={panel}>
                  <div style={{ fontSize: 12, color: "var(--text-3)" }}>Mode</div>
                  <div style={{ fontSize: 14, fontWeight: 600, marginTop: 2 }}>FIXED · unit cost</div>
                  <div style={{ fontSize: 11, color: "var(--text-3)" }}>Current: {fmtCurrency(batches.reduce((a, b) => a + b.unit_cost, 0) / batches.length)} avg</div>
                </div>
                <div style={panel}>
                  <div style={{ fontSize: 12, color: "var(--text-3)" }}>Margin guardrails</div>
                  <div style={{ fontSize: 14, fontWeight: 600, marginTop: 2 }}>Min 12% · Max discount 10%</div>
                  <div style={{ fontSize: 11, color: "var(--text-3)" }}>From Retail Standard profile</div>
                </div>
              </div>
            </>
          )}

          {step === 3 && (
            <>
              <H>Photography</H>
              <P>Flag batches that need product photography. They are added to the Photography Queue automatically.</P>
              <div style={{ marginTop: 12 }}>
                {batches.map((b, i) => (
                  <div key={b.id} className="list-row">
                    <Camera size={13} color={b.photography ? "#007AFF" : "var(--text-3)"} />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 12, fontWeight: 600 }}>{b.item}</div>
                      <div style={{ fontSize: 11, color: "var(--text-3)" }}>Qty {b.qty} · Lot {b.lot_number || "—"}</div>
                    </div>
                    <label style={{ fontSize: 12, display: "flex", gap: 6, alignItems: "center" }}>
                      <input type="checkbox" checked={b.photography} onChange={(e) => update(setBatches, i, { photography: e.target.checked })} />
                      Requires shoot
                    </label>
                  </div>
                ))}
              </div>
            </>
          )}

          {step === 4 && (
            <>
              <H>Warehouse destination</H>
              <P>Pick the destination warehouse per batch. Bin transfers can happen later from the Inventory sheet.</P>
              <div style={{ marginTop: 12 }}>
                {batches.map((b, i) => (
                  <div key={b.id} className="list-row">
                    <Warehouse size={13} color="var(--text-3)" />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 12, fontWeight: 600 }}>{b.item}</div>
                      <div style={{ fontSize: 11, color: "var(--text-3)" }}>Qty {b.qty}</div>
                    </div>
                    <select value={b.warehouse} onChange={(e) => update(setBatches, i, { warehouse: e.target.value })}
                      style={{ padding: "4px 8px", border: "1px solid var(--border-hair)", borderRadius: 6, fontSize: 12 }}>
                      {warehouse.map((w) => <option key={w.name}>{w.name}</option>)}
                    </select>
                  </div>
                ))}
              </div>
            </>
          )}

          {step === 5 && (
            <>
              <H>Review & submit</H>
              <P>Confirm the details. On submit, new batches, stock entries, and photography queue entries are created.</P>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginTop: 12 }}>
                <div style={panel}>
                  <div style={{ fontSize: 11, color: "var(--text-3)" }}>Supplier</div>
                  <div style={{ fontSize: 14, fontWeight: 600, marginTop: 2 }}>{supp}</div>
                </div>
                <div style={panel}>
                  <div style={{ fontSize: 11, color: "var(--text-3)" }}>Batches · {batches.length}</div>
                  <div style={{ fontSize: 14, fontWeight: 600, marginTop: 2 }}>{batches.reduce((a,b)=>a+b.qty,0)} total units</div>
                </div>
              </div>
              <table className="num-table" style={{ marginTop: 12 }}>
                <thead><tr>
                  <th className="gutter"></th>
                  <th><div className="cell">Item</div></th>
                  <th><div className="cell" style={{justifyContent: "flex-end"}}>Qty</div></th>
                  <th><div className="cell" style={{justifyContent: "flex-end"}}>Cost</div></th>
                  <th><div className="cell">Photo</div></th>
                  <th><div className="cell">Warehouse</div></th>
                </tr></thead>
                <tbody>
                  {batches.map((b, i) => (
                    <tr key={b.id}>
                      <td className="gutter">{i + 1}</td>
                      <td><div className="cell">{b.item}</div></td>
                      <td><div className="cell" style={{justifyContent: "flex-end", fontVariantNumeric: "tabular-nums"}}>{b.qty}</div></td>
                      <td><div className="cell" style={{justifyContent: "flex-end"}}>{fmtCurrency(b.unit_cost)}</div></td>
                      <td><div className="cell">{b.photography ? <Check size={12} color="#34C759" /> : "—"}</div></td>
                      <td><div className="cell">{b.warehouse}</div></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          )}

        </div>
      </div>

      {/* Wizard footer */}
      <footer style={{
        background: "var(--surface)", borderTop: "1px solid var(--border-hair)",
        padding: "12px 20px", display: "flex", gap: 10, alignItems: "center",
      }}>
        <div style={{ flex: 1, fontSize: 11, color: "var(--text-3)" }}>
          <span style={{ fontWeight: 600, color: "var(--text-2)" }}>Step {step + 1}</span> of {steps.length} · {steps[step].label}
        </div>
        <button onClick={() => setStep((s) => Math.max(0, s - 1))}
          className="ghost-btn" disabled={step === 0}
          style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
          <ChevronLeft size={12} /> Back
        </button>
        <button onClick={() => {
          if (step === steps.length - 1) {
            toast.success("Intake session submitted — demo only");
          } else setStep((s) => s + 1);
        }}
          style={{
            height: 30, padding: "0 16px", background: "var(--accent-blue)", color: "#fff",
            borderRadius: 8, fontSize: 12, fontWeight: 600,
            display: "inline-flex", alignItems: "center", gap: 4,
            boxShadow: "0 1px 2px rgba(0,122,255,.25)",
          }}>
          {step === steps.length - 1 ? <><Check size={13} /> Submit session</> : <>Next <ChevronRight size={12} /></>}
        </button>
      </footer>
    </SheetAppShell>
  );
}

function update<T>(set: React.Dispatch<React.SetStateAction<T[]>>, idx: number, patch: Partial<T>) {
  set((xs) => xs.map((x, i) => (i === idx ? { ...x, ...patch } : x)));
}

const panel: React.CSSProperties = {
  padding: 14, borderRadius: 10, border: "1px solid var(--border-hair)", background: "var(--surface)",
};

function H({ children }: any) {
  return <div style={{ fontSize: 18, fontWeight: 700, letterSpacing: "-0.01em" }}>{children}</div>;
}
function P({ children }: any) {
  return <div style={{ fontSize: 12, color: "var(--text-3)", marginTop: 4 }}>{children}</div>;
}

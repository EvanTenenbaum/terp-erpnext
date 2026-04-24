export const fmtCurrency = (n: number | null | undefined, c = "USD") => {
  if (n === null || n === undefined || Number.isNaN(n)) return "—";
  const neg = n < 0;
  const abs = Math.abs(n);
  return (
    (neg ? "-" : "") +
    abs.toLocaleString("en-US", { style: "currency", currency: c, maximumFractionDigits: 2 })
  );
};
export const fmtNum = (n: number | null | undefined, d = 0) => {
  if (n === null || n === undefined || Number.isNaN(n)) return "—";
  return n.toLocaleString("en-US", { minimumFractionDigits: d, maximumFractionDigits: d });
};
export const fmtPct = (n: number | null | undefined) => {
  if (n === null || n === undefined || Number.isNaN(n)) return "—";
  // seed uses decimal pct (0.12) and integer pct (12). Detect.
  const pct = Math.abs(n) <= 1 ? n * 100 : n;
  return pct.toFixed(pct % 1 === 0 ? 0 : 1) + "%";
};
export const fmtDate = (s?: string | null) => {
  if (!s) return "—";
  const d = new Date(s.length === 10 ? s + "T00:00:00" : s);
  if (Number.isNaN(d.getTime())) return s;
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
};
export const fmtDateTime = (s?: string | null) => {
  if (!s) return "—";
  const d = new Date(s.replace(" ", "T"));
  if (Number.isNaN(d.getTime())) return s;
  return d.toLocaleString("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" });
};
export const initials = (s: string) =>
  s.split(/\s|-/).filter(Boolean).slice(0, 2).map((w) => w[0]?.toUpperCase() ?? "").join("");

/** Sum a numeric field across rows. */
export const sumByField = (rows: any[], name: string): number =>
  rows.reduce((acc, r) => acc + (typeof r?.[name] === "number" ? r[name] : 0), 0);

/** Compress over-long status labels for narrow columns. */
export const shortStatus = (s: string | null | undefined): string => {
  if (!s) return "—";
  const map: Record<string, string> = {
    "To Deliver and Bill": "Deliver+Bill",
    "To Receive and Bill": "Receive+Bill",
    "Partly Paid": "Partial",
    "requires_override": "Override",
    "soft_block": "Soft block",
    "hard_block": "Hard block",
    "Pending Approval": "Pending",
    "Pending Photography": "Photo pending",
    "Awaiting Intake": "Awaiting",
    "In Progress": "In progress",
  };
  return map[s] ?? s;
};

/** Deterministic chip style for a status string. */
export const chipClassFor = (s: string | null | undefined): string => {
  if (!s) return "chip";
  const k = s.toLowerCase();
  if (/(draft|pending|awaiting|scheduled)/.test(k)) return "chip chip-grey";
  if (/(paid|completed|live|approved|delivered|shot|published|submitted|ordered|accepted|allowed|active|matched)/.test(k)) return "chip chip-green";
  if (/(partly|partial|warning|shot|review|under|paused|to bill|to deliver|allocated|samples)/.test(k)) return "chip chip-amber";
  if (/(overdue|rejected|blocked|hard|expired|escalated|cancelled|ended|sold|defaulted|due now)/.test(k)) return "chip chip-red";
  if (/(soft|requires_override|requires override|converted|reserved)/.test(k)) return "chip chip-purple";
  return "chip chip-blue";
};

/**
 * VIP Portal — what the customer sees when they sign in.
 *
 * Same spreadsheet shell as the team-facing app, just scoped to a single
 * customer's view. No gradient hero, no card-heavy widgets — they're a buyer
 * in front of their own sheets: Catalogues, Live, My orders, My requests.
 */
import { useMemo, useState } from "react";
import SheetAppShell from "@/components/numbers/SheetAppShell";
import SheetTabBar, { type TabDef } from "@/components/numbers/SheetTabBar";
import SheetTable from "@/components/numbers/SheetTable";
import type { DocTypeDef } from "@/data/schema";
import {
  client_leaderboard, sales_catalogue, live_shopping_session,
  referral_credit, sales_invoice, client_need,
} from "@/data/seed";

const CUSTOMER = "Green Lotus Wellness";

const TABS: TabDef[] = [
  { key: "catalogues",  label: "Catalogues",   color: "#7E57C2" },
  { key: "live",        label: "Live shopping",color: "#FF3B30" },
  { key: "invoices",    label: "My orders",    color: "#34C759" },
  { key: "needs",       label: "My requests",  color: "#007AFF" },
  { key: "referrals",   label: "Referrals",    color: "#FFD54F" },
];

const D: Record<string, DocTypeDef> = {
  catalogues: {
    slug: "vip-cat", label: "Catalogues", singular: "Catalogue", sheet: "vip",
    statusField: "status",
    fields: [
      { name: "name",            label: "#",       type: "data",     width: 110 },
      { name: "catalogue_name",  label: "Name",    type: "data",     width: 240 },
      { name: "expiry",          label: "Expires", type: "date",     width: 120 },
      { name: "status",          label: "Status",  type: "select",   options: ["Draft","Active","Expired","Closed"], width: 110 },
    ],
  },
  live: {
    slug: "vip-live", label: "Live sessions", singular: "Session", sheet: "vip",
    statusField: "status",
    fields: [
      { name: "name",         label: "#",       type: "data",     width: 110 },
      { name: "title",        label: "Title",   type: "data",     width: 240 },
      { name: "scheduled_at", label: "When",    type: "datetime", width: 170 },
      { name: "host",         label: "Host",    type: "data",     width: 160 },
      { name: "status",       label: "Status",  type: "select",
        options: ["Scheduled","Live","Ended","Cancelled"], width: 110 },
    ],
  },
  invoices: {
    slug: "vip-inv", label: "My orders", singular: "Invoice", sheet: "vip",
    statusField: "status",
    fields: [
      { name: "name",                label: "Invoice #",  type: "data",    width: 130 },
      { name: "posting_date",        label: "Date",       type: "date",    width: 110 },
      { name: "due_date",            label: "Due",        type: "date",    width: 110 },
      { name: "grand_total",         label: "Total",      type: "currency",width: 120 },
      { name: "outstanding_amount",  label: "Owed",       type: "currency",width: 120 },
      { name: "status",              label: "Status",     type: "select",
        options: ["Unpaid","Partly Paid","Paid","Overdue"], width: 130 },
    ],
  },
  needs: {
    slug: "vip-needs", label: "My requests", singular: "Request", sheet: "vip",
    statusField: "status",
    fields: [
      { name: "name",         label: "#",        type: "data",     width: 110 },
      { name: "strain",       label: "Strain",   type: "data",     width: 200 },
      { name: "qty_needed",   label: "Qty",      type: "float",    width: 90 },
      { name: "max_price",    label: "Max $",    type: "currency", width: 110 },
      { name: "needed_by",    label: "By",       type: "date",     width: 110 },
      { name: "status",       label: "Status",   type: "select",
        options: ["Open","Matched","Fulfilled","Expired","Cancelled"], width: 120 },
    ],
  },
  referrals: {
    slug: "vip-ref", label: "Referrals", singular: "Referral", sheet: "vip",
    statusField: "status",
    fields: [
      { name: "name",         label: "#",       type: "data",     width: 110 },
      { name: "referred_by",  label: "From",    type: "data",     width: 200 },
      { name: "credit_value", label: "Credit",  type: "currency", width: 110 },
      { name: "expires_on",   label: "Expires", type: "date",     width: 110 },
      { name: "status",       label: "Status",  type: "select",
        options: ["Active","Used","Expired","Cancelled"], width: 110 },
    ],
  },
};

export default function VipPortal() {
  const [active, setActive] = useState<string>("catalogues");

  // Filter every tab down to this customer.
  const data = useMemo<any[]>(() => {
    switch (active) {
      case "catalogues":
        return sales_catalogue.filter((c: any) => c.customer === CUSTOMER || !c.customer);
      case "live":
        return live_shopping_session;
      case "invoices":
        return sales_invoice.filter((i: any) => i.customer === CUSTOMER);
      case "needs":
        return client_need.filter((n: any) => n.customer === CUSTOMER);
      case "referrals":
        return referral_credit.filter((r: any) => r.referred_to === CUSTOMER || r.referred_by === CUSTOMER);
      default:
        return [];
    }
  }, [active]);

  const rank = client_leaderboard.find((l: any) => l.customer === CUSTOMER);
  const tier = rank
    ? rank.master_score >= 90 ? "S"
      : rank.master_score >= 80 ? "A"
      : rank.master_score >= 70 ? "B" : "C"
    : null;

  return (
    <SheetAppShell
      sheet="vip"
      title=""
      subtitle=""
      actions={
        <div style={{
          display: "flex", alignItems: "center", gap: 10, fontSize: 12, color: "var(--text-2)",
        }}>
          <span>{CUSTOMER}</span>
          {rank && (
            <span style={{
              padding: "2px 8px", borderRadius: 999, background: "var(--surface-2)",
              fontVariantNumeric: "tabular-nums", color: "var(--text-1)", fontWeight: 600,
            }}>
              Tier {tier} · {rank.master_score.toFixed(1)}
            </span>
          )}
        </div>
      }
    >
      <SheetTable doctype={D[active]} rows={data} />
      <SheetTabBar tabs={TABS} active={active} onSelect={setActive}
                   accent="#7E57C2" position="bottom" />
    </SheetAppShell>
  );
}

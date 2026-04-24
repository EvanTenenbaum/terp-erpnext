// Simulated seed data for every sheet. Not real; used to make the mockup feel alive.
// Intentionally compact: enough rows to show sorting/filtering/kanban/calendar; not
// overly "designed" so users can imagine their own data in the shape.
import type { Sheet } from "./schema";

export const today = new Date("2026-04-23T12:00:00Z");
const d = (offset: number) => {
  const x = new Date(today);
  x.setDate(x.getDate() + offset);
  return x.toISOString().slice(0, 10);
};
const dt = (offset: number, hh = 14, mm = 30) => {
  const x = new Date(today);
  x.setDate(x.getDate() + offset);
  x.setHours(hh, mm, 0, 0);
  return x.toISOString().slice(0, 16).replace("T", " ");
};

/** STRAINS */
export const thca_strain = [
  { strain_name: "Blue Dream", strain_type: "Hybrid", description: "Sweet berry, energetic", is_active: true },
  { strain_name: "Northern Lights", strain_type: "Indica", description: "Piney, relaxing", is_active: true },
  { strain_name: "Sour Diesel", strain_type: "Sativa", description: "Diesel, uplifting", is_active: true },
  { strain_name: "OG Kush", strain_type: "Hybrid", description: "Earthy, heavy", is_active: true },
  { strain_name: "Gelato 41", strain_type: "Hybrid", description: "Dessert, creamy", is_active: true },
  { strain_name: "Wedding Cake", strain_type: "Hybrid", description: "Vanilla, tangy", is_active: true },
  { strain_name: "Jack Herer", strain_type: "Sativa", description: "Herbal, clear", is_active: true },
  { strain_name: "Granddaddy Purple", strain_type: "Indica", description: "Grape, sedative", is_active: true },
];

export const product_grade = [
  { grade_code: "AAA", grade_label: "Top Shelf", description: "Hand-trimmed, premium buds" },
  { grade_code: "AA",  grade_label: "Premium",  description: "Machine-trimmed, tight buds" },
  { grade_code: "A",   grade_label: "Value",    description: "Looser, value-friendly" },
  { grade_code: "B",   grade_label: "Smalls",   description: "Small buds, pre-roll grade" },
];

/** CUSTOMERS */
export const customer = [
  { name: "Atlas Dispensary",      customer_group: "Retail", license_number: "C11-0000123-LIC", is_seller: false, credit_limit_mode: "WARNING",    vip_portal_enabled: true,  preferred_payment_term: "Net 30", sales_rep: "rep.ruiz@terp.io",  referred_by: "Green Lotus Wellness",  credit_used: 28400, credit_limit: 50000 },
  { name: "Sunrise Collective",    customer_group: "Retail", license_number: "C11-0000207-LIC", is_seller: false, credit_limit_mode: "SOFT_BLOCK", vip_portal_enabled: true,  preferred_payment_term: "Net 15", sales_rep: "rep.khan@terp.io",  referred_by: null,                    credit_used: 42500, credit_limit: 40000 },
  { name: "High Meadow Co.",       customer_group: "Retail", license_number: "C11-0000311-LIC", is_seller: false, credit_limit_mode: "HARD_BLOCK", vip_portal_enabled: false, preferred_payment_term: "COD",    sales_rep: "rep.ruiz@terp.io",  referred_by: null,                    credit_used: 51200, credit_limit: 40000 },
  { name: "Green Lotus Wellness",  customer_group: "Retail", license_number: "C11-0000408-LIC", is_seller: true,  credit_limit_mode: "WARNING",    vip_portal_enabled: true,  preferred_payment_term: "Net 30", sales_rep: "rep.khan@terp.io", referred_by: null,                    credit_used: 12800, credit_limit: 60000 },
  { name: "Cascade Supply",        customer_group: "Retail", license_number: "C11-0000502-LIC", is_seller: false, credit_limit_mode: "WARNING",    vip_portal_enabled: true,  preferred_payment_term: "Net 15", sales_rep: "rep.ruiz@terp.io", referred_by: null,                    credit_used: 8100,  credit_limit: 30000 },
  { name: "Verde Markets",         customer_group: "Wholesale", license_number: "C11-0000604-LIC", is_seller: false, credit_limit_mode: "WARNING",    vip_portal_enabled: false, preferred_payment_term: "Net 30", sales_rep: "rep.khan@terp.io", referred_by: null,                    credit_used: 17500, credit_limit: 75000 },
  { name: "Redwood Cannabis",      customer_group: "Retail", license_number: "C11-0000745-LIC", is_seller: false, credit_limit_mode: "SOFT_BLOCK", vip_portal_enabled: true,  preferred_payment_term: "Net 15", sales_rep: "rep.ruiz@terp.io", referred_by: "Atlas Dispensary",       credit_used: 29800, credit_limit: 30000 },
  { name: "Coastline Canna",       customer_group: "Retail", license_number: "C11-0000823-LIC", is_seller: false, credit_limit_mode: "WARNING",    vip_portal_enabled: false, preferred_payment_term: "Net 30", sales_rep: "rep.khan@terp.io", referred_by: null,                    credit_used: 3900,  credit_limit: 25000 },
  { name: "Mission Leaf",          customer_group: "Retail", license_number: "C11-0000930-LIC", is_seller: false, credit_limit_mode: "WARNING",    vip_portal_enabled: true,  preferred_payment_term: "Net 30", sales_rep: "rep.ruiz@terp.io", referred_by: null,                    credit_used: 18600, credit_limit: 50000 },
  { name: "Humboldt House",        customer_group: "Retail", license_number: "C11-0001041-LIC", is_seller: true,  credit_limit_mode: "WARNING",    vip_portal_enabled: true,  preferred_payment_term: "Net 30", sales_rep: "rep.khan@terp.io", referred_by: null,                    credit_used: 22400, credit_limit: 55000 },
];

/** SUPPLIERS */
export const supplier = [
  { name: "Emerald Grow Partners",  supplier_type: "Company",    license_number: "CCL-AAL-2200331", harvest_reminder_days: 28, verification_email: "ops@emerald-grow.example", is_buyer: false },
  { name: "Lakeview Farms",         supplier_type: "Company",    license_number: "CCL-FAR-2205112", harvest_reminder_days: 45, verification_email: "harvest@lakeview.example", is_buyer: true },
  { name: "Tumbleweed Ranch",       supplier_type: "Company",    license_number: "CCL-FAR-2211009", harvest_reminder_days: 42, verification_email: "intake@tumbleweed.example", is_buyer: false },
  { name: "Alpine Heights",         supplier_type: "Company",    license_number: "CCL-FAR-2208844", harvest_reminder_days: 30, verification_email: "ops@alpineheights.example", is_buyer: false },
  { name: "Lighthouse Labs",        supplier_type: "Company",    license_number: "CCL-MFR-2217031", harvest_reminder_days: 14, verification_email: "qc@lighthouse.example",     is_buyer: false },
  { name: "Drydale Gardens",        supplier_type: "Individual", license_number: "CCL-FAR-2220777", harvest_reminder_days: 50, verification_email: "amy@drydale.example",       is_buyer: false },
];

/** ITEMS */
export const item = [
  { name: "FL-BLUEDREAM-28",   item_name: "Blue Dream 28g",        strain: "Blue Dream",        product_grade: "AAA", product_type: "Flower",       cogs_mode: "FIXED", cogs_fixed: 90,  cogs_low: null, cogs_mid: null, cogs_high: null, requires_photography: true,  workflow_status: "Live" },
  { name: "FL-NL-28",          item_name: "Northern Lights 28g",   strain: "Northern Lights",   product_grade: "AA",  product_type: "Flower",       cogs_mode: "RANGE", cogs_fixed: null, cogs_low: 80, cogs_mid: 88, cogs_high: 96, requires_photography: true,  workflow_status: "Live" },
  { name: "FL-SD-28",          item_name: "Sour Diesel 28g",       strain: "Sour Diesel",       product_grade: "AAA", product_type: "Flower",       cogs_mode: "RANGE", cogs_fixed: null, cogs_low: 95, cogs_mid: 102, cogs_high: 110, requires_photography: true, workflow_status: "Photographed" },
  { name: "FL-OG-28",          item_name: "OG Kush 28g",           strain: "OG Kush",           product_grade: "AA",  product_type: "Flower",       cogs_mode: "FIXED", cogs_fixed: 82,  cogs_low: null, cogs_mid: null, cogs_high: null, requires_photography: true,  workflow_status: "Ready to Ship" },
  { name: "PR-GELATO-1G",      item_name: "Gelato 41 Pre-Roll 1g", strain: "Gelato 41",         product_grade: "A",   product_type: "Pre-Roll",     cogs_mode: "FIXED", cogs_fixed: 2.5, cogs_low: null, cogs_mid: null, cogs_high: null, requires_photography: true,  workflow_status: "Live" },
  { name: "CC-LIVE-1G",        item_name: "Live Resin 1g",         strain: "Wedding Cake",      product_grade: "AAA", product_type: "Concentrate",  cogs_mode: "RANGE", cogs_fixed: null, cogs_low: 12, cogs_mid: 14, cogs_high: 17, requires_photography: true,  workflow_status: "Live" },
  { name: "VP-LIVE-5G",        item_name: "Live Resin Vape 1g",    strain: "Jack Herer",        product_grade: "AA",  product_type: "Vape",         cogs_mode: "FIXED", cogs_fixed: 9,   cogs_low: null, cogs_mid: null, cogs_high: null, requires_photography: false, workflow_status: "Live" },
  { name: "ED-GUMMY-10",       item_name: "Gummy 10-pack",         strain: "Granddaddy Purple", product_grade: "A",   product_type: "Edible",       cogs_mode: "FIXED", cogs_fixed: 5,   cogs_low: null, cogs_mid: null, cogs_high: null, requires_photography: true,  workflow_status: "Live" },
];

/** BATCHES */
const _batchRows = [
  ["BATCH-20260401-001", "FL-BLUEDREAM-28", "Emerald Grow Partners", "EG-24Q1-01", 120, 90, 85, 100,  "Published", "INT-2026-0401",  d(-22)],
  ["BATCH-20260401-002", "FL-NL-28",        "Lakeview Farms",        "LV-24Q1-01", 80,  85, 80, 96,   "Published", "INT-2026-0401",  d(-22)],
  ["BATCH-20260408-003", "FL-SD-28",        "Tumbleweed Ranch",      "TR-24Q1-02", 45, 102, 95, 110,  "Shot",      "INT-2026-0408",  d(-15)],
  ["BATCH-20260415-004", "FL-OG-28",        "Alpine Heights",        "AH-24Q1-03", 60,  82, 80, 88,   "Pending",   "INT-2026-0415",  d(-8)],
  ["BATCH-20260416-005", "PR-GELATO-1G",    "Lakeview Farms",        "LV-24Q1-04", 1000, 2.5, 2, 3,   "Published", "INT-2026-0416",  d(-7)],
  ["BATCH-20260418-006", "CC-LIVE-1G",      "Lighthouse Labs",       "LH-24Q1-07", 220, 14, 12, 17,   "Published", "INT-2026-0418",  d(-5)],
  ["BATCH-20260419-007", "VP-LIVE-5G",      "Lighthouse Labs",       "LH-24Q1-08", 480, 9,  8,  10,   "Pending",   "INT-2026-0419",  d(-4)],
  ["BATCH-20260420-008", "ED-GUMMY-10",     "Drydale Gardens",       "DG-24Q1-01", 360, 5,  4,  6,    "Shot",      "INT-2026-0420",  d(-3)],
  ["BATCH-20260422-009", "FL-BLUEDREAM-28", "Emerald Grow Partners", "EG-24Q1-02", 65,  92, 88, 102,  "Pending",   "INT-2026-0422",  d(-1)],
  ["BATCH-20260422-010", "FL-OG-28",        "Alpine Heights",        "AH-24Q1-04", 40,  80, 78, 90,   "Pending",   "INT-2026-0422",  d(-1)],
] as const;
const batchStatuses = ["Live","Live","Photographed","Awaiting Intake","Live","Live","Awaiting Intake","Photographed","Awaiting Intake","Awaiting Intake"];
export const batch = _batchRows.map((row, i) => ({
  name: row[0], sku: row[0], item: row[1], batch_status: batchStatuses[i],
  supplier: row[2], lot_number: row[3], qty: row[4], unit_cost: row[5],
  vendor_range_low: row[6], vendor_range_high: row[7], photography_status: row[8],
  intake_session: row[9], expiry_date: row[10],
}));

/** INTAKE SESSIONS */
export const intake_session = [
  { name: "INT-2026-0401", supplier: "Emerald Grow Partners", intake_date: dt(-22, 9, 30),  intake_by: "intake@terp.io", status: "Submitted", warehouse: "Primary Vault", items_count: 2 },
  { name: "INT-2026-0408", supplier: "Tumbleweed Ranch",      intake_date: dt(-15, 11, 0),  intake_by: "intake@terp.io", status: "Submitted", warehouse: "Primary Vault", items_count: 1 },
  { name: "INT-2026-0415", supplier: "Alpine Heights",        intake_date: dt(-8, 14, 0),   intake_by: "intake@terp.io", status: "Submitted", warehouse: "Primary Vault", items_count: 1 },
  { name: "INT-2026-0416", supplier: "Lakeview Farms",        intake_date: dt(-7, 10, 30),  intake_by: "intake@terp.io", status: "Submitted", warehouse: "Primary Vault", items_count: 1 },
  { name: "INT-2026-0418", supplier: "Lighthouse Labs",       intake_date: dt(-5, 13, 0),   intake_by: "intake@terp.io", status: "Submitted", warehouse: "Lab Vault",     items_count: 1 },
  { name: "INT-2026-0419", supplier: "Lighthouse Labs",       intake_date: dt(-4, 15, 30),  intake_by: "intake@terp.io", status: "Submitted", warehouse: "Lab Vault",     items_count: 1 },
  { name: "INT-2026-0420", supplier: "Drydale Gardens",       intake_date: dt(-3, 9, 0),    intake_by: "intake@terp.io", status: "Submitted", warehouse: "Primary Vault", items_count: 1 },
  { name: "INT-2026-0422", supplier: "Emerald Grow Partners", intake_date: dt(-1, 16, 0),   intake_by: "intake@terp.io", status: "Pending",   warehouse: "Primary Vault", items_count: 2 },
];

/** WAREHOUSES */
export const warehouse = [
  { name: "Primary Vault",     warehouse_type: "Stores",  parent_warehouse: null,           is_group: false, stock_value: 182_400 },
  { name: "Lab Vault",         warehouse_type: "Stores",  parent_warehouse: null,           is_group: false, stock_value: 91_200 },
  { name: "Shop Floor",        warehouse_type: "Shop",    parent_warehouse: "Primary Vault", is_group: false, stock_value: 18_800 },
  { name: "Transit",           warehouse_type: "Transit", parent_warehouse: null,           is_group: false, stock_value: 12_300 },
];

/** SALES ORDERS */
export const sales_order = [
  { name: "SO-00010", customer: "Atlas Dispensary",     transaction_date: d(-6), delivery_date: d(-1), grand_total: 12_400,  status: "Completed",          credit_status: "allowed", pricing_profile: "Retail Standard", order_source: "Desk",          referral_credit_applied: 0 },
  { name: "SO-00011", customer: "Sunrise Collective",   transaction_date: d(-5), delivery_date: d(1),  grand_total: 7_850,   status: "To Deliver",         credit_status: "warning", pricing_profile: "Retail Standard", order_source: "VIP Portal",    referral_credit_applied: 0 },
  { name: "SO-00012", customer: "High Meadow Co.",      transaction_date: d(-4), delivery_date: d(2),  grand_total: 5_200,   status: "Draft",              credit_status: "blocked", pricing_profile: "Retail Standard", order_source: "Desk",          referral_credit_applied: 0 },
  { name: "SO-00013", customer: "Green Lotus Wellness", transaction_date: d(-3), delivery_date: d(3),  grand_total: 18_900,  status: "To Deliver and Bill",credit_status: "allowed", pricing_profile: "VIP Tier",        order_source: "Catalogue",     referral_credit_applied: 500 },
  { name: "SO-00014", customer: "Cascade Supply",       transaction_date: d(-2), delivery_date: d(4),  grand_total: 3_600,   status: "To Bill",            credit_status: "allowed", pricing_profile: "Retail Standard", order_source: "Live Shopping", referral_credit_applied: 0 },
  { name: "SO-00015", customer: "Verde Markets",        transaction_date: d(-2), delivery_date: d(5),  grand_total: 28_400,  status: "To Deliver",         credit_status: "allowed", pricing_profile: "Wholesale",       order_source: "Desk",          referral_credit_applied: 0 },
  { name: "SO-00016", customer: "Redwood Cannabis",     transaction_date: d(-1), delivery_date: d(6),  grand_total: 6_150,   status: "Draft",              credit_status: "warning", pricing_profile: "Retail Standard", order_source: "VIP Portal",    referral_credit_applied: 0 },
  { name: "SO-00017", customer: "Coastline Canna",      transaction_date: d(-1), delivery_date: d(7),  grand_total: 2_100,   status: "To Bill",            credit_status: "allowed", pricing_profile: "Retail Standard", order_source: "Desk",          referral_credit_applied: 0 },
  { name: "SO-00018", customer: "Mission Leaf",         transaction_date: d(0),  delivery_date: d(8),  grand_total: 9_300,   status: "Submitted",          credit_status: "allowed", pricing_profile: "Retail Standard", order_source: "Catalogue",     referral_credit_applied: 0 },
  { name: "SO-00019", customer: "Humboldt House",       transaction_date: d(0),  delivery_date: d(9),  grand_total: 14_750,  status: "Submitted",          credit_status: "warning", pricing_profile: "VIP Tier",        order_source: "VIP Portal",    referral_credit_applied: 0 },
  { name: "SO-00020", customer: "Atlas Dispensary",     transaction_date: d(1),  delivery_date: d(10), grand_total: 4_400,   status: "Draft",              credit_status: "allowed", pricing_profile: "Retail Standard", order_source: "Desk",          referral_credit_applied: 0 },
  { name: "SO-00021", customer: "Green Lotus Wellness", transaction_date: d(1),  delivery_date: d(11), grand_total: 22_050,  status: "Draft",              credit_status: "allowed", pricing_profile: "VIP Tier",        order_source: "Desk",          referral_credit_applied: 250 },
];

/** QUOTATIONS */
export const quotation = [
  { name: "QTN-0041", party_name: "Atlas Dispensary",     transaction_date: d(-3), valid_till: d(7),  grand_total: 5_300,  status: "Submitted" },
  { name: "QTN-0042", party_name: "Sunrise Collective",   transaction_date: d(-2), valid_till: d(8),  grand_total: 2_900,  status: "Submitted" },
  { name: "QTN-0043", party_name: "Verde Markets",        transaction_date: d(-1), valid_till: d(9),  grand_total: 18_700, status: "Ordered"   },
  { name: "QTN-0044", party_name: "Redwood Cannabis",     transaction_date: d(0),  valid_till: d(10), grand_total: 4_100,  status: "Draft"     },
  { name: "QTN-0045", party_name: "Humboldt House",       transaction_date: d(0),  valid_till: d(10), grand_total: 9_950,  status: "Draft"     },
];

export const sales_return = [
  { name: "RET-0007", customer: "Atlas Dispensary",   return_against: "SO-00010", posting_date: d(-1), grand_total: -340, status: "Submitted" },
  { name: "RET-0008", customer: "Cascade Supply",     return_against: "SO-00014", posting_date: d(-1), grand_total: -120, status: "Draft"     },
];

/** CATALOGUES */
export const sales_catalogue = [
  { name: "CAT-0101", catalogue_name: "Atlas Weekly April 22",  customer: "Atlas Dispensary",    status: "Published", items_count: 28, share_token: "ATL-APR22-ZM4L", token_expires_at: dt(7, 18, 0),  created_by: "rep.ruiz@terp.io" },
  { name: "CAT-0102", catalogue_name: "Green Lotus VIP Tier",   customer: "Green Lotus Wellness", status: "Published", items_count: 42, share_token: "GLW-VIP-7QR2",   token_expires_at: dt(14, 18, 0), created_by: "rep.khan@terp.io" },
  { name: "CAT-0103", catalogue_name: "Sunrise Restock",        customer: "Sunrise Collective",   status: "Draft",     items_count: 12, share_token: "",                token_expires_at: null,           created_by: "rep.ruiz@terp.io" },
  { name: "CAT-0104", catalogue_name: "Spring Harvest",         customer: null,                   status: "Published", items_count: 60, share_token: "SPRING-2026",    token_expires_at: dt(30, 18, 0), created_by: "admin@terp.io" },
];

/** LIVE SESSIONS */
export const live_shopping_session = [
  { name: "LS-0019", session_title: "Atlas VIP Drop",       host: "rep.ruiz@terp.io", customer: "Atlas Dispensary",    room_code: "ATL-RM1", status: "Scheduled", start_time: dt(1, 13, 0), end_time: null,            converted_order: null       },
  { name: "LS-0020", session_title: "Green Lotus Live",     host: "rep.khan@terp.io", customer: "Green Lotus Wellness", room_code: "GLW-RM1", status: "Active",    start_time: dt(0, 10, 30),end_time: null,            converted_order: null       },
  { name: "LS-0021", session_title: "Wholesale Open Hour",  host: "rep.ruiz@terp.io", customer: null,                   room_code: "WHO-OPN", status: "Paused",    start_time: dt(0, 9, 0),  end_time: null,            converted_order: null       },
  { name: "LS-0022", session_title: "Sunrise Preview",      host: "rep.khan@terp.io", customer: "Sunrise Collective",   room_code: "SUN-RM2", status: "Ended",     start_time: dt(-3, 14, 0),end_time: dt(-3, 15, 30), converted_order: "SO-00011" },
];

/** CLIENT NEEDS / SUPPLIER SUPPLY / MATCH RECORDS */
export const client_need = [
  { name: "NEED-0301", customer: "Atlas Dispensary",     item_group: "Flower",      strain: "Blue Dream",    product_type: "Flower",      quantity_needed: 500, unit: "g", max_price: 90, urgency: "Urgent", status: "Active",  expiry_date: d(7)  },
  { name: "NEED-0302", customer: "Sunrise Collective",   item_group: "Concentrate", strain: "Wedding Cake",  product_type: "Concentrate", quantity_needed: 40,  unit: "g", max_price: 16, urgency: "Normal", status: "Matched", expiry_date: d(14) },
  { name: "NEED-0303", customer: "Verde Markets",        item_group: "Flower",      strain: "Sour Diesel",   product_type: "Flower",      quantity_needed: 2000,unit: "g", max_price: 105,urgency: "Normal", status: "Active",  expiry_date: d(10) },
  { name: "NEED-0304", customer: "Humboldt House",       item_group: "Vape",        strain: "Jack Herer",    product_type: "Vape",        quantity_needed: 500, unit: "ea",max_price: 10, urgency: "Normal", status: "Active",  expiry_date: d(21) },
];
export const supplier_supply = [
  { name: "SUP-0501", supplier: "Emerald Grow Partners", item_group: "Flower",      strain: "Blue Dream",    product_type: "Flower",      quantity_available: 600, unit: "g", ask_price: 88, status: "Available", expiry_date: d(21) },
  { name: "SUP-0502", supplier: "Lighthouse Labs",       item_group: "Concentrate", strain: "Wedding Cake",  product_type: "Concentrate", quantity_available: 80,  unit: "g", ask_price: 14, status: "Reserved",  expiry_date: d(18) },
  { name: "SUP-0503", supplier: "Tumbleweed Ranch",      item_group: "Flower",      strain: "Sour Diesel",   product_type: "Flower",      quantity_available: 2100,unit: "g", ask_price: 102,status: "Available", expiry_date: d(25) },
  { name: "SUP-0504", supplier: "Lighthouse Labs",       item_group: "Vape",        strain: "Jack Herer",    product_type: "Vape",        quantity_available: 600, unit: "ea",ask_price: 9,  status: "Available", expiry_date: d(40) },
];
export const match_record = [
  { name: "MATCH-0701", client_need: "NEED-0301", supplier_supply: "SUP-0501", match_score: 0.92, status: "Suggested", converted_order: null },
  { name: "MATCH-0702", client_need: "NEED-0302", supplier_supply: "SUP-0502", match_score: 0.98, status: "Accepted",  converted_order: null },
  { name: "MATCH-0703", client_need: "NEED-0303", supplier_supply: "SUP-0503", match_score: 0.90, status: "Suggested", converted_order: null },
  { name: "MATCH-0704", client_need: "NEED-0304", supplier_supply: "SUP-0504", match_score: 0.88, status: "Suggested", converted_order: null },
];

/** PRICING + COGS */
export const pricing_profile = [
  { profile_name: "Retail Standard", customer: null,                     base_markup_pct: 0.42, min_margin_pct: 0.12, max_discount_pct: 0.10, allow_below_vendor_range: false, allow_cogs_override: false, allow_margin_override: false },
  { profile_name: "VIP Tier",        customer: "Green Lotus Wellness",   base_markup_pct: 0.30, min_margin_pct: 0.10, max_discount_pct: 0.15, allow_below_vendor_range: false, allow_cogs_override: true,  allow_margin_override: true  },
  { profile_name: "Wholesale",       customer: "Verde Markets",          base_markup_pct: 0.22, min_margin_pct: 0.08, max_discount_pct: 0.20, allow_below_vendor_range: true,  allow_cogs_override: true,  allow_margin_override: true  },
  { profile_name: "New Account",     customer: null,                     base_markup_pct: 0.50, min_margin_pct: 0.18, max_discount_pct: 0.05, allow_below_vendor_range: false, allow_cogs_override: false, allow_margin_override: false },
];
export const cogs_rule = [
  { rule_name: "Default Flower FIXED",  applies_to: "All Customers",       customer: null, item_group: "Flower",      cogs_mode: "FIXED", fixed_cogs: 85, cogs_low: null, cogs_mid: null, cogs_high: null, priority: 10, is_active: true },
  { rule_name: "Wholesale Flower RANGE", applies_to: "Customer Group",     customer: "Verde Markets", item_group: "Flower",  cogs_mode: "RANGE", fixed_cogs: null, cogs_low: 78, cogs_mid: 84, cogs_high: 92, priority: 5, is_active: true },
  { rule_name: "Lab Concentrate RANGE",  applies_to: "All Customers",      customer: null, item_group: "Concentrate", cogs_mode: "RANGE", fixed_cogs: null, cogs_low: 12, cogs_mid: 14, cogs_high: 17, priority: 10, is_active: true },
  { rule_name: "Vape FIXED",             applies_to: "All Customers",      customer: null, item_group: "Vape",        cogs_mode: "FIXED", fixed_cogs: 9,  cogs_low: null, cogs_mid: null, cogs_high: null, priority: 10, is_active: true },
];

/** PHOTOGRAPHY QUEUE */
export const photography_queue = [
  { name: "PQ-0041", batch_no: "BATCH-20260408-003", item: "FL-SD-28",        status: "Shot",      queued_date: d(-15), shot_date: d(-13) },
  { name: "PQ-0042", batch_no: "BATCH-20260415-004", item: "FL-OG-28",        status: "Pending",   queued_date: d(-8),  shot_date: null    },
  { name: "PQ-0043", batch_no: "BATCH-20260419-007", item: "VP-LIVE-5G",      status: "Pending",   queued_date: d(-4),  shot_date: null    },
  { name: "PQ-0044", batch_no: "BATCH-20260420-008", item: "ED-GUMMY-10",     status: "Shot",      queued_date: d(-3),  shot_date: d(-2)   },
  { name: "PQ-0045", batch_no: "BATCH-20260422-009", item: "FL-BLUEDREAM-28", status: "Pending",   queued_date: d(-1),  shot_date: null    },
  { name: "PQ-0046", batch_no: "BATCH-20260422-010", item: "FL-OG-28",        status: "Pending",   queued_date: d(-1),  shot_date: null    },
];

/** SAMPLE REQUESTS */
export const sample_request = [
  { name: "SMP-0051", customer: "Atlas Dispensary",     item: "FL-BLUEDREAM-28", batch_no: "BATCH-20260401-001", qty: 3.5, requested_date: d(-8), due_date: d(-1), status: "Returned",    location: "Primary Vault" },
  { name: "SMP-0052", customer: "Cascade Supply",       item: "CC-LIVE-1G",      batch_no: "BATCH-20260418-006", qty: 1,   requested_date: d(-5), due_date: d(2),  status: "Samples Out", location: "Lab Vault"     },
  { name: "SMP-0053", customer: "Green Lotus Wellness", item: "PR-GELATO-1G",    batch_no: "BATCH-20260416-005", qty: 2,   requested_date: d(-3), due_date: d(4),  status: "Allocated",   location: "Primary Vault" },
  { name: "SMP-0054", customer: "Humboldt House",       item: "VP-LIVE-5G",      batch_no: "BATCH-20260419-007", qty: 1,   requested_date: d(-1), due_date: d(6),  status: "Requested",   location: "Lab Vault"     },
];

export const batch_status_history = [
  { name: "BSH-1", batch_no: "BATCH-20260401-001", from_status: "Awaiting Intake", to_status: "Live",         changed_by: "intake@terp.io",   changed_at: dt(-22, 10), notes: "Initial intake completed" },
  { name: "BSH-2", batch_no: "BATCH-20260401-002", from_status: "Awaiting Intake", to_status: "Live",         changed_by: "intake@terp.io",   changed_at: dt(-22, 10, 40), notes: "" },
  { name: "BSH-3", batch_no: "BATCH-20260408-003", from_status: "Awaiting Intake", to_status: "Photographed", changed_by: "studio@terp.io",   changed_at: dt(-13, 14),    notes: "Photos complete" },
  { name: "BSH-4", batch_no: "BATCH-20260415-004", from_status: "Awaiting Intake", to_status: "Ready to Ship",changed_by: "shipping@terp.io", changed_at: dt(-1, 11),     notes: "Allocated to SO-00018" },
];

export const workflow_queue_status = [
  { status_name: "Awaiting Intake",  status_color: "gray",   sort_order: 10, is_terminal: false, description: "Just received, awaiting check-in" },
  { status_name: "Live",             status_color: "green",  sort_order: 20, is_terminal: false, description: "Available for sale"               },
  { status_name: "Photographed",     status_color: "blue",   sort_order: 30, is_terminal: false, description: "Photos captured"                  },
  { status_name: "Ready to Ship",    status_color: "purple", sort_order: 40, is_terminal: false, description: "Picked and packed"                },
  { status_name: "Sold Out",         status_color: "yellow", sort_order: 90, is_terminal: true,  description: "No remaining qty"                 },
  { status_name: "Archived",         status_color: "red",    sort_order: 95, is_terminal: true,  description: "Removed from rotation"            },
];

export const delivery_note = [
  { name: "DN-0101", customer: "Atlas Dispensary",   sales_order: "SO-00010", posting_date: d(-2), delivery_date: d(-1), items_count: 6, status: "Completed" },
  { name: "DN-0102", customer: "Sunrise Collective", sales_order: "SO-00011", posting_date: d(-1), delivery_date: d(1),  items_count: 4, status: "To Bill"   },
  { name: "DN-0103", customer: "Verde Markets",      sales_order: "SO-00015", posting_date: d(0),  delivery_date: d(5),  items_count: 12, status: "Draft"     },
];

export const stock_entry = [
  { name: "SE-0201", stock_entry_type: "Material Transfer", from_warehouse: "Primary Vault", to_warehouse: "Shop Floor", posting_date: d(-4), status: "Submitted" },
  { name: "SE-0202", stock_entry_type: "Material Issue",    from_warehouse: "Primary Vault", to_warehouse: null,         posting_date: d(-1), status: "Submitted" },
];

export const stock_ledger_entry = [
  { name: "SLE-1", item_code: "FL-BLUEDREAM-28", batch_no: "BATCH-20260401-001", warehouse: "Primary Vault", actual_qty: 120, qty_after_transaction: 120, posting_date: d(-22), voucher_type: "Purchase Receipt" },
  { name: "SLE-2", item_code: "FL-BLUEDREAM-28", batch_no: "BATCH-20260401-001", warehouse: "Primary Vault", actual_qty: -28, qty_after_transaction: 92,  posting_date: d(-6),  voucher_type: "Delivery Note" },
  { name: "SLE-3", item_code: "FL-NL-28",        batch_no: "BATCH-20260401-002", warehouse: "Primary Vault", actual_qty: 80,  qty_after_transaction: 80,  posting_date: d(-22), voucher_type: "Purchase Receipt" },
  { name: "SLE-4", item_code: "FL-NL-28",        batch_no: "BATCH-20260401-002", warehouse: "Primary Vault", actual_qty: -20, qty_after_transaction: 60,  posting_date: d(-1),  voucher_type: "Delivery Note" },
];

/** PROCUREMENT */
export const purchase_order = [
  { name: "PO-0201", supplier: "Emerald Grow Partners", transaction_date: d(-25), schedule_date: d(-23), grand_total: 10_800, status: "Completed"       },
  { name: "PO-0202", supplier: "Lakeview Farms",        transaction_date: d(-24), schedule_date: d(-22), grand_total: 6_800,  status: "Completed"       },
  { name: "PO-0203", supplier: "Tumbleweed Ranch",      transaction_date: d(-18), schedule_date: d(-15), grand_total: 4_590,  status: "Completed"       },
  { name: "PO-0204", supplier: "Alpine Heights",        transaction_date: d(-10), schedule_date: d(-8),  grand_total: 4_920,  status: "To Receive"      },
  { name: "PO-0205", supplier: "Lighthouse Labs",       transaction_date: d(-6),  schedule_date: d(-5),  grand_total: 3_080,  status: "To Bill"         },
  { name: "PO-0206", supplier: "Drydale Gardens",       transaction_date: d(-4),  schedule_date: d(-3),  grand_total: 1_800,  status: "To Receive and Bill" },
  { name: "PO-0207", supplier: "Emerald Grow Partners", transaction_date: d(-2),  schedule_date: d(3),   grand_total: 5_940,  status: "Draft"           },
];
export const purchase_receipt = [
  { name: "PR-0301", supplier: "Emerald Grow Partners", posting_date: d(-22), grand_total: 10_800, status: "Completed" },
  { name: "PR-0302", supplier: "Lakeview Farms",        posting_date: d(-22), grand_total: 6_800,  status: "Completed" },
  { name: "PR-0303", supplier: "Tumbleweed Ranch",      posting_date: d(-15), grand_total: 4_590,  status: "Completed" },
  { name: "PR-0304", supplier: "Lighthouse Labs",       posting_date: d(-5),  grand_total: 3_080,  status: "To Bill"   },
];
export const purchase_invoice = [
  // `due_now` surfaces in the Procurement sheet — it means the linked
  // batch is sold out (or nearly so), so per the interview nugget the
  // payable should jump to the top of the supplier's queue regardless
  // of the actual due date.
  { name: "PI-0401", supplier: "Emerald Grow Partners", posting_date: d(-21), due_date: d(9),  grand_total: 10_800, outstanding_amount: 0,     status: "Paid",      due_now: false },
  { name: "PI-0402", supplier: "Lakeview Farms",        posting_date: d(-21), due_date: d(9),  grand_total: 6_800,  outstanding_amount: 0,     status: "Paid",      due_now: false },
  { name: "PI-0403", supplier: "Tumbleweed Ranch",      posting_date: d(-14), due_date: d(16), grand_total: 4_590,  outstanding_amount: 4_590, status: "Submitted", due_now: true  },
  { name: "PI-0404", supplier: "Lighthouse Labs",       posting_date: d(-4),  due_date: d(26), grand_total: 3_080,  outstanding_amount: 3_080, status: "Submitted", due_now: false },
  { name: "PI-0405", supplier: "Drydale Gardens",       posting_date: d(-3),  due_date: d(-1), grand_total: 1_800,  outstanding_amount: 1_800, status: "Overdue",   due_now: true  },
];
export const supplier_harvest_reminder = [
  { name: "HR-0001", supplier: "Emerald Grow Partners", reminder_date: d(6),  strain: "Blue Dream",  expected_quantity: 600, status: "Pending" },
  { name: "HR-0002", supplier: "Lakeview Farms",        reminder_date: d(18), strain: "Northern Lights", expected_quantity: 400, status: "Pending" },
  { name: "HR-0003", supplier: "Tumbleweed Ranch",      reminder_date: d(9),  strain: "Sour Diesel", expected_quantity: 500, status: "Sent"    },
];

/** FINANCE */
export const sales_invoice = [
  { name: "INV-00121", customer: "Atlas Dispensary",     posting_date: d(-2), due_date: d(28), grand_total: 12_400, outstanding_amount: 12_400, status: "Unpaid",      has_dispute: false },
  { name: "INV-00122", customer: "Sunrise Collective",   posting_date: d(-5), due_date: d(10), grand_total: 7_850,  outstanding_amount: 7_850,  status: "Unpaid",      has_dispute: false },
  { name: "INV-00123", customer: "Green Lotus Wellness", posting_date: d(-10),due_date: d(20), grand_total: 18_900, outstanding_amount: 6_300,  status: "Partly Paid", has_dispute: false },
  { name: "INV-00124", customer: "Verde Markets",        posting_date: d(-12),due_date: d(-2), grand_total: 28_400, outstanding_amount: 14_200, status: "Overdue",     has_dispute: true  },
  { name: "INV-00125", customer: "Humboldt House",       posting_date: d(-1), due_date: d(29), grand_total: 14_750, outstanding_amount: 14_750, status: "Unpaid",      has_dispute: false },
  { name: "INV-00126", customer: "Cascade Supply",       posting_date: d(-14),due_date: d(-4), grand_total: 3_600,  outstanding_amount: 3_600,  status: "Overdue",     has_dispute: false },
  { name: "INV-00127", customer: "Mission Leaf",         posting_date: d(-6), due_date: d(24), grand_total: 9_300,  outstanding_amount: 4_650,  status: "Partly Paid", has_dispute: false },
  { name: "INV-00128", customer: "Coastline Canna",      posting_date: d(-20),due_date: d(-10),grand_total: 2_100,  outstanding_amount: 0,      status: "Paid",        has_dispute: false },
];
export const payment_entry = [
  { name: "PE-0501", payment_type: "Receive", party_type: "Customer", party: "Green Lotus Wellness", posting_date: d(-4),  paid_amount: 12_600, mode_of_payment: "ACH",    reference_no: "ACH-77112" },
  { name: "PE-0502", payment_type: "Receive", party_type: "Customer", party: "Verde Markets",        posting_date: d(-1),  paid_amount: 14_200, mode_of_payment: "Wire",   reference_no: "WIRE-24X0" },
  { name: "PE-0503", payment_type: "Receive", party_type: "Customer", party: "Mission Leaf",         posting_date: d(-1),  paid_amount: 4_650,  mode_of_payment: "Credit Card", reference_no: "STRP-22A" },
  { name: "PE-0504", payment_type: "Pay",     party_type: "Supplier", party: "Emerald Grow Partners",posting_date: d(-19), paid_amount: 10_800, mode_of_payment: "Wire",   reference_no: "WIRE-AP1"  },
  { name: "PE-0505", payment_type: "Receive", party_type: "Customer", party: "Coastline Canna",      posting_date: d(-10), paid_amount: 2_100,  mode_of_payment: "Cash",   reference_no: ""          },
];
export const invoice_dispute = [
  { name: "DISP-0001", sales_invoice: "INV-00124", customer: "Verde Markets",     dispute_reason: "Wrong Items", status: "Under Review" },
];
export const installment_payment = [
  { name: "INST-0001", sales_invoice: "INV-00123", customer: "Green Lotus Wellness", status: "Active" },
];
export const referral_credit = [
  { name: "RC-0001", referrer_customer: "Atlas Dispensary",    referred_customer: "Redwood Cannabis",  credit_amount: 500, status: "Applied" },
  { name: "RC-0002", referrer_customer: "Green Lotus Wellness", referred_customer: "Mission Leaf",     credit_amount: 250, status: "Pending" },
];
export const crypto_payment = [
  { name: "CP-0001", payment_entry: "PE-0502", crypto_currency: "USDC", usd_amount: 14_200, transaction_hash: "0xabc1234…8ef" },
];
export const transaction_fee = [
  { name: "TF-0001", payment_entry: "PE-0503", fee_type: "Credit Card Processing", fee_amount: 134.85, charged_to: "Company"  },
  { name: "TF-0002", payment_entry: "PE-0502", fee_type: "Wire",                   fee_amount: 25,      charged_to: "Customer" },
];
export const journal_entry = [
  { name: "JE-0001", voucher_type: "Journal Entry", posting_date: d(-14), total_debit: 28_400, total_credit: 28_400, status: "Submitted" },
  { name: "JE-0002", voucher_type: "Contra Entry",  posting_date: d(-7),  total_debit: 3_500,  total_credit: 3_500,  status: "Submitted" },
];
export const gl_entry = [
  { name: "GL-0001", account: "1100 - Accounts Receivable", debit: 12_400, credit: 0,     posting_date: d(-2),  voucher_type: "Sales Invoice",   voucher_no: "INV-00121" },
  { name: "GL-0002", account: "4000 - Sales",               debit: 0,      credit: 12_400,posting_date: d(-2),  voucher_type: "Sales Invoice",   voucher_no: "INV-00121" },
  { name: "GL-0003", account: "1000 - Cash",                debit: 12_600, credit: 0,     posting_date: d(-4),  voucher_type: "Payment Entry",   voucher_no: "PE-0501"  },
  { name: "GL-0004", account: "1100 - Accounts Receivable", debit: 0,      credit: 12_600,posting_date: d(-4),  voucher_type: "Payment Entry",   voucher_no: "PE-0501"  },
];
export const account = [
  { name: "1000 - Cash",                 account_type: "Asset",    is_group: false, balance: 182_400 },
  { name: "1100 - Accounts Receivable",  account_type: "Asset",    is_group: false, balance: 91_280 },
  { name: "1200 - Inventory",            account_type: "Asset",    is_group: false, balance: 303_800 },
  { name: "2000 - Accounts Payable",     account_type: "Liability",is_group: false, balance: 29_280  },
  { name: "3000 - Equity",               account_type: "Equity",   is_group: true,  balance: 410_520 },
  { name: "4000 - Sales",                account_type: "Income",   is_group: false, balance: 612_400 },
  { name: "5000 - COGS",                 account_type: "Expense",  is_group: false, balance: 352_180 },
];
export const bank_account = [
  { name: "Chase Operating",     bank: "Chase",           account_number: "****3311", balance: 142_400 },
  { name: "First Citizens Savings", bank: "First Citizens", account_number: "****8820", balance: 200_000 },
];
export const bank_transaction = [
  { name: "BT-0001", bank_account: "Chase Operating", date: d(-1),  deposit: 14_200, withdrawal: 0,     reconciled: true  },
  { name: "BT-0002", bank_account: "Chase Operating", date: d(-4),  deposit: 12_600, withdrawal: 0,     reconciled: true  },
  { name: "BT-0003", bank_account: "Chase Operating", date: d(-19), deposit: 0,      withdrawal: 10_800,reconciled: true  },
  { name: "BT-0004", bank_account: "Chase Operating", date: d(0),   deposit: 4_650,  withdrawal: 0,     reconciled: false },
];
export const cash_location = [
  { location_name: "Primary Vault Safe", warehouse: "Primary Vault", current_balance: 18_400, is_active: true },
  { location_name: "Shop Floor Register", warehouse: "Shop Floor",    current_balance: 2_180,  is_active: true },
];
export const shift_audit = [
  { name: "SA-0001", cash_location: "Shop Floor Register", shift_open_by: "cashier1@terp.io", shift_open_at: dt(-1, 9), shift_close_by: "cashier1@terp.io", shift_close_at: dt(-1, 17), opening_balance: 500, closing_balance: 2_180, expected_balance: 2_200, variance: -20 },
  { name: "SA-0002", cash_location: "Shop Floor Register", shift_open_by: "cashier2@terp.io", shift_open_at: dt(0, 9),  shift_close_by: null,               shift_close_at: null,         opening_balance: 500, closing_balance: null,  expected_balance: null,  variance: null },
];
export const payment_followup_template = [
  { template_name: "Overdue Day 1",  channel: "Email", subject_template: "Your TERP invoice {{invoice}} is due"        },
  { template_name: "Overdue Day 7",  channel: "SMS",   subject_template: "Friendly reminder — invoice {{invoice}}"     },
  { template_name: "Overdue Day 14", channel: "Note",  subject_template: "Escalate internally: {{customer}} past due" },
];
export const credit_adjustment = [
  { name: "CA-0001", customer: "Atlas Dispensary",   adjustment_type: "Manual Credit",        amount: 500, approved_by: "admin@terp.io", applied_date: d(-10) },
  { name: "CA-0002", customer: "Cascade Supply",     adjustment_type: "Refund Credit",        amount: 120, approved_by: "admin@terp.io", applied_date: d(-1) },
];
export const credit_limit = [
  { customer: "Atlas Dispensary",      credit_limit: 50_000, enforcement_mode: "WARNING",    current_exposure: 28_400, available_credit: 21_600 },
  { customer: "Sunrise Collective",    credit_limit: 40_000, enforcement_mode: "SOFT_BLOCK", current_exposure: 42_500, available_credit: -2_500 },
  { customer: "High Meadow Co.",       credit_limit: 40_000, enforcement_mode: "HARD_BLOCK", current_exposure: 51_200, available_credit: -11_200 },
  { customer: "Green Lotus Wellness",  credit_limit: 60_000, enforcement_mode: "WARNING",    current_exposure: 12_800, available_credit: 47_200 },
  { customer: "Verde Markets",         credit_limit: 75_000, enforcement_mode: "WARNING",    current_exposure: 17_500, available_credit: 57_500 },
  { customer: "Redwood Cannabis",      credit_limit: 30_000, enforcement_mode: "SOFT_BLOCK", current_exposure: 29_800, available_credit: 200    },
];
export const credit_override_request = [
  { name: "COR-0011", customer: "Sunrise Collective", sales_order: "SO-00011", requested_by: "rep.khan@terp.io", requested_amount: 7_850,  current_limit: 40_000, status: "Pending",  reviewed_by: null },
  { name: "COR-0012", customer: "High Meadow Co.",    sales_order: "SO-00012", requested_by: "rep.ruiz@terp.io", requested_amount: 5_200,  current_limit: 40_000, status: "Pending",  reviewed_by: null },
  { name: "COR-0013", customer: "Redwood Cannabis",   sales_order: "SO-00016", requested_by: "rep.ruiz@terp.io", requested_amount: 6_150,  current_limit: 30_000, status: "Approved", reviewed_by: "admin@terp.io" },
  { name: "COR-0014", customer: "Sunrise Collective", sales_order: null,       requested_by: "rep.khan@terp.io", requested_amount: 2_000,  current_limit: 40_000, status: "Rejected", reviewed_by: "admin@terp.io" },
];

/** COMMUNICATION + VIP */
export const client_communication_log = [
  { name: "COM-0001", customer: "Atlas Dispensary",   comm_type: "Call",  subject: "New drop preview",      comm_date: dt(-2, 10), logged_by: "rep.ruiz@terp.io", follow_up_date: d(1) },
  { name: "COM-0002", customer: "Green Lotus Wellness", comm_type: "Email", subject: "VIP tier upgrade",    comm_date: dt(-3, 15), logged_by: "rep.khan@terp.io", follow_up_date: d(4) },
  { name: "COM-0003", customer: "Verde Markets",      comm_type: "Note",  subject: "Dispute on INV-00124",  comm_date: dt(-1, 11), logged_by: "admin@terp.io",    follow_up_date: d(2) },
];
export const vip_portal_configuration = [
  { customer: "Atlas Dispensary",     portal_enabled: true, enable_live_catalog: true, enable_live_shopping: true, enable_marketplace: true,  enable_appointments: true,  enable_leaderboard: true, enable_referrals: true },
  { customer: "Green Lotus Wellness", portal_enabled: true, enable_live_catalog: true, enable_live_shopping: true, enable_marketplace: true,  enable_appointments: true,  enable_leaderboard: true, enable_referrals: true },
  { customer: "Humboldt House",       portal_enabled: true, enable_live_catalog: true, enable_live_shopping: false, enable_marketplace: true, enable_appointments: false, enable_leaderboard: true, enable_referrals: false },
];

/** ADMIN */
export const user = [
  { name: "admin@terp.io",    full_name: "Alex Admin",    email: "admin@terp.io",     roles: "System Manager, Accounts Manager", last_login: dt(0, 8, 15),  enabled: true },
  { name: "rep.ruiz@terp.io", full_name: "Sofia Ruiz",    email: "rep.ruiz@terp.io",  roles: "Sales Rep, Catalogue Manager",      last_login: dt(0, 9, 0),   enabled: true },
  { name: "rep.khan@terp.io", full_name: "Adil Khan",     email: "rep.khan@terp.io",  roles: "Sales Rep",                          last_login: dt(0, 7, 45),  enabled: true },
  { name: "intake@terp.io",   full_name: "Mira Patel",    email: "intake@terp.io",    roles: "Intake Clerk, Photography",          last_login: dt(-1, 14, 0), enabled: true },
  { name: "studio@terp.io",   full_name: "Jonah Kim",     email: "studio@terp.io",    roles: "Photography",                         last_login: dt(-1, 11, 0), enabled: true },
  { name: "cashier1@terp.io", full_name: "Dana Cash",     email: "cashier1@terp.io",  roles: "Cash Manager",                        last_login: dt(-1, 17, 5), enabled: true },
  { name: "cashier2@terp.io", full_name: "Iris Chen",     email: "cashier2@terp.io",  roles: "Cash Manager",                        last_login: dt(0, 9, 10),  enabled: true },
];
export const role = [
  { name: "System Manager",     desk_access: true, members_count: 1 },
  { name: "Accounts Manager",   desk_access: true, members_count: 1 },
  { name: "Sales Rep",          desk_access: true, members_count: 2 },
  { name: "Catalogue Manager",  desk_access: true, members_count: 1 },
  { name: "Intake Clerk",       desk_access: true, members_count: 1 },
  { name: "Photography",        desk_access: true, members_count: 2 },
  { name: "Cash Manager",       desk_access: true, members_count: 2 },
  { name: "VIP Customer",       desk_access: false,members_count: 8 },
];
export const role_permission = [
  { for_value: "Credit Override Request", role: "Accounts Manager", read: true, write: true  },
  { for_value: "Credit Override Request", role: "Sales Rep",        read: true, write: false },
  { for_value: "COGS Rule",               role: "System Manager",   read: true, write: true  },
  { for_value: "Pricing Profile",         role: "Sales Rep",        read: true, write: false },
  { for_value: "Organization Settings",   role: "System Manager",   read: true, write: true  },
];
export const feature_flag = [
  { flag_name: "LIVE_SHOPPING",      description: "Enable live shopping sessions",        is_enabled: true  },
  { flag_name: "CRYPTO_PAYMENTS",    description: "Allow crypto settlement on invoices",  is_enabled: true  },
  { flag_name: "SHARED_SALES_SHEET", description: "Public share tokens for catalogues",   is_enabled: true  },
  { flag_name: "LEADERBOARD",        description: "VIP customer leaderboard computation", is_enabled: true  },
  { flag_name: "VIP_REFERRAL_CREDITS", description: "Track referral credits in portal",    is_enabled: true  },
  { flag_name: "AUTO_FOLLOWUP_SMS",  description: "Auto-send overdue SMS at day 7",       is_enabled: false },
];
export const organization_settings_single = {
  show_grade_field: true,
  require_grade: false,
  show_expected_delivery_date: true,
  enable_packaged_unit_type: true,
  cogs_display_mode: "Admin Only",
  show_cogs_in_orders: true,
  show_margin_in_orders: true,
  default_warehouse: "Primary Vault",
};
export const leaderboard_weight_config = [
  { metric_name: "Financial (payment velocity)", weight_pct: 0.40, description: "Weighted by days-to-pay and consistency" },
  { metric_name: "Visit Frequency",              weight_pct: 0.20, description: "Portal visits, events attended"           },
  { metric_name: "Payment Behavior",             weight_pct: 0.20, description: "On-time payment rate; dispute rate inverse" },
  { metric_name: "Growth",                       weight_pct: 0.10, description: "Month-over-month revenue"                 },
  { metric_name: "Referrals",                    weight_pct: 0.10, description: "Active referred accounts"                 },
];
export const appointment_request = [
  { name: "APT-0001", customer: "Atlas Dispensary",    requested_date: d(1),  requested_time: "10:00", appointment_type: "Delivery",      status: "Approved"  },
  { name: "APT-0002", customer: "Sunrise Collective",  requested_date: d(2),  requested_time: "13:30", appointment_type: "Sales Meeting", status: "Pending"   },
  { name: "APT-0003", customer: "Verde Markets",       requested_date: d(3),  requested_time: "09:00", appointment_type: "Delivery",      status: "Pending"   },
  { name: "APT-0004", customer: "Humboldt House",      requested_date: d(5),  requested_time: "16:00", appointment_type: "Sales Meeting", status: "Approved"  },
];
export const time_off_request = [
  { name: "TOR-0001", user: "rep.ruiz@terp.io", from_date: d(10), to_date: d(14), status: "Pending"  },
  { name: "TOR-0002", user: "studio@terp.io",   from_date: d(-4), to_date: d(-2), status: "Approved" },
];
export const hour_tracking = [
  { name: "HT-0001", user: "cashier1@terp.io", clock_in: dt(-1, 9),  clock_out: dt(-1, 17), break_minutes: 30, hours_worked: 7.5 },
  { name: "HT-0002", user: "cashier2@terp.io", clock_in: dt(0, 9),   clock_out: null,       break_minutes: 0,  hours_worked: 0   },
  { name: "HT-0003", user: "intake@terp.io",   clock_in: dt(-1, 8),  clock_out: dt(-1, 16), break_minutes: 45, hours_worked: 7.25 },
];
export const audit_log = [
  { name: "AL-0001", doctype: "Credit Override Request", document: "COR-0013", action: "Submit", user: "admin@terp.io",    at: dt(-1, 12, 45) },
  { name: "AL-0002", doctype: "Sales Invoice",           document: "INV-00124",action: "Update", user: "admin@terp.io",    at: dt(-1, 10, 2)  },
  { name: "AL-0003", doctype: "Sales Catalogue",         document: "CAT-0102", action: "Submit", user: "rep.khan@terp.io", at: dt(-2, 14, 12) },
];
export const error_log = [
  { name: "ERR-0001", method: "credit_service.check_credit", error: "Recursion limit hit on Customer doc",               seen: true,  at: dt(-3, 9, 4)  },
  { name: "ERR-0002", method: "pricing_service.apply",       error: "Missing vendor_range on Batch BATCH-20260408-003",  seen: false, at: dt(-1, 17, 22) },
];

/** NOTIFICATIONS */
export const notifications = [
  { id: "n1", kind: "credit_override", title: "Credit override requested", body: "Sunrise Collective (SO-00011) · $7,850 · WARNING", at: dt(-1, 9, 5),  unread: true  },
  { id: "n2", kind: "credit_override", title: "Credit override requested", body: "High Meadow Co. (SO-00012) · $5,200 · HARD_BLOCK", at: dt(-1, 11, 30),unread: true  },
  { id: "n3", kind: "sample_due",      title: "Sample overdue",            body: "Cascade Supply · CC-LIVE-1G · due today",          at: dt(0, 8, 0),  unread: true  },
  { id: "n4", kind: "need_matched",    title: "New match found",           body: "Verde Markets · Sour Diesel · 2000g · 90% match",  at: dt(-1, 15, 0),unread: false },
  { id: "n5", kind: "harvest_due",     title: "Harvest reminder",          body: "Emerald Grow Partners · Blue Dream · in 6d",       at: dt(0, 8, 10), unread: false },
  { id: "n6", kind: "invoice_dispute", title: "Invoice dispute opened",    body: "Verde Markets · INV-00124 · Wrong Items",          at: dt(-1, 11, 0),unread: false },
];

/** DASHBOARD KPIs (derived/simulated) */
export const kpi = {
  orders_today: 4,
  revenue_30d: 184_200,
  receivables: 91_280,
  payables: 29_280,
  overdue_count: 2,
  overdue_value: 17_800,
  live_batches: 6,
  photography_backlog: 4,
  harvest_reminders_7d: 2,
  override_queue: 2,
};

/** REPORTS */
export const client_leaderboard = [
  { rank: 1, customer: "Green Lotus Wellness", master_score: 94.1, financial: 96, engagement: 92, reliability: 98, growth: 88, trend: "up"   },
  { rank: 2, customer: "Humboldt House",       master_score: 89.3, financial: 92, engagement: 86, reliability: 94, growth: 80, trend: "up"   },
  { rank: 3, customer: "Atlas Dispensary",     master_score: 87.0, financial: 89, engagement: 88, reliability: 90, growth: 78, trend: "flat" },
  { rank: 4, customer: "Mission Leaf",         master_score: 81.5, financial: 84, engagement: 78, reliability: 85, growth: 75, trend: "up"   },
  { rank: 5, customer: "Cascade Supply",       master_score: 78.8, financial: 80, engagement: 82, reliability: 84, growth: 64, trend: "up"   },
  { rank: 6, customer: "Redwood Cannabis",     master_score: 71.2, financial: 68, engagement: 74, reliability: 78, growth: 62, trend: "down" },
  { rank: 7, customer: "Coastline Canna",      master_score: 68.0, financial: 72, engagement: 68, reliability: 70, growth: 58, trend: "flat" },
  { rank: 8, customer: "Verde Markets",        master_score: 62.5, financial: 60, engagement: 70, reliability: 62, growth: 58, trend: "down" },
  { rank: 9, customer: "Sunrise Collective",   master_score: 58.1, financial: 54, engagement: 64, reliability: 58, growth: 56, trend: "down" },
  { rank: 10,customer: "High Meadow Co.",      master_score: 42.0, financial: 32, engagement: 52, reliability: 40, growth: 50, trend: "down" },
];
export const inventory_aging = [
  { batch: "BATCH-20260401-001", item: "FL-BLUEDREAM-28", warehouse: "Primary Vault", qty: 92,  age_days: 22, age_bucket: "15-30d", value: 8_280 },
  { batch: "BATCH-20260401-002", item: "FL-NL-28",        warehouse: "Primary Vault", qty: 60,  age_days: 22, age_bucket: "15-30d", value: 5_100 },
  { batch: "BATCH-20260408-003", item: "FL-SD-28",        warehouse: "Primary Vault", qty: 45,  age_days: 15, age_bucket: "15-30d", value: 4_590 },
  { batch: "BATCH-20260415-004", item: "FL-OG-28",        warehouse: "Primary Vault", qty: 60,  age_days: 8,  age_bucket: "0-14d",  value: 4_920 },
  { batch: "BATCH-20260416-005", item: "PR-GELATO-1G",    warehouse: "Primary Vault", qty: 1000,age_days: 7,  age_bucket: "0-14d",  value: 2_500 },
  { batch: "BATCH-20260418-006", item: "CC-LIVE-1G",      warehouse: "Lab Vault",      qty: 220,age_days: 5,  age_bucket: "0-14d",  value: 3_080 },
  { batch: "BATCH-20260419-007", item: "VP-LIVE-5G",      warehouse: "Lab Vault",      qty: 480,age_days: 4,  age_bucket: "0-14d",  value: 4_320 },
  { batch: "BATCH-20260420-008", item: "ED-GUMMY-10",     warehouse: "Primary Vault", qty: 360, age_days: 3,  age_bucket: "0-14d",  value: 1_800 },
];
export const revenue_trends = [
  { period: "Feb", revenue: 142_600, orders: 68 },
  { period: "Mar", revenue: 168_400, orders: 79 },
  { period: "Apr", revenue: 184_200, orders: 87 },
];
export const shrinkage = [
  { batch: "BATCH-20260401-001", item: "FL-BLUEDREAM-28", expected: 120, actual: 92, shrinkage: 0.3, reason: "Sold" },
  { batch: "BATCH-20260401-002", item: "FL-NL-28",        expected: 80,  actual: 60, shrinkage: 0.25, reason: "Sold" },
  { batch: "BATCH-20260408-003", item: "FL-SD-28",        expected: 45,  actual: 45, shrinkage: 0,    reason: "—"    },
];
export const top_clients = [
  { rank: 1, customer: "Green Lotus Wellness", revenue: 58_400, orders: 14, aov: 4_171, growth: 0.18 },
  { rank: 2, customer: "Verde Markets",        revenue: 42_100, orders: 6,  aov: 7_016, growth: 0.08 },
  { rank: 3, customer: "Atlas Dispensary",     revenue: 38_300, orders: 11, aov: 3_481, growth: 0.12 },
  { rank: 4, customer: "Humboldt House",       revenue: 22_900, orders: 6,  aov: 3_816, growth: 0.22 },
  { rank: 5, customer: "Mission Leaf",         revenue: 18_400, orders: 7,  aov: 2_628, growth: 0.09 },
];

/** Single source of every rowset, keyed by schema slug. */
export const DATA: Record<string, any[]> = {
  "thca-strain":               thca_strain,
  "product-grade":             product_grade,
  "customer":                  customer,
  "supplier":                  supplier,
  "item":                      item,
  "batch":                     batch,
  "intake-session":            intake_session,
  "warehouse":                 warehouse,
  "sales-order":               sales_order,
  "quotation":                 quotation,
  "sales-return":              sales_return,
  "sales-catalogue":           sales_catalogue,
  "live-shopping-session":     live_shopping_session,
  "client-need":               client_need,
  "supplier-supply":           supplier_supply,
  "match-record":              match_record,
  "pricing-profile":           pricing_profile,
  "cogs-rule":                 cogs_rule,
  "photography-queue":         photography_queue,
  "sample-request":            sample_request,
  "batch-status-history":      batch_status_history,
  "workflow-queue-status":     workflow_queue_status,
  "delivery-note":             delivery_note,
  "stock-entry":               stock_entry,
  "stock-ledger-entry":        stock_ledger_entry,
  "purchase-order":            purchase_order,
  "purchase-receipt":          purchase_receipt,
  "purchase-invoice":          purchase_invoice,
  "supplier-harvest-reminder": supplier_harvest_reminder,
  "sales-invoice":             sales_invoice,
  "payment-entry":             payment_entry,
  "invoice-dispute":           invoice_dispute,
  "installment-payment":       installment_payment,
  "referral-credit":           referral_credit,
  "crypto-payment":            crypto_payment,
  "transaction-fee":           transaction_fee,
  "journal-entry":             journal_entry,
  "gl-entry":                  gl_entry,
  "account":                   account,
  "bank-account":              bank_account,
  "bank-transaction":          bank_transaction,
  "cash-location":             cash_location,
  "shift-audit":               shift_audit,
  "payment-followup-template": payment_followup_template,
  "credit-adjustment":         credit_adjustment,
  "credit-limit":              credit_limit,
  "credit-override-request":   credit_override_request,
  "client-communication-log":  client_communication_log,
  "vip-portal-configuration":  vip_portal_configuration,
  "user":                      user,
  "role":                      role,
  "role-permission":           role_permission,
  "feature-flag":              feature_flag,
  "leaderboard-weight-config": leaderboard_weight_config,
  "appointment-request":       appointment_request,
  "time-off-request":          time_off_request,
  "hour-tracking":             hour_tracking,
  "audit-log":                 audit_log,
  "error-log":                 error_log,
};

export const sheetOfSlug = (slug: string): Sheet | null => {
  // lightweight, avoid importing schema cycle
  const map: Record<string, Sheet> = {
    "sales-order":"sales","quotation":"sales","sales-return":"sales","sales-catalogue":"sales",
    "live-shopping-session":"sales","client-need":"sales","supplier-supply":"sales","match-record":"sales",
    "pricing-profile":"sales","cogs-rule":"sales",
    "batch":"inventory","intake-session":"inventory","stock-entry":"inventory","delivery-note":"inventory",
    "photography-queue":"inventory","sample-request":"inventory","batch-status-history":"inventory",
    "workflow-queue-status":"inventory","warehouse":"inventory","stock-ledger-entry":"inventory",
    "item":"inventory","thca-strain":"inventory","product-grade":"inventory",
    "purchase-order":"procurement","purchase-receipt":"procurement","supplier":"procurement",
    "supplier-harvest-reminder":"procurement","purchase-invoice":"procurement",
    "sales-invoice":"finance","payment-entry":"finance","invoice-dispute":"finance",
    "installment-payment":"finance","referral-credit":"finance","crypto-payment":"finance",
    "transaction-fee":"finance","journal-entry":"finance","gl-entry":"finance","account":"finance",
    "bank-account":"finance","bank-transaction":"finance","cash-location":"finance","shift-audit":"finance",
    "payment-followup-template":"finance","credit-adjustment":"credit",
    "customer":"relationships","client-communication-log":"relationships","vip-portal-configuration":"relationships",
    "credit-limit":"credit","credit-override-request":"credit",
    "user":"admin","role":"admin","role-permission":"admin","feature-flag":"admin",
    "organization-settings":"admin","leaderboard-weight-config":"admin",
    "appointment-request":"admin","time-off-request":"admin","hour-tracking":"admin",
    "audit-log":"admin","error-log":"admin",
  };
  return (map[slug] as Sheet) ?? null;
};

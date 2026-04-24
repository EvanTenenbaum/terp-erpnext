// TERP — universal DocType schema registry.
// Every DocType surfaced in the Numbers-style UI is defined here so the
// generic TableBrowser route (/t/:slug) can render ANY table we have not
// hand-built, guaranteeing zero functionality loss versus the ERPNext Desk.

export type FieldType =
  | "data"
  | "longtext"
  | "int"
  | "float"
  | "currency"
  | "percent"
  | "date"
  | "datetime"
  | "time"
  | "check"
  | "select"
  | "link"
  | "table"
  | "attach";

export type Sheet =
  | "sales"
  | "inventory"
  | "procurement"
  | "finance"
  | "relationships"
  | "credit"
  | "admin"
  | "reports"
  | "vip";

export interface FieldDef {
  name: string;
  label: string;
  type: FieldType;
  required?: boolean;
  options?: string[] | string; // for select / link (link → target doctype slug)
  width?: number;
  hint?: string;
  readonly?: boolean;
}

export interface DocTypeDef {
  slug: string; // kebab-case, used in routes
  label: string;
  singular: string;
  sheet: Sheet;
  group?: string;
  namingPrefix?: string;
  defaultView?: "table" | "kanban" | "calendar" | "form" | "chart" | "tree";
  altViews?: Array<"table" | "kanban" | "calendar" | "form" | "chart" | "tree">;
  statusField?: string;
  colorField?: string;
  titleField?: string;
  fields: FieldDef[];
  rowActions?: string[];
  description?: string;
}

/** All DocTypes — custom + the ERPNext builtins we surface. */
export const DOCTYPES: DocTypeDef[] = [
  // ──────── SALES ────────
  {
    slug: "sales-order", label: "Sales Orders", singular: "Sales Order",
    sheet: "sales", group: "Orders & Quotes", namingPrefix: "SO-",
    defaultView: "table", altViews: ["kanban", "calendar", "form"],
    statusField: "status", titleField: "name",
    fields: [
      { name: "name", label: "SO #", type: "data", width: 110, readonly: true },
      { name: "customer", label: "Customer", type: "link", options: "customer", width: 200, required: true },
      { name: "transaction_date", label: "Date", type: "date", width: 110 },
      { name: "delivery_date", label: "Delivery", type: "date", width: 110 },
      { name: "grand_total", label: "Total", type: "currency", width: 120 },
      { name: "status", label: "Status", type: "select",
        options: ["Draft","To Deliver and Bill","To Deliver","To Bill","Completed","Cancelled"], width: 150 },
      { name: "credit_status", label: "Credit", type: "select",
        options: ["allowed","warning","requires_override","blocked"], width: 120 },
      { name: "pricing_profile", label: "Pricing Profile", type: "link", options: "pricing-profile", width: 160 },
      { name: "order_source", label: "Source", type: "select",
        options: ["Desk","VIP Portal","Live Shopping","Catalogue"], width: 130 },
      { name: "referral_credit_applied", label: "Referral Credit", type: "currency", width: 120 },
    ],
    rowActions: ["Open","Convert to Invoice","Credit Check","Print","Cancel"],
  },
  {
    slug: "quotation", label: "Quotations", singular: "Quotation",
    sheet: "sales", group: "Orders & Quotes", namingPrefix: "QTN-",
    defaultView: "table", altViews: ["form"], statusField: "status",
    fields: [
      { name: "name", label: "Quote #", type: "data", width: 120 },
      { name: "party_name", label: "Customer", type: "link", options: "customer", width: 200 },
      { name: "transaction_date", label: "Date", type: "date", width: 110 },
      { name: "valid_till", label: "Valid Until", type: "date", width: 110 },
      { name: "grand_total", label: "Total", type: "currency", width: 120 },
      { name: "status", label: "Status", type: "select",
        options: ["Draft","Submitted","Ordered","Lost","Cancelled","Expired"], width: 130 },
    ],
    rowActions: ["Open","Convert to Sales Order","Email Customer"],
  },
  {
    slug: "sales-return", label: "Sales Returns", singular: "Sales Return",
    sheet: "sales", group: "Orders & Quotes", namingPrefix: "RET-",
    fields: [
      { name: "name", label: "Return #", type: "data", width: 120 },
      { name: "customer", label: "Customer", type: "link", options: "customer", width: 180 },
      { name: "return_against", label: "Original SO", type: "link", options: "sales-order", width: 130 },
      { name: "posting_date", label: "Date", type: "date", width: 110 },
      { name: "grand_total", label: "Amount", type: "currency", width: 120 },
      { name: "status", label: "Status", type: "select", options: ["Draft","Submitted","Cancelled"], width: 120 },
    ],
  },
  {
    slug: "sales-catalogue", label: "Sales Catalogues", singular: "Sales Catalogue",
    sheet: "sales", group: "Orders & Quotes", namingPrefix: "CAT-",
    defaultView: "table", altViews: ["form"], statusField: "status",
    fields: [
      { name: "name", label: "Catalogue #", type: "data", width: 120 },
      { name: "catalogue_name", label: "Name", type: "data", width: 200, required: true },
      { name: "customer", label: "Customer", type: "link", options: "customer", width: 180 },
      { name: "status", label: "Status", type: "select", options: ["Draft","Published","Archived"], width: 110 },
      { name: "items_count", label: "Items", type: "int", width: 70 },
      { name: "share_token", label: "Share Token", type: "data", width: 170, readonly: true },
      { name: "token_expires_at", label: "Expires", type: "datetime", width: 150 },
      { name: "created_by", label: "Created By", type: "link", options: "user", width: 150 },
    ],
    rowActions: ["Open","Generate Share Link","Convert to Order","Convert to Quote","Archive"],
  },
  {
    slug: "live-shopping-session", label: "Live Shopping", singular: "Live Shopping Session",
    sheet: "sales", group: "Orders & Quotes", namingPrefix: "LS-",
    defaultView: "table", altViews: ["kanban","form"], statusField: "status",
    fields: [
      { name: "name", label: "Session #", type: "data", width: 110 },
      { name: "session_title", label: "Title", type: "data", width: 220, required: true },
      { name: "host", label: "Host", type: "link", options: "user", width: 160 },
      { name: "customer", label: "Customer", type: "link", options: "customer", width: 180 },
      { name: "room_code", label: "Room", type: "data", width: 90 },
      { name: "status", label: "Status", type: "select", options: ["Scheduled","Active","Paused","Ended"], width: 110 },
      { name: "start_time", label: "Start", type: "datetime", width: 150 },
      { name: "end_time", label: "End", type: "datetime", width: 150 },
      { name: "converted_order", label: "Order", type: "link", options: "sales-order", width: 120 },
    ],
    rowActions: ["Join Room","Start","Pause","End","Convert to Order"],
  },
  {
    slug: "client-need", label: "Client Needs", singular: "Client Need",
    sheet: "sales", group: "Demand & Supply", namingPrefix: "NEED-",
    fields: [
      { name: "name", label: "Need #", type: "data", width: 110 },
      { name: "customer", label: "Customer", type: "link", options: "customer", width: 180 },
      { name: "item_group", label: "Group", type: "link", options: "item-group", width: 140 },
      { name: "strain", label: "Strain", type: "link", options: "thca-strain", width: 140 },
      { name: "product_type", label: "Type", type: "select",
        options: ["","Flower","Pre-Roll","Concentrate","Edible","Vape","Tincture","Topical"], width: 110 },
      { name: "quantity_needed", label: "Qty", type: "float", width: 90 },
      { name: "unit", label: "Unit", type: "link", options: "uom", width: 70 },
      { name: "max_price", label: "Max $", type: "currency", width: 100 },
      { name: "urgency", label: "Urgency", type: "select", options: ["Normal","Urgent"], width: 100 },
      { name: "status", label: "Status", type: "select", options: ["Active","Matched","Fulfilled","Cancelled"], width: 110 },
      { name: "expiry_date", label: "Expires", type: "date", width: 110 },
    ],
    rowActions: ["Open","Find Matches","Fulfil","Cancel"],
  },
  {
    slug: "supplier-supply", label: "Supplier Supply", singular: "Supplier Supply",
    sheet: "sales", group: "Demand & Supply", namingPrefix: "SUP-",
    fields: [
      { name: "name", label: "Supply #", type: "data", width: 110 },
      { name: "supplier", label: "Supplier", type: "link", options: "supplier", width: 180 },
      { name: "item_group", label: "Group", type: "link", options: "item-group", width: 140 },
      { name: "strain", label: "Strain", type: "link", options: "thca-strain", width: 140 },
      { name: "product_type", label: "Type", type: "select",
        options: ["","Flower","Pre-Roll","Concentrate","Edible","Vape","Tincture","Topical"], width: 110 },
      { name: "quantity_available", label: "Qty", type: "float", width: 90 },
      { name: "unit", label: "Unit", type: "link", options: "uom", width: 70 },
      { name: "ask_price", label: "Ask $", type: "currency", width: 100 },
      { name: "status", label: "Status", type: "select", options: ["Available","Reserved","Sold"], width: 110 },
      { name: "expiry_date", label: "Expires", type: "date", width: 110 },
    ],
  },
  {
    slug: "match-record", label: "Match Records", singular: "Match Record",
    sheet: "sales", group: "Demand & Supply",
    fields: [
      { name: "name", label: "Match #", type: "data", width: 80 },
      { name: "client_need", label: "Need", type: "link", options: "client-need", width: 130 },
      { name: "supplier_supply", label: "Supply", type: "link", options: "supplier-supply", width: 130 },
      { name: "match_score", label: "Score", type: "percent", width: 80 },
      { name: "status", label: "Status", type: "select", options: ["Suggested","Accepted","Rejected","Converted"], width: 120 },
      { name: "converted_order", label: "Order", type: "link", options: "sales-order", width: 120 },
    ],
    rowActions: ["Accept","Reject","Convert to Order"],
  },
  {
    slug: "pricing-profile", label: "Pricing Profiles", singular: "Pricing Profile",
    sheet: "sales", group: "Pricing",
    fields: [
      { name: "profile_name", label: "Profile", type: "data", width: 200 },
      { name: "customer", label: "Customer", type: "link", options: "customer", width: 180 },
      { name: "base_markup_pct", label: "Base Markup %", type: "percent", width: 120 },
      { name: "min_margin_pct", label: "Min Margin %", type: "percent", width: 110 },
      { name: "max_discount_pct", label: "Max Disc %", type: "percent", width: 110 },
      { name: "allow_below_vendor_range", label: "Below Vendor", type: "check", width: 110 },
      { name: "allow_cogs_override", label: "COGS Override", type: "check", width: 120 },
      { name: "allow_margin_override", label: "Margin Override", type: "check", width: 130 },
    ],
  },
  {
    slug: "cogs-rule", label: "COGS Rules", singular: "COGS Rule",
    sheet: "sales", group: "Pricing",
    fields: [
      { name: "rule_name", label: "Rule", type: "data", width: 200 },
      { name: "applies_to", label: "Applies To", type: "select", options: ["All Customers","Specific Customer","Customer Group"], width: 150 },
      { name: "customer", label: "Customer", type: "link", options: "customer", width: 160 },
      { name: "item_group", label: "Group", type: "link", options: "item-group", width: 140 },
      { name: "cogs_mode", label: "Mode", type: "select", options: ["FIXED","RANGE"], width: 90 },
      { name: "fixed_cogs", label: "Fixed $", type: "currency", width: 100 },
      { name: "cogs_low", label: "Low $", type: "currency", width: 90 },
      { name: "cogs_mid", label: "Mid $", type: "currency", width: 90 },
      { name: "cogs_high", label: "High $", type: "currency", width: 90 },
      { name: "priority", label: "Priority", type: "int", width: 80 },
      { name: "is_active", label: "Active", type: "check", width: 70 },
    ],
  },

  // ──────── INVENTORY ────────
  {
    slug: "batch", label: "Batches", singular: "Batch",
    sheet: "inventory", group: "Inventory",
    defaultView: "table", altViews: ["kanban","form"], statusField: "batch_status",
    fields: [
      { name: "name", label: "Batch #", type: "data", width: 140 },
      { name: "sku", label: "SKU", type: "data", width: 110 },
      { name: "item", label: "Item", type: "link", options: "item", width: 220 },
      { name: "batch_status", label: "Status", type: "select",
        options: ["Awaiting Intake","Live","Photographed","Ready to Ship","Sold Out","Archived"], width: 140 },
      { name: "supplier", label: "Supplier", type: "link", options: "supplier", width: 170 },
      { name: "lot_number", label: "Lot", type: "data", width: 100 },
      { name: "qty", label: "Qty", type: "float", width: 90 },
      { name: "unit_cost", label: "Unit Cost", type: "currency", width: 110 },
      { name: "vendor_range_low", label: "Low $", type: "currency", width: 90 },
      { name: "vendor_range_high", label: "High $", type: "currency", width: 90 },
      { name: "photography_status", label: "Photos", type: "select", options: ["Pending","Shot","Published"], width: 110 },
      { name: "intake_session", label: "Intake", type: "link", options: "intake-session", width: 140 },
      { name: "expiry_date", label: "Expiry", type: "date", width: 100 },
    ],
    rowActions: ["Open","Move Status","Shoot Photos","Create Delivery","Archive"],
  },
  {
    slug: "intake-session", label: "Intake Sessions", singular: "Intake Session",
    sheet: "inventory", group: "Inventory", namingPrefix: "INT-",
    fields: [
      { name: "name", label: "Session #", type: "data", width: 130 },
      { name: "supplier", label: "Supplier", type: "link", options: "supplier", width: 180 },
      { name: "intake_date", label: "Date", type: "datetime", width: 150 },
      { name: "intake_by", label: "By", type: "link", options: "user", width: 150 },
      { name: "status", label: "Status", type: "select", options: ["Pending","Submitted","Cancelled"], width: 110 },
      { name: "warehouse", label: "Warehouse", type: "link", options: "warehouse", width: 160 },
      { name: "items_count", label: "Batches", type: "int", width: 80 },
    ],
    rowActions: ["Open","Submit","Cancel"],
  },
  {
    slug: "stock-entry", label: "Stock Entries", singular: "Stock Entry",
    sheet: "inventory", group: "Inventory",
    fields: [
      { name: "name", label: "Entry #", type: "data", width: 130 },
      { name: "stock_entry_type", label: "Type", type: "select",
        options: ["Material Issue","Material Receipt","Material Transfer","Repack"], width: 160 },
      { name: "from_warehouse", label: "From", type: "link", options: "warehouse", width: 150 },
      { name: "to_warehouse", label: "To", type: "link", options: "warehouse", width: 150 },
      { name: "posting_date", label: "Date", type: "date", width: 110 },
      { name: "status", label: "Status", type: "select", options: ["Draft","Submitted","Cancelled"], width: 110 },
    ],
  },
  {
    slug: "delivery-note", label: "Delivery Notes", singular: "Delivery Note",
    sheet: "inventory", group: "Inventory",
    defaultView: "table", altViews: ["kanban","calendar","form"], statusField: "status",
    fields: [
      { name: "name", label: "DN #", type: "data", width: 120 },
      { name: "customer", label: "Customer", type: "link", options: "customer", width: 180 },
      { name: "sales_order", label: "SO Ref", type: "link", options: "sales-order", width: 120 },
      { name: "posting_date", label: "Date", type: "date", width: 110 },
      { name: "delivery_date", label: "Deliver", type: "date", width: 110 },
      { name: "items_count", label: "Items", type: "int", width: 70 },
      { name: "status", label: "Status", type: "select", options: ["Draft","To Bill","Completed","Cancelled"], width: 110 },
    ],
  },
  {
    slug: "photography-queue", label: "Photography Queue", singular: "Photography Queue",
    sheet: "inventory", group: "Operations",
    defaultView: "kanban", altViews: ["table","form"], statusField: "status",
    fields: [
      { name: "name", label: "Queue #", type: "data", width: 120 },
      { name: "batch_no", label: "Batch", type: "link", options: "batch", width: 150 },
      { name: "item", label: "Item", type: "link", options: "item", width: 200 },
      { name: "status", label: "Status", type: "select", options: ["Pending","Shot","Published"], width: 110 },
      { name: "queued_date", label: "Queued", type: "date", width: 110 },
      { name: "shot_date", label: "Shot", type: "date", width: 110 },
    ],
    rowActions: ["Open","Upload Images","Publish"],
  },
  {
    slug: "sample-request", label: "Sample Requests", singular: "Sample Request",
    sheet: "inventory", group: "Operations", namingPrefix: "SMP-",
    defaultView: "table", altViews: ["kanban","calendar","form"], statusField: "status",
    fields: [
      { name: "name", label: "Sample #", type: "data", width: 110 },
      { name: "customer", label: "Customer", type: "link", options: "customer", width: 180 },
      { name: "item", label: "Item", type: "link", options: "item", width: 200 },
      { name: "batch_no", label: "Batch", type: "link", options: "batch", width: 140 },
      { name: "qty", label: "Qty", type: "float", width: 80 },
      { name: "requested_date", label: "Requested", type: "date", width: 110 },
      { name: "due_date", label: "Due", type: "date", width: 110 },
      { name: "status", label: "Status", type: "select",
        options: ["Requested","Allocated","Samples Out","Returned","Expired"], width: 130 },
      { name: "location", label: "Warehouse", type: "link", options: "warehouse", width: 150 },
    ],
  },
  {
    slug: "batch-status-history", label: "Batch History", singular: "Batch Status History",
    sheet: "inventory", group: "Operations",
    fields: [
      { name: "name", label: "#", type: "data", width: 70 },
      { name: "batch_no", label: "Batch", type: "link", options: "batch", width: 150 },
      { name: "from_status", label: "From", type: "link", options: "workflow-queue-status", width: 140 },
      { name: "to_status", label: "To", type: "link", options: "workflow-queue-status", width: 140 },
      { name: "changed_by", label: "Changed By", type: "link", options: "user", width: 150 },
      { name: "changed_at", label: "At", type: "datetime", width: 150 },
      { name: "notes", label: "Notes", type: "data", width: 260 },
    ],
  },
  {
    slug: "workflow-queue-status", label: "Workflow Statuses", singular: "Workflow Queue Status",
    sheet: "inventory", group: "Operations",
    fields: [
      { name: "status_name", label: "Status", type: "data", width: 160 },
      { name: "status_color", label: "Color", type: "select", options: ["gray","blue","green","yellow","red","purple"], width: 100 },
      { name: "sort_order", label: "Order", type: "int", width: 70 },
      { name: "is_terminal", label: "Terminal", type: "check", width: 80 },
      { name: "description", label: "Description", type: "data", width: 260 },
    ],
  },
  {
    slug: "warehouse", label: "Warehouses", singular: "Warehouse",
    sheet: "inventory", group: "Warehouses",
    fields: [
      { name: "name", label: "Warehouse", type: "data", width: 200 },
      { name: "warehouse_type", label: "Type", type: "select", options: ["Transit","Stores","Shop","Virtual"], width: 120 },
      { name: "parent_warehouse", label: "Parent", type: "link", options: "warehouse", width: 180 },
      { name: "is_group", label: "Group?", type: "check", width: 80 },
      { name: "stock_value", label: "Stock Value", type: "currency", width: 120 },
    ],
  },
  {
    slug: "stock-ledger-entry", label: "Stock Ledger", singular: "Stock Ledger Entry",
    sheet: "inventory", group: "Warehouses",
    fields: [
      { name: "name", label: "#", type: "data", width: 110 },
      { name: "item_code", label: "Item", type: "link", options: "item", width: 200 },
      { name: "batch_no", label: "Batch", type: "link", options: "batch", width: 150 },
      { name: "warehouse", label: "Warehouse", type: "link", options: "warehouse", width: 160 },
      { name: "actual_qty", label: "Δ Qty", type: "float", width: 90 },
      { name: "qty_after_transaction", label: "Balance", type: "float", width: 90 },
      { name: "posting_date", label: "Date", type: "date", width: 110 },
      { name: "voucher_type", label: "Doc Type", type: "data", width: 130 },
    ],
  },
  {
    slug: "item", label: "Items", singular: "Item",
    sheet: "inventory", group: "Catalog",
    fields: [
      { name: "name", label: "SKU", type: "data", width: 130 },
      { name: "item_name", label: "Name", type: "data", width: 230 },
      { name: "strain", label: "Strain", type: "link", options: "thca-strain", width: 140 },
      { name: "product_grade", label: "Grade", type: "link", options: "product-grade", width: 100 },
      { name: "product_type", label: "Type", type: "select",
        options: ["Flower","Pre-Roll","Concentrate","Edible","Vape"], width: 110 },
      { name: "cogs_mode", label: "COGS Mode", type: "select", options: ["FIXED","RANGE"], width: 110 },
      { name: "cogs_fixed", label: "Fixed $", type: "currency", width: 100 },
      { name: "cogs_low", label: "Low $", type: "currency", width: 90 },
      { name: "cogs_mid", label: "Mid $", type: "currency", width: 90 },
      { name: "cogs_high", label: "High $", type: "currency", width: 90 },
      { name: "requires_photography", label: "Photos?", type: "check", width: 80 },
      { name: "workflow_status", label: "Workflow", type: "link", options: "workflow-queue-status", width: 150 },
    ],
  },
  {
    slug: "thca-strain", label: "THCA Strains", singular: "THCA Strain",
    sheet: "inventory", group: "Catalog",
    fields: [
      { name: "strain_name", label: "Strain", type: "data", width: 200 },
      { name: "strain_type", label: "Type", type: "select", options: ["Indica","Sativa","Hybrid","CBD"], width: 110 },
      { name: "description", label: "Description", type: "data", width: 300 },
      { name: "is_active", label: "Active", type: "check", width: 80 },
    ],
  },
  {
    slug: "product-grade", label: "Product Grades", singular: "Product Grade",
    sheet: "inventory", group: "Catalog",
    fields: [
      { name: "grade_code", label: "Code", type: "data", width: 110 },
      { name: "grade_label", label: "Label", type: "data", width: 180 },
      { name: "description", label: "Description", type: "data", width: 260 },
    ],
  },

  // ──────── PROCUREMENT ────────
  {
    slug: "purchase-order", label: "Purchase Orders", singular: "Purchase Order",
    sheet: "procurement", group: "Purchasing",
    defaultView: "table", altViews: ["kanban","calendar","form"], statusField: "status",
    fields: [
      { name: "name", label: "PO #", type: "data", width: 120 },
      { name: "supplier", label: "Supplier", type: "link", options: "supplier", width: 180 },
      { name: "transaction_date", label: "Date", type: "date", width: 110 },
      { name: "schedule_date", label: "Expected", type: "date", width: 110 },
      { name: "grand_total", label: "Total", type: "currency", width: 120 },
      { name: "status", label: "Status", type: "select", options: ["Draft","To Receive and Bill","To Receive","To Bill","Completed","Cancelled"], width: 170 },
    ],
  },
  {
    slug: "purchase-receipt", label: "Purchase Receipts", singular: "Purchase Receipt",
    sheet: "procurement", group: "Purchasing",
    fields: [
      { name: "name", label: "PR #", type: "data", width: 120 },
      { name: "supplier", label: "Supplier", type: "link", options: "supplier", width: 180 },
      { name: "posting_date", label: "Date", type: "date", width: 110 },
      { name: "grand_total", label: "Total", type: "currency", width: 120 },
      { name: "status", label: "Status", type: "select", options: ["Draft","To Bill","Completed","Cancelled"], width: 120 },
    ],
  },
  {
    slug: "supplier", label: "Suppliers", singular: "Supplier",
    sheet: "procurement", group: "Purchasing",
    fields: [
      { name: "name", label: "Name", type: "data", width: 220 },
      { name: "supplier_type", label: "Type", type: "select", options: ["Company","Individual"], width: 110 },
      { name: "license_number", label: "License", type: "data", width: 140 },
      { name: "harvest_reminder_days", label: "Harvest Days", type: "int", width: 110 },
      { name: "verification_email", label: "Verif. Email", type: "data", width: 180 },
      { name: "is_buyer", label: "Buys?", type: "check", width: 70 },
    ],
  },
  {
    slug: "supplier-harvest-reminder", label: "Harvest Reminders", singular: "Supplier Harvest Reminder",
    sheet: "procurement", group: "Purchasing",
    fields: [
      { name: "name", label: "#", type: "data", width: 100 },
      { name: "supplier", label: "Supplier", type: "link", options: "supplier", width: 180 },
      { name: "reminder_date", label: "Date", type: "date", width: 110 },
      { name: "strain", label: "Strain", type: "link", options: "thca-strain", width: 140 },
      { name: "expected_quantity", label: "Expected Qty", type: "float", width: 110 },
      { name: "status", label: "Status", type: "select", options: ["Pending","Sent","Acknowledged"], width: 120 },
    ],
  },
  {
    slug: "purchase-invoice", label: "Purchase Invoices", singular: "Purchase Invoice",
    sheet: "procurement", group: "Payables",
    fields: [
      { name: "name", label: "PI #", type: "data", width: 120 },
      { name: "supplier", label: "Supplier", type: "link", options: "supplier", width: 180 },
      { name: "posting_date", label: "Date", type: "date", width: 110 },
      { name: "due_date", label: "Due", type: "date", width: 110 },
      { name: "grand_total", label: "Total", type: "currency", width: 120 },
      { name: "outstanding_amount", label: "Owed", type: "currency", width: 120 },
      { name: "status", label: "Status", type: "select", options: ["Draft","Submitted","Paid","Overdue","Cancelled"], width: 120 },
      // Cross-sheet flag: shows a 'Due now' chip when the linked batch is sold out.
      // Drives the supplier queue per the customer-interview mental model.
      { name: "due_now", label: "Pay queue", type: "select", options: ["","Due now"], width: 110 },
    ],
  },

  // ──────── FINANCE ────────
  {
    slug: "sales-invoice", label: "Sales Invoices", singular: "Sales Invoice",
    sheet: "finance", group: "Receivables",
    defaultView: "table", altViews: ["kanban","calendar","form"], statusField: "status",
    fields: [
      { name: "name", label: "Invoice #", type: "data", width: 130 },
      { name: "customer", label: "Customer", type: "link", options: "customer", width: 180 },
      { name: "posting_date", label: "Date", type: "date", width: 110 },
      { name: "due_date", label: "Due", type: "date", width: 110 },
      { name: "grand_total", label: "Total", type: "currency", width: 120 },
      { name: "outstanding_amount", label: "Owed", type: "currency", width: 120 },
      { name: "status", label: "Status", type: "select", options: ["Draft","Unpaid","Partly Paid","Paid","Overdue","Cancelled"], width: 130 },
      { name: "has_dispute", label: "Dispute?", type: "check", width: 80 },
    ],
    rowActions: ["Open","Record Payment","Start Dispute","Send Reminder","Cancel"],
  },
  {
    slug: "payment-entry", label: "Payment Entries", singular: "Payment Entry",
    sheet: "finance", group: "Receivables",
    fields: [
      { name: "name", label: "PE #", type: "data", width: 130 },
      { name: "payment_type", label: "Type", type: "select", options: ["Receive","Pay","Internal Transfer"], width: 120 },
      { name: "party_type", label: "Party Type", type: "select", options: ["Customer","Supplier"], width: 110 },
      { name: "party", label: "Who", type: "data", width: 200 },
      { name: "posting_date", label: "Date", type: "date", width: 110 },
      { name: "paid_amount", label: "Amount", type: "currency", width: 110 },
      { name: "mode_of_payment", label: "Mode", type: "select", options: ["Cash","Bank","Wire","ACH","Crypto","Credit Card"], width: 110 },
      { name: "reference_no", label: "Ref #", type: "data", width: 130 },
    ],
  },
  {
    slug: "invoice-dispute", label: "Invoice Disputes", singular: "Invoice Dispute",
    sheet: "finance", group: "Receivables",
    fields: [
      { name: "name", label: "#", type: "data", width: 110 },
      { name: "sales_invoice", label: "Invoice", type: "link", options: "sales-invoice", width: 130 },
      { name: "customer", label: "Customer", type: "link", options: "customer", width: 180 },
      { name: "dispute_reason", label: "Reason", type: "select", options: ["Wrong Amount","Wrong Items","Damaged","Other"], width: 130 },
      { name: "status", label: "Status", type: "select", options: ["Open","Under Review","Resolved","Escalated"], width: 130 },
    ],
  },
  {
    slug: "installment-payment", label: "Installment Plans", singular: "Installment Payment",
    sheet: "finance", group: "Receivables",
    fields: [
      { name: "name", label: "#", type: "data", width: 110 },
      { name: "sales_invoice", label: "Invoice", type: "link", options: "sales-invoice", width: 130 },
      { name: "customer", label: "Customer", type: "link", options: "customer", width: 180 },
      { name: "status", label: "Status", type: "select", options: ["Active","Completed","Defaulted"], width: 110 },
    ],
  },
  {
    slug: "referral-credit", label: "Referral Credits", singular: "Referral Credit",
    sheet: "finance", group: "Receivables",
    fields: [
      { name: "name", label: "#", type: "data", width: 110 },
      { name: "referrer_customer", label: "Referrer", type: "link", options: "customer", width: 180 },
      { name: "referred_customer", label: "Referred", type: "link", options: "customer", width: 180 },
      { name: "credit_amount", label: "Amount", type: "currency", width: 110 },
      { name: "status", label: "Status", type: "select", options: ["Pending","Applied","Expired"], width: 110 },
    ],
  },
  {
    slug: "crypto-payment", label: "Crypto Payments", singular: "Crypto Payment",
    sheet: "finance", group: "Payables",
    fields: [
      { name: "name", label: "#", type: "data", width: 130 },
      { name: "payment_entry", label: "Payment", type: "link", options: "payment-entry", width: 130 },
      { name: "crypto_currency", label: "Currency", type: "select", options: ["USDC","USDT","BTC","ETH"], width: 100 },
      { name: "usd_amount", label: "USD", type: "currency", width: 110 },
      { name: "transaction_hash", label: "Tx Hash", type: "data", width: 220 },
    ],
  },
  {
    slug: "transaction-fee", label: "Transaction Fees", singular: "Transaction Fee",
    sheet: "finance", group: "Payables",
    fields: [
      { name: "name", label: "#", type: "data", width: 90 },
      { name: "payment_entry", label: "Payment", type: "link", options: "payment-entry", width: 130 },
      { name: "fee_type", label: "Type", type: "select", options: ["ACH","Wire","Credit Card Processing","Crypto"], width: 150 },
      { name: "fee_amount", label: "Fee", type: "currency", width: 100 },
      { name: "charged_to", label: "Charged To", type: "select", options: ["Company","Customer"], width: 110 },
    ],
  },
  {
    slug: "journal-entry", label: "Journal Entries", singular: "Journal Entry",
    sheet: "finance", group: "General",
    fields: [
      { name: "name", label: "JE #", type: "data", width: 110 },
      { name: "voucher_type", label: "Type", type: "select", options: ["Journal Entry","Opening Entry","Contra Entry"], width: 140 },
      { name: "posting_date", label: "Date", type: "date", width: 110 },
      { name: "total_debit", label: "Debit", type: "currency", width: 110 },
      { name: "total_credit", label: "Credit", type: "currency", width: 110 },
      { name: "status", label: "Status", type: "select", options: ["Draft","Submitted","Cancelled"], width: 110 },
    ],
  },
  {
    slug: "gl-entry", label: "General Ledger", singular: "GL Entry",
    sheet: "finance", group: "General",
    fields: [
      { name: "name", label: "#", type: "data", width: 100 },
      { name: "account", label: "Account", type: "link", options: "account", width: 220 },
      { name: "debit", label: "Debit", type: "currency", width: 110 },
      { name: "credit", label: "Credit", type: "currency", width: 110 },
      { name: "posting_date", label: "Date", type: "date", width: 110 },
      { name: "voucher_type", label: "Doc Type", type: "data", width: 140 },
      { name: "voucher_no", label: "Voucher #", type: "data", width: 130 },
    ],
  },
  {
    slug: "account", label: "Chart of Accounts", singular: "Account",
    sheet: "finance", group: "General",
    fields: [
      { name: "name", label: "Account", type: "data", width: 240 },
      { name: "account_type", label: "Type", type: "select",
        options: ["Asset","Liability","Equity","Income","Expense"], width: 110 },
      { name: "is_group", label: "Group?", type: "check", width: 70 },
      { name: "balance", label: "Balance", type: "currency", width: 120 },
    ],
  },
  {
    slug: "bank-account", label: "Bank Accounts", singular: "Bank Account",
    sheet: "finance", group: "General",
    fields: [
      { name: "name", label: "Account", type: "data", width: 220 },
      { name: "bank", label: "Bank", type: "data", width: 160 },
      { name: "account_number", label: "Account #", type: "data", width: 140 },
      { name: "balance", label: "Balance", type: "currency", width: 120 },
    ],
  },
  {
    slug: "bank-transaction", label: "Bank Transactions", singular: "Bank Transaction",
    sheet: "finance", group: "General",
    fields: [
      { name: "name", label: "#", type: "data", width: 120 },
      { name: "bank_account", label: "Bank Account", type: "link", options: "bank-account", width: 180 },
      { name: "date", label: "Date", type: "date", width: 110 },
      { name: "deposit", label: "Deposit", type: "currency", width: 110 },
      { name: "withdrawal", label: "Withdrawal", type: "currency", width: 110 },
      { name: "reconciled", label: "Recon?", type: "check", width: 70 },
    ],
  },
  {
    slug: "cash-location", label: "Cash Locations", singular: "Cash Location",
    sheet: "finance", group: "Extended",
    fields: [
      { name: "location_name", label: "Location", type: "data", width: 200 },
      { name: "warehouse", label: "Warehouse", type: "link", options: "warehouse", width: 150 },
      { name: "current_balance", label: "Balance", type: "currency", width: 120 },
      { name: "is_active", label: "Active", type: "check", width: 70 },
    ],
  },
  {
    slug: "shift-audit", label: "Shift Audits", singular: "Shift Audit",
    sheet: "finance", group: "Extended",
    fields: [
      { name: "name", label: "#", type: "data", width: 110 },
      { name: "cash_location", label: "Location", type: "link", options: "cash-location", width: 160 },
      { name: "shift_open_by", label: "Open By", type: "link", options: "user", width: 150 },
      { name: "shift_open_at", label: "Opened", type: "datetime", width: 150 },
      { name: "shift_close_by", label: "Close By", type: "link", options: "user", width: 150 },
      { name: "shift_close_at", label: "Closed", type: "datetime", width: 150 },
      { name: "opening_balance", label: "Opening", type: "currency", width: 100 },
      { name: "closing_balance", label: "Closing", type: "currency", width: 100 },
      { name: "expected_balance", label: "Expected", type: "currency", width: 100 },
      { name: "variance", label: "Variance", type: "currency", width: 100 },
    ],
    rowActions: ["Open Shift","Close Shift"],
  },
  {
    slug: "payment-followup-template", label: "Follow-up Templates", singular: "Payment Followup Template",
    sheet: "finance", group: "Extended",
    fields: [
      { name: "template_name", label: "Template", type: "data", width: 200 },
      { name: "channel", label: "Channel", type: "select", options: ["SMS","Email","Note"], width: 100 },
      { name: "subject_template", label: "Subject", type: "data", width: 240 },
    ],
  },
  {
    slug: "credit-adjustment", label: "Credit Adjustments", singular: "Credit Adjustment",
    sheet: "credit", group: "Credit Management",
    fields: [
      { name: "name", label: "#", type: "data", width: 110 },
      { name: "customer", label: "Customer", type: "link", options: "customer", width: 180 },
      { name: "adjustment_type", label: "Type", type: "select",
        options: ["Manual Credit","Refund Credit","Bad Debt Write-Off","Referral Bonus"], width: 160 },
      { name: "amount", label: "Amount", type: "currency", width: 110 },
      { name: "approved_by", label: "Approved By", type: "link", options: "user", width: 150 },
      { name: "applied_date", label: "Date", type: "date", width: 110 },
    ],
  },

  // ──────── RELATIONSHIPS ────────
  {
    slug: "customer", label: "Customers", singular: "Customer",
    sheet: "relationships", group: "Clients",
    fields: [
      { name: "name", label: "Customer", type: "data", width: 220 },
      { name: "customer_group", label: "Group", type: "data", width: 140 },
      { name: "license_number", label: "License", type: "data", width: 140 },
      { name: "is_seller", label: "Seller?", type: "check", width: 70 },
      { name: "credit_limit_mode", label: "Credit Mode", type: "select", options: ["WARNING","SOFT_BLOCK","HARD_BLOCK"], width: 120 },
      { name: "vip_portal_enabled", label: "VIP?", type: "check", width: 70 },
      { name: "preferred_payment_term", label: "Pay Term", type: "link", options: "payment-term", width: 120 },
      { name: "sales_rep", label: "Sales Rep", type: "link", options: "user", width: 150 },
      { name: "referred_by", label: "Referred By", type: "link", options: "customer", width: 150 },
      { name: "credit_used", label: "Exposure", type: "currency", width: 110 },
      { name: "credit_limit", label: "Limit", type: "currency", width: 110 },
    ],
  },
  {
    slug: "client-communication-log", label: "Communication Log", singular: "Client Communication Log",
    sheet: "relationships", group: "Clients",
    fields: [
      { name: "name", label: "#", type: "data", width: 110 },
      { name: "customer", label: "Customer", type: "link", options: "customer", width: 180 },
      { name: "comm_type", label: "Type", type: "select", options: ["Call","SMS","Email","Meeting","Note"], width: 100 },
      { name: "subject", label: "Subject", type: "data", width: 240 },
      { name: "comm_date", label: "When", type: "datetime", width: 150 },
      { name: "logged_by", label: "By", type: "link", options: "user", width: 150 },
      { name: "follow_up_date", label: "Follow Up", type: "date", width: 110 },
    ],
  },
  {
    slug: "vip-portal-configuration", label: "VIP Portal Configs", singular: "VIP Portal Configuration",
    sheet: "relationships", group: "Clients",
    fields: [
      { name: "customer", label: "Customer", type: "link", options: "customer", width: 220 },
      { name: "portal_enabled", label: "Portal", type: "check", width: 70 },
      { name: "enable_live_catalog", label: "Catalog", type: "check", width: 80 },
      { name: "enable_live_shopping", label: "Live", type: "check", width: 70 },
      { name: "enable_marketplace", label: "Marketplace", type: "check", width: 110 },
      { name: "enable_appointments", label: "Appts", type: "check", width: 80 },
      { name: "enable_leaderboard", label: "Leaderboard", type: "check", width: 110 },
      { name: "enable_referrals", label: "Referrals", type: "check", width: 90 },
    ],
  },

  // ──────── CREDIT ────────
  {
    slug: "credit-limit", label: "Credit Limits", singular: "Credit Limit",
    sheet: "credit", group: "Credit Management",
    fields: [
      { name: "customer", label: "Customer", type: "link", options: "customer", width: 220 },
      { name: "credit_limit", label: "Limit", type: "currency", width: 110 },
      { name: "enforcement_mode", label: "Mode", type: "select", options: ["WARNING","SOFT_BLOCK","HARD_BLOCK"], width: 120 },
      { name: "current_exposure", label: "Exposure", type: "currency", width: 110 },
      { name: "available_credit", label: "Available", type: "currency", width: 110 },
    ],
  },
  {
    slug: "credit-override-request", label: "Credit Overrides", singular: "Credit Override Request",
    sheet: "credit", group: "Credit Management",
    defaultView: "kanban", altViews: ["table","form"], statusField: "status",
    fields: [
      { name: "name", label: "#", type: "data", width: 110 },
      { name: "customer", label: "Customer", type: "link", options: "customer", width: 180 },
      { name: "sales_order", label: "Sales Order", type: "link", options: "sales-order", width: 140 },
      { name: "requested_by", label: "Requested By", type: "link", options: "user", width: 150 },
      { name: "requested_amount", label: "Amount", type: "currency", width: 110 },
      { name: "current_limit", label: "Current Limit", type: "currency", width: 120 },
      { name: "status", label: "Status", type: "select", options: ["Pending","Approved","Rejected"], width: 110 },
      { name: "reviewed_by", label: "Reviewer", type: "link", options: "user", width: 150 },
    ],
    rowActions: ["Approve","Reject","Open"],
  },

  // ──────── ADMIN ────────
  {
    slug: "user", label: "Users", singular: "User",
    sheet: "admin", group: "Access",
    fields: [
      { name: "name", label: "User", type: "data", width: 200 },
      { name: "full_name", label: "Full Name", type: "data", width: 200 },
      { name: "email", label: "Email", type: "data", width: 220 },
      { name: "roles", label: "Roles", type: "data", width: 300 },
      { name: "last_login", label: "Last Login", type: "datetime", width: 160 },
      { name: "enabled", label: "Enabled", type: "check", width: 80 },
    ],
  },
  {
    slug: "role", label: "Roles", singular: "Role",
    sheet: "admin", group: "Access",
    fields: [
      { name: "name", label: "Role", type: "data", width: 220 },
      { name: "desk_access", label: "Desk?", type: "check", width: 80 },
      { name: "members_count", label: "Members", type: "int", width: 90 },
    ],
  },
  {
    slug: "role-permission", label: "Role Permissions", singular: "Role Permission",
    sheet: "admin", group: "Access",
    fields: [
      { name: "for_value", label: "Page/Report", type: "data", width: 220 },
      { name: "role", label: "Role", type: "data", width: 180 },
      { name: "read", label: "Read", type: "check", width: 70 },
      { name: "write", label: "Write", type: "check", width: 70 },
    ],
  },
  {
    slug: "feature-flag", label: "Feature Flags", singular: "Feature Flag",
    sheet: "admin", group: "Configuration",
    fields: [
      { name: "flag_name", label: "Flag", type: "data", width: 200 },
      { name: "description", label: "Description", type: "data", width: 260 },
      { name: "is_enabled", label: "On?", type: "check", width: 70 },
    ],
  },
  {
    slug: "organization-settings", label: "Organization Settings", singular: "Organization Settings",
    sheet: "admin", group: "Configuration",
    defaultView: "form",
    fields: [
      { name: "show_grade_field", label: "Show Grade", type: "check" },
      { name: "require_grade", label: "Require Grade", type: "check" },
      { name: "show_expected_delivery_date", label: "Show Expected Delivery", type: "check" },
      { name: "enable_packaged_unit_type", label: "Enable Packaged UOM", type: "check" },
      { name: "cogs_display_mode", label: "COGS Display", type: "select", options: ["Everyone","Admin Only","Hidden"] },
      { name: "show_cogs_in_orders", label: "COGS in Orders", type: "check" },
      { name: "show_margin_in_orders", label: "Margin in Orders", type: "check" },
      { name: "default_warehouse", label: "Default Warehouse", type: "link", options: "warehouse" },
    ],
  },
  {
    slug: "leaderboard-weight-config", label: "Leaderboard Weights", singular: "Leaderboard Weight Config",
    sheet: "admin", group: "Configuration",
    fields: [
      { name: "metric_name", label: "Metric", type: "data", width: 200 },
      { name: "weight_pct", label: "Weight %", type: "percent", width: 110 },
      { name: "description", label: "Description", type: "data", width: 260 },
    ],
  },
  {
    slug: "appointment-request", label: "Appointments", singular: "Appointment Request",
    sheet: "admin", group: "HR",
    defaultView: "calendar", altViews: ["table","kanban","form"], statusField: "status",
    fields: [
      { name: "name", label: "#", type: "data", width: 110 },
      { name: "customer", label: "Customer", type: "link", options: "customer", width: 180 },
      { name: "requested_date", label: "Date", type: "date", width: 110 },
      { name: "requested_time", label: "Time", type: "time", width: 90 },
      { name: "appointment_type", label: "Type", type: "select", options: ["Intake","Delivery","Sales Meeting","Other"], width: 120 },
      { name: "status", label: "Status", type: "select", options: ["Pending","Approved","Rejected","Rescheduled"], width: 120 },
    ],
  },
  {
    slug: "time-off-request", label: "Time Off", singular: "Time Off Request",
    sheet: "admin", group: "HR",
    fields: [
      { name: "name", label: "#", type: "data", width: 110 },
      { name: "user", label: "User", type: "link", options: "user", width: 180 },
      { name: "from_date", label: "From", type: "date", width: 110 },
      { name: "to_date", label: "To", type: "date", width: 110 },
      { name: "status", label: "Status", type: "select", options: ["Pending","Approved","Rejected"], width: 110 },
    ],
  },
  {
    slug: "hour-tracking", label: "Hour Tracking", singular: "Hour Tracking",
    sheet: "admin", group: "HR",
    fields: [
      { name: "name", label: "#", type: "data", width: 100 },
      { name: "user", label: "User", type: "link", options: "user", width: 180 },
      { name: "clock_in", label: "Clock In", type: "datetime", width: 150 },
      { name: "clock_out", label: "Clock Out", type: "datetime", width: 150 },
      { name: "break_minutes", label: "Break min", type: "int", width: 90 },
      { name: "hours_worked", label: "Hours", type: "float", width: 90 },
    ],
  },
  {
    slug: "audit-log", label: "Audit Log", singular: "Audit Log",
    sheet: "admin", group: "Audit",
    fields: [
      { name: "name", label: "#", type: "data", width: 110 },
      { name: "doctype", label: "DocType", type: "data", width: 160 },
      { name: "document", label: "Document", type: "data", width: 180 },
      { name: "action", label: "Action", type: "select", options: ["Create","Update","Submit","Cancel","Delete"], width: 100 },
      { name: "user", label: "User", type: "data", width: 180 },
      { name: "at", label: "At", type: "datetime", width: 150 },
    ],
  },
  {
    slug: "error-log", label: "Error Log", singular: "Error Log",
    sheet: "admin", group: "Audit",
    fields: [
      { name: "name", label: "#", type: "data", width: 110 },
      { name: "method", label: "Method", type: "data", width: 180 },
      { name: "error", label: "Error", type: "data", width: 280 },
      { name: "seen", label: "Seen", type: "check", width: 70 },
      { name: "at", label: "At", type: "datetime", width: 150 },
    ],
  },
];

export const SHEETS: {
  slug: Sheet; label: string; hint: string;
  tint: string; ink: string;
}[] = [
  { slug: "sales",         label: "Sales",         hint: "Orders, quotes, catalogues, live shopping, demand & supply, pricing",
    tint: "var(--sheet-sales)", ink: "var(--sheet-sales-ink)" },
  { slug: "inventory",     label: "Inventory",     hint: "Batches, intake, photography, samples, warehouses, strains",
    tint: "var(--sheet-inventory)", ink: "var(--sheet-inventory-ink)" },
  { slug: "procurement",   label: "Procurement",   hint: "POs, receipts, suppliers, harvest reminders, payables",
    tint: "var(--sheet-procurement)", ink: "var(--sheet-procurement-ink)" },
  { slug: "finance",       label: "Finance",       hint: "Invoices, payments, disputes, ledger, bank, shifts",
    tint: "var(--sheet-finance)", ink: "var(--sheet-finance-ink)" },
  { slug: "relationships", label: "Relationships", hint: "Customers, communication log, VIP portal config",
    tint: "var(--sheet-relationships)", ink: "var(--sheet-relationships-ink)" },
  { slug: "credit",        label: "Credit",        hint: "Limits, adjustments, override queue, referrals, disputes",
    tint: "var(--sheet-credit)", ink: "var(--sheet-credit-ink)" },
  { slug: "admin",         label: "Admin",         hint: "Users, roles, feature flags, settings, HR, audit",
    tint: "var(--sheet-admin)", ink: "var(--sheet-admin-ink)" },
  { slug: "reports",       label: "Reports",       hint: "Leaderboard, aging, revenue, shrinkage, top clients",
    tint: "var(--sheet-reports)", ink: "var(--sheet-reports-ink)" },
  { slug: "vip",           label: "VIP Portal",    hint: "Customer-facing VIP experience",
    tint: "var(--sheet-vip)", ink: "var(--sheet-vip-ink)" },
];

export const BY_SLUG: Record<string, DocTypeDef> = Object.fromEntries(
  DOCTYPES.map((d) => [d.slug, d])
);

export const BY_SHEET: Record<Sheet, DocTypeDef[]> = DOCTYPES.reduce(
  (acc, d) => {
    (acc[d.sheet] ||= []).push(d);
    return acc;
  },
  {} as Record<Sheet, DocTypeDef[]>,
);

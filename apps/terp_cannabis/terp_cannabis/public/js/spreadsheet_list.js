/**
 * Enhanced list view defaults for key TERP DocTypes.
 * Uses Frappe's ListView.setup pattern to pre-configure columns.
 */

// Sales Order — TERP-style queue columns
frappe.views.ListView.prototype.setup_columns = frappe.views.ListView.prototype.setup_columns || function () {};

frappe.listview_settings["Sales Order"] = {
  add_fields: ["customer", "transaction_date", "grand_total", "status", "order_source"],
  filters: [["status", "not in", ["Cancelled", "Closed"]]],
  get_indicator(doc) {
    const map = {
      Draft: ["Draft", "grey"],
      "To Deliver and Bill": ["Confirmed", "blue"],
      "To Deliver": ["To Deliver", "yellow"],
      "To Bill": ["To Bill", "orange"],
      Completed: ["Completed", "green"],
      Cancelled: ["Cancelled", "red"],
    };
    return map[doc.status] || [doc.status, "grey"];
  },
};

frappe.listview_settings["Purchase Order"] = {
  add_fields: ["supplier", "schedule_date", "grand_total", "status"],
  filters: [["status", "not in", ["Cancelled"]]],
  get_indicator(doc) {
    const map = {
      Draft: ["Draft", "grey"],
      "To Receive and Bill": ["Expected", "blue"],
      "To Receive": ["Receiving", "orange"],
      "To Bill": ["Received", "yellow"],
      Completed: ["Completed", "green"],
      Cancelled: ["Cancelled", "red"],
    };
    return map[doc.status] || [doc.status, "grey"];
  },
};

frappe.listview_settings["Batch"] = {
  add_fields: ["item", "batch_status", "supplier", "expiry_date"],
  get_indicator(doc) {
    const map = {
      "Awaiting Intake": ["Awaiting Intake", "grey"],
      Live: ["Live", "blue"],
      Photographed: ["Photographed", "green"],
      "Ready to Ship": ["Ready", "yellow"],
      "Sold Out": ["Sold Out", "red"],
      Archived: ["Archived", "grey"],
    };
    return map[doc.batch_status] || [doc.batch_status || "Active", "blue"];
  },
};

frappe.listview_settings["Sales Invoice"] = {
  add_fields: ["customer", "due_date", "outstanding_amount", "status"],
  get_indicator(doc) {
    if (doc.status === "Overdue") return ["Overdue", "red"];
    if (doc.status === "Paid") return ["Paid", "green"];
    if (doc.status === "Partly Paid") return ["Partial", "orange"];
    if (doc.status === "Unpaid") return ["Unpaid", "blue"];
    return [doc.status, "grey"];
  },
};

frappe.listview_settings["Sample Request"] = {
  add_fields: ["customer", "item", "status", "due_date"],
  get_indicator(doc) {
    const map = {
      Requested: ["Requested", "grey"],
      Allocated: ["Allocated", "blue"],
      "Samples Out": ["Out", "orange"],
      Returned: ["Returned", "green"],
      Expired: ["Expired", "red"],
    };
    return map[doc.status] || [doc.status, "grey"];
  },
};

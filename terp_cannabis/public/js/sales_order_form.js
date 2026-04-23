/**
 * Sales Order form enhancements — credit check, pricing profile, client context.
 */
frappe.ui.form.on("Sales Order", {
  customer(frm) {
    if (!frm.doc.customer) return;

    // Load credit status
    frappe.call({
      method: "terp_cannabis.services.credit_service.check_credit",
      args: { customer: frm.doc.customer, order_total: frm.doc.grand_total || 0 },
      callback(r) {
        if (!r.message) return;
        const { status, available, limit, mode } = r.message;
        if (status === "requires_override") {
          frappe.show_alert({
            message: `⚠️ Credit limit exceeded for ${frm.doc.customer}. Available: $${(available || 0).toLocaleString()}`,
            indicator: "red",
          });
        } else if (status === "warning") {
          frappe.show_alert({
            message: `Credit notice: ${frm.doc.customer} has $${(available || 0).toLocaleString()} available credit.`,
            indicator: "orange",
          });
        }
      },
    });

    // Auto-load pricing profile linked to this customer
    frappe.db.get_value("Pricing Profile", { customer: frm.doc.customer }, "name", (r) => {
      if (r?.name && !frm.doc.pricing_profile) {
        frm.set_value("pricing_profile", r.name);
      }
    });
  },

  pricing_profile(frm) {
    if (frm.doc.pricing_profile) {
      frappe.show_alert({
        message: `Pricing profile "${frm.doc.pricing_profile}" applied.`,
        indicator: "green",
      });
    }
  },

  validate(frm) {
    // Client-side: warn if no items
    if (!frm.doc.items || frm.doc.items.length === 0) {
      frappe.msgprint({
        title: "No Items",
        message: "Please add at least one line item before saving.",
        indicator: "orange",
      });
      frappe.validated = false;
    }
  },
});

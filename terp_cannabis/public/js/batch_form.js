/**
 * Batch form enhancements — COGS display, workflow status chip.
 */
frappe.ui.form.on("Batch", {
  refresh(frm) {
    // Show workflow status chip
    if (frm.doc.batch_status) {
      frm.dashboard.set_headline_alert(
        `<span class="indicator ${_statusColor(frm.doc.batch_status)}">${frm.doc.batch_status}</span>`,
      );
    }

    // Add quick actions
    frm.add_custom_button(__("Add to Sales Order"), function () {
      frappe.new_doc("Sales Order", { items: [{ item_code: frm.doc.item, batch_no: frm.doc.name }] });
    });
    frm.add_custom_button(__("View Stock Ledger"), function () {
      frappe.set_route("List", "Stock Ledger Entry", { batch_no: frm.doc.name });
    });
  },
});

function _statusColor(status) {
  const map = {
    "Awaiting Intake": "grey",
    "Live": "blue",
    "Photographed": "green",
    "Ready to Ship": "yellow",
    "Sold Out": "red",
    "Archived": "grey",
  };
  return map[status] || "grey";
}

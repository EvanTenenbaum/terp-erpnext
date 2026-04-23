/**
 * Item form enhancements — show/hide cannabis-specific COGS fields.
 */
frappe.ui.form.on("Item", {
  refresh(frm) {
    frm.trigger("cogs_mode");
    // Add a quick-view button to see linked Batches
    frm.add_custom_button(__("View Batches"), function () {
      frappe.set_route("List", "Batch", { item: frm.doc.name });
    });
  },

  cogs_mode(frm) {
    const isRange = frm.doc.cogs_mode === "RANGE";
    const isFixed = frm.doc.cogs_mode === "FIXED";
    frm.toggle_display(["cogs_low", "cogs_mid", "cogs_high"], isRange);
    frm.toggle_display("cogs_fixed", isFixed);
  },

  requires_photography(frm) {
    if (frm.doc.requires_photography) {
      frappe.show_alert({
        message: "Items requiring photography will be added to the Photography Queue after intake.",
        indicator: "blue",
      });
    }
  },
});

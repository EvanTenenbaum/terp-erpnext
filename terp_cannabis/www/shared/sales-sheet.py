import frappe


def get_context(context):
    token = frappe.form_dict.get("token")
    if not token:
        frappe.throw("Missing catalogue token", frappe.PermissionError)

    catalogue = frappe.db.get_value(
        "Sales Catalogue",
        {"share_token": token, "status": "Published"},
        ["name", "customer", "status"],
        as_dict=True,
    )
    if not catalogue:
        frappe.throw("Invalid or expired catalogue link", frappe.PermissionError)

    items = frappe.get_all(
        "Sales Catalogue Item",
        filters={"parent": catalogue.name},
        fields=["item", "batch_no", "listed_price", "notes", "qty_available"],
    )

    context.catalogue = catalogue
    context.items = items
    context.no_breadcrumbs = True
    context.no_header = True

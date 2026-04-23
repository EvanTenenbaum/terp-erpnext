"""
Sales Catalogue API — create, share, convert to order/quote.
"""
from __future__ import unicode_literals
import frappe
import uuid


@frappe.whitelist()
def create_catalogue(customer=None, items=None):
    """Create a new Sales Catalogue draft."""
    doc = frappe.get_doc({
        "doctype": "Sales Catalogue",
        "customer": customer,
        "status": "Draft",
        "created_by": frappe.session.user,
    })
    if items:
        import json
        for item in (items if isinstance(items, list) else json.loads(items)):
            doc.append("items", item)
    doc.insert()
    frappe.db.commit()
    return doc.name


@frappe.whitelist()
def generate_share_token(catalogue_name):
    """Generate or return the share token for a catalogue."""
    doc = frappe.get_doc("Sales Catalogue", catalogue_name)
    if not doc.share_token:
        doc.share_token = str(uuid.uuid4())
        doc.status = "Published"
        doc.save()
        frappe.db.commit()
    return {
        "token": doc.share_token,
        "url": f"/shared/sales-sheet?token={doc.share_token}",
    }


@frappe.whitelist()
def convert_to_order(catalogue_name, customer):
    """Copy catalogue items into a new Sales Order draft."""
    catalogue = frappe.get_doc("Sales Catalogue", catalogue_name)
    order = frappe.get_doc({
        "doctype": "Sales Order",
        "customer": customer or catalogue.customer,
        "order_type": "Sales",
        "catalogue_ref": catalogue_name,
        "order_source": "Sales Catalogue",
        "items": [
            {
                "item_code": row.item,
                "batch_no": row.batch_no,
                "qty": 1,
                "rate": row.listed_price,
                "delivery_date": frappe.utils.add_days(frappe.utils.today(), 7),
            }
            for row in catalogue.items
        ],
    })
    order.insert()
    frappe.db.commit()
    return order.name


@frappe.whitelist()
def convert_to_quotation(catalogue_name, customer):
    """Copy catalogue items into a new Quotation."""
    catalogue = frappe.get_doc("Sales Catalogue", catalogue_name)
    quotation = frappe.get_doc({
        "doctype": "Quotation",
        "quotation_to": "Customer",
        "party_name": customer or catalogue.customer,
        "order_type": "Sales",
        "items": [
            {
                "item_code": row.item,
                "batch_no": row.batch_no,
                "qty": 1,
                "rate": row.listed_price,
            }
            for row in catalogue.items
        ],
    })
    quotation.insert()
    frappe.db.commit()
    return quotation.name


@frappe.whitelist(allow_guest=True)
def get_shared_catalogue(token):
    """Public endpoint — returns catalogue items (no COGS) for a valid share token."""
    catalogue = frappe.db.get_value(
        "Sales Catalogue",
        {"share_token": token, "status": "Published"},
        ["name", "customer"],
        as_dict=True,
    )
    if not catalogue:
        frappe.throw("Invalid or expired catalogue link", frappe.PermissionError)

    items = frappe.get_all(
        "Sales Catalogue Item",
        filters={"parent": catalogue.name},
        fields=["item", "batch_no", "listed_price", "notes", "qty_available"],
    )
    # Never expose COGS to public
    return {"catalogue": catalogue, "items": items}

"""
Intake controller — hooks onto Purchase Receipt submit for PO-based receiving.
"""
from __future__ import unicode_literals
import frappe


def on_po_receipt_submit(doc, method=None):
    """
    After a Purchase Receipt is submitted:
    - Create/update Photography Queue entries for batches requiring photos
    - Fire intake notification
    """
    for item in doc.items:
        _maybe_queue_photography(item)


def _maybe_queue_photography(item):
    if not item.batch_no:
        return
    # Check if the item requires photography
    requires_photo = frappe.db.get_value("Item", item.item_code, "requires_photography")
    if not requires_photo:
        return
    if frappe.db.exists("Photography Queue", {"batch_no": item.batch_no}):
        return
    frappe.get_doc({
        "doctype": "Photography Queue",
        "batch_no": item.batch_no,
        "item": item.item_code,
        "status": "Pending",
    }).insert(ignore_permissions=True)

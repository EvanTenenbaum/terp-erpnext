"""
Vendor payable service — alerts when sold-out batches have unpaid supplier bills.
"""
from __future__ import unicode_literals
import frappe


def check_vendor_payables():
    """Daily scheduled job. Find sold-out batches with outstanding purchase invoices."""
    # Find batches marked as sold out that have associated Purchase Invoices unpaid
    sold_out_batches = frappe.db.sql(
        """
        SELECT b.name, b.item, b.supplier
        FROM `tabBatch` b
        WHERE b.batch_status = 'Sold Out'
          AND b.disabled = 0
        """,
        as_dict=True,
    )

    for batch in sold_out_batches:
        _check_and_notify(batch)

    frappe.db.commit()


def _check_and_notify(batch):
    # Check for unpaid PI linked to this batch's supplier
    unpaid = frappe.db.sql(
        """
        SELECT name, outstanding_amount
        FROM `tabPurchase Invoice`
        WHERE supplier = %s
          AND docstatus = 1
          AND outstanding_amount > 0
        LIMIT 1
        """,
        (batch.get("supplier"),),
        as_dict=True,
    )
    if not unpaid:
        return

    # Create or update a notification
    msg = (
        f"Batch {batch['name']} ({batch['item']}) is Sold Out. "
        f"Supplier {batch['supplier']} has outstanding bills totaling "
        f"${unpaid[0]['outstanding_amount']:,.2f}."
    )
    frappe.get_doc({
        "doctype": "Notification Log",
        "subject": "Vendor Payment Required",
        "email_content": msg,
        "for_user": "Administrator",
        "type": "Alert",
        "document_type": "Purchase Invoice",
        "document_name": unpaid[0]["name"],
    }).insert(ignore_permissions=True)

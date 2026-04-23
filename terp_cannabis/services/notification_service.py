"""
Notification service — sends scheduled alerts for overdue invoices, samples, POs.
"""
from __future__ import unicode_literals
import frappe
from frappe.utils import today, add_days


def send_overdue_invoice_alerts():
    """Daily: alert Accounts Manager when invoices cross overdue threshold."""
    overdue = frappe.get_all(
        "Sales Invoice",
        filters={"docstatus": 1, "outstanding_amount": [">", 0], "due_date": ["<", today()]},
        fields=["name", "customer", "due_date", "outstanding_amount"],
        limit=100,
    )
    if not overdue:
        return
    total = sum(i.outstanding_amount for i in overdue)
    msg = f"{len(overdue)} overdue invoices totaling ${total:,.2f} need attention."
    _notify_role("TERP Accounts Manager", "Overdue Invoices", msg)


def send_sample_due_alerts():
    """Daily: alert owner when samples are due for return today."""
    due_today = frappe.get_all(
        "Sample Request",
        filters={"status": "Samples Out", "due_date": today()},
        fields=["name", "customer", "item"],
    )
    for sample in due_today:
        _notify_role(
            "TERP Inventory Manager",
            "Sample Due for Return",
            f"Sample {sample.name} for {sample.customer} ({sample.item}) is due for return today.",
        )


def check_expected_po_today():
    """Every 15 min: notify procurement when POs are expected today."""
    from frappe.utils import nowdate
    pos = frappe.get_all(
        "Purchase Order",
        filters={"docstatus": 1, "status": ["in", ["To Receive and Bill", "To Receive"]],
                 "schedule_date": nowdate()},
        fields=["name", "supplier", "grand_total"],
        limit=50,
    )
    if not pos:
        return
    msg = f"{len(pos)} Purchase Orders expected for delivery today."
    _notify_role("TERP Inventory Manager", "Expected PO Deliveries Today", msg)


def _notify_role(role, subject, message):
    users = frappe.get_all("Has Role", filters={"role": role}, fields=["parent"])
    for u in users:
        frappe.get_doc({
            "doctype": "Notification Log",
            "subject": subject,
            "email_content": message,
            "for_user": u.parent,
            "type": "Alert",
        }).insert(ignore_permissions=True)
    frappe.db.commit()

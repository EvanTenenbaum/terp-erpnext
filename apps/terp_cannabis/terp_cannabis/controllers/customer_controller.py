"""
Customer controller — hooks onto Customer creation.
"""
from __future__ import unicode_literals
import frappe


def after_insert(doc, method=None):
    """Initialize credit limit record for new customers."""
    if not frappe.db.exists("Credit Limit", {"customer": doc.name}):
        frappe.get_doc({
            "doctype": "Credit Limit",
            "customer": doc.name,
            "credit_limit": 0.0,
            "enforcement_mode": "WARNING",
        }).insert(ignore_permissions=True)

"""
Notification config — used by Frappe's notification bell to categorize TERP alerts.
"""
from __future__ import unicode_literals


def get_notification_config():
    return {
        "for_doctype": {
            "Credit Override Request": {"status": ("!=", "Approved")},
            "Sample Request": {"status": "Requested"},
            "Client Need": {"status": "Active"},
            "Invoice Dispute": {"status": ("in", ["Open", "Under Review"])},
        },
        "targets": {},
    }

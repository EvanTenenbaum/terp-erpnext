"""
Accounting controller — hooks onto Sales Invoice and Payment Entry events.
"""
from __future__ import unicode_literals
import frappe


def on_invoice_submit(doc, method=None):
    """After Sales Invoice submit: check if payment terms are consignment."""
    pass


def on_payment_submit(doc, method=None):
    """After Payment Entry submit: update client credit exposure."""
    pass

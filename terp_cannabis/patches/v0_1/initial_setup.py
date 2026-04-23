"""v0.1 initial setup patch — idempotent."""
from __future__ import unicode_literals
import frappe


def execute():
    """Run initial setup if not already done."""
    if frappe.db.exists("Role", "TERP Owner"):
        return  # Already applied
    from terp_cannabis.install import after_install
    after_install()

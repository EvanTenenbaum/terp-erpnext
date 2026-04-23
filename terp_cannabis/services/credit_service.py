"""
Credit service — evaluates customer credit exposure and checks order against limit.
"""
from __future__ import unicode_literals
import frappe


def check_credit(customer, order_total):
    """
    Returns:
      {
        status: 'allowed' | 'warning' | 'requires_override',
        exposure: float,
        limit: float,
        available: float,
        mode: 'WARNING' | 'SOFT_BLOCK' | 'HARD_BLOCK',
      }
    """
    limit_doc = frappe.db.get_value(
        "Credit Limit",
        {"customer": customer},
        ["credit_limit", "enforcement_mode"],
        as_dict=True,
    )
    if not limit_doc or limit_doc.credit_limit == 0:
        return {"status": "allowed", "exposure": 0, "limit": 0, "available": 999_999_999, "mode": "WARNING"}

    limit = limit_doc.credit_limit
    mode = limit_doc.enforcement_mode or "WARNING"
    exposure = get_exposure(customer)
    available = limit - exposure
    would_exceed = (exposure + order_total) > limit

    if not would_exceed:
        return {"status": "allowed", "exposure": exposure, "limit": limit, "available": available, "mode": mode}

    if mode == "WARNING":
        return {"status": "warning", "exposure": exposure, "limit": limit, "available": available, "mode": mode}
    elif mode == "SOFT_BLOCK":
        return {"status": "warning", "exposure": exposure, "limit": limit, "available": available, "mode": mode}
    else:  # HARD_BLOCK
        return {"status": "requires_override", "exposure": exposure, "limit": limit, "available": available, "mode": mode}


def get_exposure(customer):
    """Sum of all outstanding (unpaid) Sales Invoice amounts for a customer."""
    result = frappe.db.sql(
        """
        SELECT COALESCE(SUM(outstanding_amount), 0) as exposure
        FROM `tabSales Invoice`
        WHERE customer = %s
          AND docstatus = 1
          AND outstanding_amount > 0
        """,
        (customer,),
        as_dict=True,
    )
    return result[0].exposure if result else 0.0

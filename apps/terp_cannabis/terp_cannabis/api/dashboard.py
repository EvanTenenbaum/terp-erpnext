"""
Dashboard API — operational KPIs and inventory snapshot for the Owner Command Center.
"""
from __future__ import unicode_literals
import frappe
from frappe.utils import today, add_days


@frappe.whitelist()
def get_operational_kpis():
    """Returns KPIs for the Owner Command Center top row."""
    open_orders = frappe.db.count(
        "Sales Order",
        filters={"docstatus": 1, "status": ["in", ["To Deliver and Bill", "To Deliver", "To Bill"]]},
    )
    open_orders_value = frappe.db.sql(
        "SELECT COALESCE(SUM(grand_total), 0) FROM `tabSales Order` WHERE docstatus=1 AND status IN ('To Deliver and Bill','To Deliver','To Bill')"
    )[0][0] or 0

    outstanding_ar = frappe.db.sql(
        "SELECT COALESCE(SUM(outstanding_amount), 0) FROM `tabSales Invoice` WHERE docstatus=1 AND outstanding_amount > 0"
    )[0][0] or 0
    open_invoices = frappe.db.count("Sales Invoice", filters={"docstatus": 1, "outstanding_amount": [">", 0]})

    seven_days_ago = add_days(today(), -7)
    cash_7d = frappe.db.sql(
        "SELECT COALESCE(SUM(paid_amount), 0) FROM `tabPayment Entry` WHERE docstatus=1 AND payment_type='Receive' AND posting_date >= %s",
        (seven_days_ago,),
    )[0][0] or 0

    fulfilled_today = frappe.db.count(
        "Delivery Note",
        filters={"docstatus": 1, "posting_date": today()},
    )

    return {
        "open_orders": open_orders,
        "open_orders_value": float(open_orders_value),
        "outstanding_ar": float(outstanding_ar),
        "open_invoices": open_invoices,
        "cash_collected_7d": float(cash_7d),
        "fulfilled_today": fulfilled_today,
    }


@frappe.whitelist()
def get_inventory_snapshot():
    """Returns inventory summary by category for the dashboard widget."""
    rows = frappe.db.sql(
        """
        SELECT
            ig.name AS category,
            COUNT(DISTINCT sle.batch_no) AS batch_count,
            COALESCE(SUM(sle.qty_after_transaction), 0) AS total_units,
            COALESCE(SUM(sle.qty_after_transaction * i.valuation_rate), 0) AS total_value
        FROM `tabStock Ledger Entry` sle
        JOIN `tabItem` i ON i.name = sle.item_code
        JOIN `tabItem Group` ig ON ig.name = i.item_group
        WHERE sle.is_cancelled = 0
          AND sle.qty_after_transaction > 0
        GROUP BY ig.name
        ORDER BY total_value DESC
        """,
        as_dict=True,
    )
    total_units = sum(r.total_units for r in rows)
    total_value = sum(r.total_value for r in rows)
    return {
        "categories": rows,
        "total_units": float(total_units),
        "total_value": float(total_value),
    }


@frappe.whitelist()
def get_cash_position():
    """Returns cash vs. scheduled payables summary."""
    cash_balance = frappe.db.sql(
        "SELECT COALESCE(SUM(balance), 0) FROM `tabBank Account` WHERE is_company_account=1 AND disabled=0"
    )[0][0] or 0

    scheduled_payables = frappe.db.sql(
        "SELECT COALESCE(SUM(outstanding_amount), 0) FROM `tabPurchase Invoice` WHERE docstatus=1 AND outstanding_amount > 0 AND due_date <= %s",
        (add_days(today(), 30),),
    )[0][0] or 0

    return {
        "cash_on_hand": float(cash_balance),
        "scheduled_payables": float(scheduled_payables),
        "available_after_bills": float(cash_balance) - float(scheduled_payables),
    }


@frappe.whitelist()
def get_inventory_aging():
    """Returns aging buckets for inventory."""
    rows = frappe.db.sql(
        """
        SELECT
            b.name AS batch_no,
            b.item AS item,
            DATEDIFF(NOW(), b.creation) AS age_days,
            COALESCE(sle.qty, 0) AS qty
        FROM `tabBatch` b
        JOIN (
            SELECT batch_no, SUM(actual_qty) AS qty
            FROM `tabStock Ledger Entry`
            WHERE is_cancelled = 0
            GROUP BY batch_no
            HAVING qty > 0
        ) sle ON sle.batch_no = b.name
        ORDER BY age_days DESC
        LIMIT 200
        """,
        as_dict=True,
    )
    buckets = {"fresh": 0, "moderate": 0, "aging": 0, "critical": 0}
    for r in rows:
        age = r.age_days or 0
        if age <= 7:
            buckets["fresh"] += 1
        elif age <= 14:
            buckets["moderate"] += 1
        elif age <= 30:
            buckets["aging"] += 1
        else:
            buckets["critical"] += 1

    return {"buckets": buckets, "batches": rows[:50]}

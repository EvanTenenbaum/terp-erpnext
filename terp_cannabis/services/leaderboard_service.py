"""
Leaderboard service — computes weekly client rankings.
"""
from __future__ import unicode_literals
import frappe
from frappe.utils import today


def compute_weekly_rankings():
    """Weekly scheduled job. Score all customers and write Leaderboard Rank History."""
    weights = _get_weights()
    customers = frappe.get_all("Customer", filters={"disabled": 0}, fields=["name"])

    rankings = []
    for c in customers:
        scores = _score_customer(c.name)
        master = sum(
            scores.get(w["metric_name"], 0) * w["weight_pct"] / 100
            for w in weights
        )
        rankings.append({
            "customer": c.name,
            "master_score": round(master, 2),
            "financial_score": scores.get("Order Volume", 0),
            "engagement_score": scores.get("Order Frequency", 0),
            "reliability_score": scores.get("Payment Speed", 0),
            "growth_score": scores.get("Growth", 0),
        })

    rankings.sort(key=lambda x: x["master_score"], reverse=True)

    for rank, entry in enumerate(rankings, 1):
        frappe.get_doc({
            "doctype": "Leaderboard Rank History",
            "customer": entry["customer"],
            "rank_date": today(),
            "rank": rank,
            "master_score": entry["master_score"],
            "financial_score": entry["financial_score"],
            "engagement_score": entry["engagement_score"],
            "reliability_score": entry["reliability_score"],
            "growth_score": entry["growth_score"],
        }).insert(ignore_permissions=True)

    frappe.db.commit()


def _get_weights():
    return frappe.get_all(
        "Leaderboard Weight Config",
        fields=["metric_name", "weight_pct"],
    )


def _score_customer(customer):
    """Returns dict of metric_name → score (0-100) for a customer."""
    from frappe.utils import add_months, nowdate

    # Order Volume — normalized by max across all customers (simplified: raw total)
    total = frappe.db.sql(
        "SELECT COALESCE(SUM(grand_total), 0) FROM `tabSales Invoice` WHERE customer=%s AND docstatus=1",
        (customer,),
    )[0][0] or 0

    # Payment Speed — avg days to pay (lower = better)
    avg_days = frappe.db.sql(
        """
        SELECT AVG(DATEDIFF(pe.posting_date, si.due_date))
        FROM `tabPayment Entry` pe
        JOIN `tabPayment Entry Reference` per ON per.parent = pe.name
        JOIN `tabSales Invoice` si ON si.name = per.reference_name
        WHERE si.customer = %s AND pe.docstatus = 1
        """,
        (customer,),
    )[0][0]

    payment_speed_score = 100 if avg_days is None else max(0, 100 - int(avg_days or 0))

    return {
        "Order Volume": min(100, total / 1000),  # rough scale
        "Order Frequency": 50,  # TODO: compute from order dates
        "Payment Speed": payment_speed_score,
        "Referrals": 0,
        "Loyalty": 50,
    }

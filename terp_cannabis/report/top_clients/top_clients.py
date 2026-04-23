# Copyright (c) 2026, Evan Tenenbaum and contributors
# For license information, please see license.txt
"""
Top Clients Script Report.

Aggregates submitted Sales Invoices per customer and ranks them by total
revenue.  Includes outstanding balance and days since last invoice.
"""

from __future__ import unicode_literals

import frappe
from frappe import _
from frappe.utils import date_diff, nowdate


def execute(filters=None):
	filters = frappe._dict(filters or {})
	columns = get_columns()
	data = get_data(filters)
	return columns, data


def get_columns():
	return [
		{"fieldname": "rank", "label": _("Rank"), "fieldtype": "Int", "width": 80},
		{"fieldname": "customer", "label": _("Customer"), "fieldtype": "Link", "options": "Customer", "width": 220},
		{"fieldname": "total_orders", "label": _("Total Orders"), "fieldtype": "Int", "width": 120},
		{"fieldname": "revenue", "label": _("Revenue"), "fieldtype": "Currency", "width": 140},
		{"fieldname": "avg_order_value", "label": _("Avg Order Value"), "fieldtype": "Currency", "width": 140},
		{"fieldname": "outstanding_balance", "label": _("Outstanding Balance"), "fieldtype": "Currency", "width": 160},
		{"fieldname": "days_since_last_order", "label": _("Days Since Last Order"), "fieldtype": "Int", "width": 160},
	]


def get_data(filters):
	conditions = ["si.docstatus = 1"]
	params = {}

	if filters.get("from_date"):
		conditions.append("si.posting_date >= %(from_date)s")
		params["from_date"] = filters.from_date
	if filters.get("to_date"):
		conditions.append("si.posting_date <= %(to_date)s")
		params["to_date"] = filters.to_date

	where_sql = " AND ".join(conditions)

	query = f"""
		SELECT
			si.customer                                AS customer,
			COUNT(DISTINCT si.name)                    AS total_orders,
			SUM(si.base_grand_total)                   AS revenue,
			SUM(si.outstanding_amount)                 AS outstanding_balance,
			MAX(si.posting_date)                       AS last_order_date
		FROM `tabSales Invoice` si
		WHERE {where_sql}
		GROUP BY si.customer
		ORDER BY revenue DESC
	"""

	rows = frappe.db.sql(query, params, as_dict=True)

	today = nowdate()
	out = []
	for idx, r in enumerate(rows, start=1):
		orders = r.get("total_orders") or 0
		revenue = r.get("revenue") or 0
		avg = (revenue / orders) if orders else 0
		days_since = 0
		if r.get("last_order_date"):
			try:
				days_since = date_diff(today, r["last_order_date"])
			except Exception:
				days_since = 0
		out.append({
			"rank": idx,
			"customer": r.get("customer"),
			"total_orders": orders,
			"revenue": revenue,
			"avg_order_value": avg,
			"outstanding_balance": r.get("outstanding_balance") or 0,
			"days_since_last_order": days_since,
		})
	return out

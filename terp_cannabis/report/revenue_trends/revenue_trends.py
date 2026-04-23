# Copyright (c) 2026, Evan Tenenbaum and contributors
# For license information, please see license.txt
"""
Revenue Trends Script Report.

Aggregates Sales Invoice data by calendar month (posting_date) returning
revenue, order count, average order value and unique client count for each
month in the filtered window.
"""

from __future__ import unicode_literals

import frappe
from frappe import _


def execute(filters=None):
	filters = frappe._dict(filters or {})
	columns = get_columns()
	data = get_data(filters)
	return columns, data


def get_columns():
	return [
		{"fieldname": "month", "label": _("Month"), "fieldtype": "Data", "width": 120},
		{"fieldname": "revenue", "label": _("Revenue"), "fieldtype": "Currency", "width": 140},
		{"fieldname": "orders", "label": _("Orders"), "fieldtype": "Int", "width": 100},
		{"fieldname": "avg_order_value", "label": _("Avg Order Value"), "fieldtype": "Currency", "width": 140},
		{"fieldname": "unique_clients", "label": _("Unique Clients"), "fieldtype": "Int", "width": 120},
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

	join_clause = ""
	if filters.get("item_group"):
		join_clause = (
			"JOIN `tabSales Invoice Item` sii ON sii.parent = si.name "
			"JOIN `tabItem` item ON item.name = sii.item_code "
		)
		conditions.append("item.item_group = %(item_group)s")
		params["item_group"] = filters.item_group

	where_sql = " AND ".join(conditions)

	query = f"""
		SELECT
			YEAR(si.posting_date)  AS yr,
			MONTH(si.posting_date) AS mo,
			SUM(si.base_grand_total)     AS revenue,
			COUNT(DISTINCT si.name)      AS orders,
			COUNT(DISTINCT si.customer)  AS unique_clients
		FROM `tabSales Invoice` si
		{join_clause}
		WHERE {where_sql}
		GROUP BY YEAR(si.posting_date), MONTH(si.posting_date)
		ORDER BY yr ASC, mo ASC
	"""

	rows = frappe.db.sql(query, params, as_dict=True)

	out = []
	for r in rows:
		orders = r.get("orders") or 0
		revenue = r.get("revenue") or 0
		avg = (revenue / orders) if orders else 0
		out.append({
			"month": f"{int(r['yr']):04d}-{int(r['mo']):02d}",
			"revenue": revenue,
			"orders": orders,
			"avg_order_value": avg,
			"unique_clients": r.get("unique_clients") or 0,
		})
	return out

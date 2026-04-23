# Copyright (c) 2026, Evan Tenenbaum and contributors
# For license information, please see license.txt
"""
Inventory Aging Script Report.

Aggregates current on-hand quantity per Batch from Stock Ledger Entry and
joins it with Batch custom fields (batch_status, supplier, unit_cost) and Item
metadata.  Each batch is bucketed by age (days since creation).
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
		{"fieldname": "sku", "label": _("SKU"), "fieldtype": "Link", "options": "Item", "width": 140},
		{"fieldname": "product", "label": _("Product"), "fieldtype": "Data", "width": 220},
		{"fieldname": "supplier", "label": _("Supplier"), "fieldtype": "Link", "options": "Supplier", "width": 160},
		{"fieldname": "batch", "label": _("Batch"), "fieldtype": "Link", "options": "Batch", "width": 140},
		{"fieldname": "qty_on_hand", "label": _("Qty On Hand"), "fieldtype": "Float", "width": 120},
		{"fieldname": "age_days", "label": _("Age (Days)"), "fieldtype": "Int", "width": 100},
		{"fieldname": "category", "label": _("Category"), "fieldtype": "Link", "options": "Item Group", "width": 120},
		{"fieldname": "status", "label": _("Status"), "fieldtype": "Data", "width": 120},
		{"fieldname": "age_bucket", "label": _("Age Bucket"), "fieldtype": "Data", "width": 140},
	]


def _age_bucket(age_days):
	if age_days is None:
		return ""
	if age_days <= 7:
		return "Fresh (0-7d)"
	if age_days <= 14:
		return "Moderate (8-14d)"
	if age_days <= 30:
		return "Aging (15-30d)"
	return "Critical (30+d)"


def get_data(filters):
	conditions = ["sle.docstatus < 2", "sle.batch_no IS NOT NULL", "sle.batch_no != ''"]
	params = {}

	if filters.get("warehouse"):
		conditions.append("sle.warehouse = %(warehouse)s")
		params["warehouse"] = filters.warehouse

	if filters.get("item_group"):
		conditions.append("item.item_group = %(item_group)s")
		params["item_group"] = filters.item_group

	where_sql = " AND ".join(conditions)

	query = f"""
		SELECT
			sle.item_code                                   AS sku,
			item.item_name                                  AS product,
			item.item_group                                 AS category,
			sle.batch_no                                    AS batch,
			SUM(sle.actual_qty)                             AS qty_on_hand,
			batch.creation                                  AS batch_created,
			batch.batch_status                              AS status,
			batch.supplier                                  AS supplier
		FROM `tabStock Ledger Entry` sle
		LEFT JOIN `tabItem`  item  ON item.name  = sle.item_code
		LEFT JOIN `tabBatch` batch ON batch.name = sle.batch_no
		WHERE {where_sql}
		GROUP BY sle.item_code, sle.batch_no
		HAVING SUM(sle.actual_qty) > 0
		ORDER BY batch.creation ASC
	"""

	rows = frappe.db.sql(query, params, as_dict=True)

	today = nowdate()
	min_age = int(filters.get("min_age_days") or 0)
	out = []
	for r in rows:
		age_days = 0
		if r.get("batch_created"):
			try:
				age_days = date_diff(today, r["batch_created"])
			except Exception:
				age_days = 0
		if age_days < min_age:
			continue
		out.append({
			"sku": r.get("sku"),
			"product": r.get("product"),
			"supplier": r.get("supplier"),
			"batch": r.get("batch"),
			"qty_on_hand": r.get("qty_on_hand") or 0,
			"age_days": age_days,
			"category": r.get("category"),
			"status": r.get("status"),
			"age_bucket": _age_bucket(age_days),
		})
	return out

# Copyright (c) 2026, Evan Tenenbaum and contributors
# For license information, please see license.txt
"""
Shrinkage Report Script Report.

Lists every Material Issue Stock Entry line within the filtered date window
so product/batch level shrinkage can be audited.  Shrinkage value =
Qty * basic_rate (unit cost at issue time).
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
		{"fieldname": "date", "label": _("Date"), "fieldtype": "Date", "width": 110},
		{"fieldname": "batch", "label": _("Batch"), "fieldtype": "Link", "options": "Batch", "width": 140},
		{"fieldname": "product", "label": _("Product"), "fieldtype": "Link", "options": "Item", "width": 220},
		{"fieldname": "qty_lost", "label": _("Qty Lost"), "fieldtype": "Float", "width": 120},
		{"fieldname": "unit_cost", "label": _("Unit Cost"), "fieldtype": "Currency", "width": 120},
		{"fieldname": "shrinkage_value", "label": _("Shrinkage Value"), "fieldtype": "Currency", "width": 140},
		{"fieldname": "reason", "label": _("Reason"), "fieldtype": "Data", "width": 200},
		{"fieldname": "entered_by", "label": _("Entered By"), "fieldtype": "Link", "options": "User", "width": 160},
	]


def get_data(filters):
	conditions = [
		"se.docstatus = 1",
		"se.purpose = 'Material Issue'",
	]
	params = {}

	if filters.get("from_date"):
		conditions.append("se.posting_date >= %(from_date)s")
		params["from_date"] = filters.from_date
	if filters.get("to_date"):
		conditions.append("se.posting_date <= %(to_date)s")
		params["to_date"] = filters.to_date
	if filters.get("warehouse"):
		conditions.append("sed.s_warehouse = %(warehouse)s")
		params["warehouse"] = filters.warehouse

	where_sql = " AND ".join(conditions)

	rows = frappe.db.sql(
		f"""
		SELECT
			se.posting_date                 AS date,
			sed.batch_no                    AS batch,
			sed.item_code                   AS product,
			sed.qty                         AS qty_lost,
			sed.basic_rate                  AS unit_cost,
			(sed.qty * sed.basic_rate)      AS shrinkage_value,
			se.remarks                      AS reason,
			se.owner                        AS entered_by
		FROM `tabStock Entry` se
		JOIN `tabStock Entry Detail` sed ON sed.parent = se.name
		WHERE {where_sql}
		ORDER BY se.posting_date DESC
		""",
		params,
		as_dict=True,
	)
	return rows

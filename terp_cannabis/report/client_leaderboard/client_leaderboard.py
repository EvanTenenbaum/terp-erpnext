# Copyright (c) 2026, Evan Tenenbaum and contributors
# For license information, please see license.txt
"""
Client Leaderboard Script Report.

Reads the most recent Leaderboard Rank History snapshot (or the one matching
the rank_date filter) and returns rows ordered by rank ascending.
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
		{"fieldname": "rank", "label": _("Rank"), "fieldtype": "Int", "width": 80},
		{"fieldname": "customer", "label": _("Customer"), "fieldtype": "Link", "options": "Customer", "width": 220},
		{"fieldname": "master_score", "label": _("Master Score"), "fieldtype": "Float", "width": 120},
		{"fieldname": "financial_score", "label": _("Financial Score"), "fieldtype": "Float", "width": 120},
		{"fieldname": "engagement_score", "label": _("Engagement Score"), "fieldtype": "Float", "width": 140},
		{"fieldname": "reliability_score", "label": _("Reliability Score"), "fieldtype": "Float", "width": 140},
		{"fieldname": "growth_score", "label": _("Growth Score"), "fieldtype": "Float", "width": 120},
	]


def get_data(filters):
	rank_date = filters.get("rank_date")
	if not rank_date:
		rank_date = frappe.db.sql(
			"SELECT MAX(rank_date) FROM `tabLeaderboard Rank History`"
		)
		rank_date = rank_date[0][0] if rank_date else None

	if not rank_date:
		return []

	rows = frappe.db.sql(
		"""
		SELECT
			`rank`             AS `rank`,
			customer           AS customer,
			master_score       AS master_score,
			financial_score    AS financial_score,
			engagement_score   AS engagement_score,
			reliability_score  AS reliability_score,
			growth_score       AS growth_score
		FROM `tabLeaderboard Rank History`
		WHERE rank_date = %(rank_date)s
		ORDER BY `rank` ASC
		""",
		{"rank_date": rank_date},
		as_dict=True,
	)
	return rows

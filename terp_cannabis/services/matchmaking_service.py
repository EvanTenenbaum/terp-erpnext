"""
Matchmaking service — matches Client Needs to Supplier Supply.
"""
from __future__ import unicode_literals
import frappe


def get_all_suggested_matches():
    """Daily scheduled job. For each active Client Need, find matching supply."""
    needs = frappe.get_all(
        "Client Need",
        filters={"status": "Active"},
        fields=["name", "item_group", "strain", "product_type",
                "quantity_needed", "unit", "max_price"],
    )
    for need in needs:
        _match_need(need)
    frappe.db.commit()


def _match_need(need):
    filters = {"status": "Available"}
    if need.item_group:
        filters["item_group"] = need.item_group
    if need.product_type:
        filters["product_type"] = need.product_type

    supplies = frappe.get_all(
        "Supplier Supply",
        filters=filters,
        fields=["name", "supplier", "quantity_available", "ask_price", "strain"],
    )

    for supply in supplies:
        score = _score_match(need, supply)
        if score < 40:
            continue
        existing = frappe.db.exists(
            "Match Record", {"client_need": need.name, "supplier_supply": supply.name}
        )
        if existing:
            frappe.db.set_value("Match Record", existing, "match_score", score)
        else:
            frappe.get_doc({
                "doctype": "Match Record",
                "client_need": need.name,
                "supplier_supply": supply.name,
                "match_score": score,
                "match_reason": _explain_match(need, supply, score),
                "status": "Suggested",
            }).insert(ignore_permissions=True)


def _score_match(need, supply):
    score = 50  # base

    # Strain match
    if need.strain and supply.strain:
        if need.strain == supply.strain:
            score += 30
        else:
            score -= 20

    # Price match
    if need.max_price and supply.ask_price:
        if supply.ask_price <= need.max_price:
            score += 20
        else:
            over_pct = (supply.ask_price - need.max_price) / need.max_price * 100
            score -= min(int(over_pct), 40)

    # Quantity match
    if need.quantity_needed and supply.quantity_available:
        if supply.quantity_available >= need.quantity_needed:
            score += 10
        else:
            score -= 5

    return max(0, min(100, score))


def _explain_match(need, supply, score):
    parts = []
    if need.strain and supply.strain == need.strain:
        parts.append(f"Strain match: {need.strain}")
    if need.item_group:
        parts.append(f"Category: {need.item_group}")
    parts.append(f"Score: {score}/100")
    return "; ".join(parts)

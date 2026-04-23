"""
Pricing service — evaluates unit price, COGS, and margin for a Sales Order line.

TERP pricing model:
  1. Look up the batch's COGS (fixed or LOW/MID/HIGH range)
  2. Find the applicable Pricing Profile for this customer
  3. Apply markup from profile rule matching the item group / product type
  4. Return unit_price, cogs, margin_pct, margin_usd, applied_rules
"""
from __future__ import unicode_literals
import frappe


def evaluate_price(item_code, batch_no, customer, qty=1, pricing_profile=None):
    """
    Returns a dict:
      {
        unit_price: float,
        cogs: float,
        cogs_mode: 'FIXED'|'RANGE',
        cogs_basis: 'LOW'|'MID'|'HIGH',
        margin_pct: float,
        margin_usd: float,
        applied_rules: list[str],
        overrides: dict,
      }
    """
    # 1. Get COGS from batch / item
    cogs_data = _get_cogs(item_code, batch_no, customer)

    # 2. Get markup from pricing profile
    markup = _get_markup(item_code, customer, pricing_profile)

    cogs = cogs_data["cogs"]
    if cogs <= 0:
        return {
            "unit_price": 0,
            "cogs": 0,
            "cogs_mode": cogs_data.get("cogs_mode", "FIXED"),
            "cogs_basis": cogs_data.get("basis", "MID"),
            "margin_pct": 0,
            "margin_usd": 0,
            "applied_rules": [],
            "overrides": {},
        }

    unit_price = cogs * (1 + markup / 100)
    margin_usd = unit_price - cogs
    margin_pct = (margin_usd / unit_price * 100) if unit_price else 0

    return {
        "unit_price": round(unit_price, 4),
        "cogs": round(cogs, 4),
        "cogs_mode": cogs_data.get("cogs_mode", "FIXED"),
        "cogs_basis": cogs_data.get("basis", "MID"),
        "margin_pct": round(margin_pct, 2),
        "margin_usd": round(margin_usd, 4),
        "applied_rules": cogs_data.get("applied_rules", []),
        "overrides": {},
    }


def _get_cogs(item_code, batch_no, customer):
    """
    COGS priority:
      1. Customer-specific COGS Rule (highest priority)
      2. Item Group COGS Rule
      3. Global COGS Rule
      4. Batch-level custom COGS fields
      5. Item-level COGS fields
      6. Default 0
    """
    applied_rules = []

    # Check for a matching COGS Rule
    rules = frappe.get_all(
        "COGS Rule",
        filters={"is_active": 1},
        fields=["name", "applies_to", "customer", "item_group",
                "cogs_mode", "fixed_cogs", "cogs_low", "cogs_mid", "cogs_high", "priority"],
        order_by="priority desc",
    )

    item_group = frappe.db.get_value("Item", item_code, "item_group")

    for rule in rules:
        if rule.applies_to == "Specific Customer" and rule.customer != customer:
            continue
        if rule.item_group and rule.item_group != item_group:
            continue
        # Rule matches
        applied_rules.append(rule.name)
        if rule.cogs_mode == "FIXED":
            return {"cogs": rule.fixed_cogs or 0, "cogs_mode": "FIXED", "basis": None, "applied_rules": applied_rules}
        else:
            mid = rule.cogs_mid or ((rule.cogs_low or 0) + (rule.cogs_high or 0)) / 2
            return {"cogs": mid, "cogs_mode": "RANGE", "basis": "MID",
                    "cogs_low": rule.cogs_low, "cogs_high": rule.cogs_high,
                    "applied_rules": applied_rules}

    # Fall back to batch custom fields
    if batch_no:
        batch = frappe.db.get_value(
            "Batch", batch_no,
            ["unit_cost", "cogs_mode_custom", "vendor_range_low", "vendor_range_high"],
            as_dict=True,
        ) or {}
        if batch.get("unit_cost"):
            return {"cogs": batch["unit_cost"], "cogs_mode": "FIXED", "basis": None, "applied_rules": []}

    # Fall back to item custom fields
    item = frappe.db.get_value(
        "Item", item_code,
        ["cogs_mode", "cogs_fixed", "cogs_low", "cogs_mid", "cogs_high"],
        as_dict=True,
    ) or {}
    if item.get("cogs_mode") == "FIXED":
        return {"cogs": item.get("cogs_fixed") or 0, "cogs_mode": "FIXED", "basis": None, "applied_rules": []}
    if item.get("cogs_mode") == "RANGE":
        mid = item.get("cogs_mid") or 0
        return {"cogs": mid, "cogs_mode": "RANGE", "basis": "MID", "applied_rules": []}

    return {"cogs": 0, "cogs_mode": "FIXED", "basis": None, "applied_rules": []}


def _get_markup(item_code, customer, pricing_profile_name=None):
    """
    Return markup percentage to apply on top of COGS.
    Priority: Pricing Profile rule > Customer-specific > Global default
    """
    if pricing_profile_name:
        profile = frappe.get_doc("Pricing Profile", pricing_profile_name)
        item_group = frappe.db.get_value("Item", item_code, "item_group")
        for rule in profile.rules:
            if rule.item_group and rule.item_group != item_group:
                continue
            return rule.markup_pct or profile.base_markup_pct or 0
        return profile.base_markup_pct or 0

    # No profile — look for customer-linked profile
    customer_profile = frappe.db.get_value(
        "Pricing Profile", {"customer": customer}, "name"
    )
    if customer_profile:
        return _get_markup(item_code, customer, customer_profile)

    return 0  # No markup configured → sell at COGS (shouldn't happen in practice)

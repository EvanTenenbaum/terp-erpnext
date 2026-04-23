"""
seed_masters.py — run after install to create ERPNext master data
that can't be expressed as simple fixture JSON (requires Python logic).

Usage: bench --site terp.localhost execute terp_cannabis.install.seed_erpnext_masters
"""
from __future__ import unicode_literals
import frappe


def seed_erpnext_masters():
    """Idempotent seed of company, CoA, warehouses, UOMs, payment terms, item groups."""
    _seed_company()
    _seed_uoms()
    _seed_payment_terms()
    _seed_item_groups()
    _seed_warehouses()
    _seed_accounts()
    frappe.db.commit()
    frappe.msgprint("ERPNext master data seeded.", alert=True)


def _seed_company():
    if frappe.db.exists("Company", "TERP Cannabis"):
        return
    frappe.get_doc({
        "doctype": "Company",
        "company_name": "TERP Cannabis",
        "abbr": "TERP",
        "default_currency": "USD",
        "country": "United States",
        "domain": "Distribution",
    }).insert(ignore_permissions=True)
    frappe.db.commit()


def _seed_uoms():
    uoms = [
        ("Pound", "LB", False),
        ("Ounce", "OZ", False),
        ("Gram", "G", False),
        ("Kilogram", "KG", False),
        ("Each", "EA", False),
        ("Milliliter", "ML", False),
    ]
    for name, abbr, whole in uoms:
        if not frappe.db.exists("UOM", name):
            frappe.get_doc({
                "doctype": "UOM",
                "uom_name": name,
                "must_be_whole_number": 1 if whole else 0,
            }).insert(ignore_permissions=True)


def _seed_payment_terms():
    terms = [
        ("Cash on Delivery", 0, "Day(s) after invoice date"),
        ("Consignment", 30, "Day(s) after invoice date"),
        ("Net 30", 30, "Day(s) after invoice date"),
        ("Net 15", 15, "Day(s) after invoice date"),
        ("Net 7", 7, "Day(s) after invoice date"),
    ]
    for name, days, basis in terms:
        if not frappe.db.exists("Payment Term", name):
            frappe.get_doc({
                "doctype": "Payment Term",
                "payment_term_name": name,
                "credit_days": days,
                "due_date_based_on": basis,
            }).insert(ignore_permissions=True)


def _seed_item_groups():
    root = "Cannabis Products"
    if not frappe.db.exists("Item Group", root):
        frappe.get_doc({
            "doctype": "Item Group",
            "item_group_name": root,
            "is_group": 1,
            "parent_item_group": "All Item Groups",
        }).insert(ignore_permissions=True)

    categories = [
        ("Flower", root, 1),
        ("Pre-Roll", root, 0),
        ("Concentrate", root, 0),
        ("Edible", root, 0),
        ("Vape", root, 0),
        ("Tincture", root, 0),
        ("Topical", root, 0),
    ]
    for name, parent, is_group in categories:
        if not frappe.db.exists("Item Group", name):
            frappe.get_doc({
                "doctype": "Item Group",
                "item_group_name": name,
                "parent_item_group": parent,
                "is_group": is_group,
            }).insert(ignore_permissions=True)

    flower_subs = ["Indoor", "Outdoor", "Greenhouse", "Smalls", "Shake"]
    for sub in flower_subs:
        name = f"Flower - {sub}"
        if not frappe.db.exists("Item Group", name):
            frappe.get_doc({
                "doctype": "Item Group",
                "item_group_name": name,
                "parent_item_group": "Flower",
                "is_group": 0,
            }).insert(ignore_permissions=True)


def _seed_warehouses():
    company = "TERP Cannabis"
    warehouses = ["Main Warehouse", "TERP House Premium", "Cold Storage"]
    for wh in warehouses:
        if not frappe.db.exists("Warehouse", {"warehouse_name": wh, "company": company}):
            frappe.get_doc({
                "doctype": "Warehouse",
                "warehouse_name": wh,
                "company": company,
                "is_group": 0,
            }).insert(ignore_permissions=True)


def _seed_accounts():
    """
    Seed the minimal Cannabis-specific accounts that aren't in ERPNext's
    default US CoA. Standard accounts (AR, AP, Cash, Sales, COGS, etc.)
    are created automatically when the company is set up.
    """
    company = "TERP Cannabis"
    if not frappe.db.exists("Company", company):
        return

    extra_accounts = [
        {
            "account_name": "Bad Debt Expense",
            "parent_account": f"Indirect Expenses - {frappe.db.get_value('Company', company, 'abbr')}",
            "account_type": "Expense Account",
            "root_type": "Expense",
        },
        {
            "account_name": "Referral Credits Payable",
            "parent_account": f"Current Liabilities - {frappe.db.get_value('Company', company, 'abbr')}",
            "account_type": "Payable",
            "root_type": "Liability",
        },
        {
            "account_name": "Crypto Holdings",
            "parent_account": f"Current Assets - {frappe.db.get_value('Company', company, 'abbr')}",
            "account_type": "Bank",
            "root_type": "Asset",
        },
    ]
    for acct in extra_accounts:
        if not frappe.db.exists("Account", {"account_name": acct["account_name"], "company": company}):
            try:
                frappe.get_doc({
                    "doctype": "Account",
                    "company": company,
                    **acct,
                }).insert(ignore_permissions=True)
            except Exception:
                pass  # Parent account may not exist in all CoA setups

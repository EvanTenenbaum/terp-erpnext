import frappe


def after_install():
    """Run after `bench install-app terp_cannabis`."""
    _create_roles()
    _seed_workflow_statuses()
    _seed_product_grades()
    _seed_strains()
    _seed_leaderboard_weights()
    _seed_payment_followup_templates()
    _seed_org_settings()
    _configure_site()
    frappe.db.commit()
    frappe.msgprint("TERP Cannabis app installed successfully.", alert=True)


def after_migrate():
    """Run after `bench migrate`."""
    frappe.db.commit()


def _create_roles():
    roles = [
        ("TERP Owner", "Full access — all modules, all operations"),
        ("TERP Accounts Manager", "Full accounting, invoices, payments, GL, credit management"),
        ("TERP Sales Rep", "Orders, quotes, customers, catalogues — no COGS by default"),
        ("TERP Inventory Manager", "Batches, intake, receiving, shipping, photography, samples"),
        ("TERP Fulfillment", "Pick/pack and shipping only"),
        ("TERP Auditor", "Read-only across all modules"),
        ("TERP VIP Client", "VIP portal access only — no Desk"),
    ]
    for role_name, description in roles:
        if not frappe.db.exists("Role", role_name):
            doc = frappe.get_doc({
                "doctype": "Role",
                "role_name": role_name,
                "desk_access": 1 if "VIP Client" not in role_name else 0,
            })
            doc.insert(ignore_permissions=True)


def _seed_workflow_statuses():
    statuses = [
        ("Awaiting Intake", "gray", 10),
        ("Live", "blue", 20),
        ("Photographed", "green", 30),
        ("Ready to Ship", "yellow", 40),
        ("Sold Out", "red", 50),
        ("Archived", "gray", 60),
    ]
    for name, color, order in statuses:
        if not frappe.db.exists("Workflow Queue Status", name):
            frappe.get_doc({
                "doctype": "Workflow Queue Status",
                "status_name": name,
                "status_color": color,
                "sort_order": order,
                "is_terminal": name in ("Sold Out", "Archived"),
            }).insert(ignore_permissions=True)


def _seed_product_grades():
    grades = [
        ("AAA", "Top Shelf / Premium"),
        ("AA", "Mid-Tier"),
        ("A", "Standard"),
        ("B", "Economy"),
        ("C", "Budget / Trim"),
        ("Smalls", "Small Buds"),
        ("Shake", "Shake / Trim"),
        ("Pre-Ground", "Pre-Ground"),
        ("Indoor", "Indoor Grown"),
        ("Outdoor", "Outdoor Grown"),
        ("Greenhouse", "Greenhouse Grown"),
    ]
    for code, label in grades:
        if not frappe.db.exists("Product Grade", code):
            frappe.get_doc({
                "doctype": "Product Grade",
                "grade_code": code,
                "grade_label": label,
            }).insert(ignore_permissions=True)


def _seed_strains():
    strains = [
        ("Blue Dream", "Hybrid"),
        ("OG Kush", "Indica"),
        ("Gelato", "Hybrid"),
        ("Wedding Cake", "Hybrid"),
        ("Gorilla Glue #4", "Hybrid"),
        ("Runtz", "Hybrid"),
        ("Zkittlez", "Indica"),
        ("MAC", "Hybrid"),
        ("Biscotti", "Indica"),
        ("Pineapple Express", "Sativa"),
        ("Apple Fritter", "Hybrid"),
        ("Do-Si-Dos", "Indica"),
        ("Cereal Milk", "Hybrid"),
        ("Biscotti", "Indica"),
        ("Sour Diesel", "Sativa"),
        ("Girl Scout Cookies", "Hybrid"),
        ("Purple Punch", "Indica"),
        ("Jack Herer", "Sativa"),
        ("White Widow", "Hybrid"),
        ("Strawberry Cough", "Sativa"),
    ]
    seen = set()
    for name, strain_type in strains:
        if name in seen:
            continue
        seen.add(name)
        if not frappe.db.exists("THCA Strain", name):
            frappe.get_doc({
                "doctype": "THCA Strain",
                "strain_name": name,
                "strain_type": strain_type,
                "is_active": 1,
            }).insert(ignore_permissions=True)


def _seed_leaderboard_weights():
    weights = [
        ("Order Volume", 30, "Total number and value of orders placed"),
        ("Payment Speed", 25, "How quickly the client pays invoices"),
        ("Order Frequency", 20, "Regularity of orders over time"),
        ("Referrals", 15, "Number and value of referred clients"),
        ("Loyalty", 10, "Tenure and consistency as a client"),
    ]
    for name, pct, desc in weights:
        if not frappe.db.exists("Leaderboard Weight Config", name):
            frappe.get_doc({
                "doctype": "Leaderboard Weight Config",
                "metric_name": name,
                "weight_pct": pct,
                "description": desc,
            }).insert(ignore_permissions=True)


def _seed_payment_followup_templates():
    templates = [
        {
            "template_name": "7-Day Follow-Up",
            "channel": "Email",
            "subject_template": "Invoice Reminder — {customer_name} owes ${amount}",
            "body_template": (
                "Hi {customer_name},\n\nThis is a friendly reminder that your invoice "
                "for ${amount} is now {days_overdue} days past due.\n\nPlease arrange "
                "payment at your earliest convenience.\n\nThank you,\nTERP Cannabis"
            ),
        },
        {
            "template_name": "30-Day Follow-Up",
            "channel": "SMS",
            "subject_template": "Payment Due — ${amount}",
            "body_template": (
                "{customer_name}, your account balance of ${amount} is {days_overdue} "
                "days overdue. Please contact us to arrange payment. — TERP Cannabis"
            ),
        },
        {
            "template_name": "60-Day Final Notice",
            "channel": "Email",
            "subject_template": "FINAL NOTICE — {customer_name} — ${amount} Overdue",
            "body_template": (
                "Hi {customer_name},\n\nThis is a final notice regarding your outstanding "
                "balance of ${amount}, which is now {days_overdue} days overdue.\n\n"
                "Please contact us immediately to avoid further action.\n\nTERP Cannabis"
            ),
        },
    ]
    for t in templates:
        if not frappe.db.exists("Payment Followup Template", t["template_name"]):
            frappe.get_doc({**{"doctype": "Payment Followup Template"}, **t}).insert(
                ignore_permissions=True
            )


def _seed_org_settings():
    if not frappe.db.exists("Organization Settings", "Organization Settings"):
        frappe.get_doc({
            "doctype": "Organization Settings",
            "show_grade_field": 1,
            "require_grade": 0,
            "show_expected_delivery_date": 1,
            "enable_packaged_unit_type": 0,
            "cogs_display_mode": "Admin Only",
            "show_cogs_in_orders": 0,
            "show_margin_in_orders": 0,
        }).insert(ignore_permissions=True)


def _configure_site():
    """Site-level configuration applied programmatically."""
    frappe.db.set_single_value("System Settings", "enable_two_factor_auth", 0)

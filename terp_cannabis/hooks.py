from __future__ import unicode_literals

app_name = "terp_cannabis"
app_title = "TERP Cannabis"
app_publisher = "Evan Tenenbaum"
app_description = "THCA wholesale cannabis ERP — built on top of ERPNext"
app_email = "evan@evanmail.com"
app_license = "MIT"
app_version = "0.1.0"

required_apps = ["erpnext"]

# ─── Modules hidden from all users ──────────────────────────────────────────
# Modules that exist in ERPNext/Frappe but are irrelevant to cannabis wholesale
hide_modules = [
    "Manufacturing",
    "HR",
    "Payroll",
    "Healthcare",
    "Point of Sale",
    "Education",
    "Agriculture",
    "Non Profit",
    "Quality Management",
    "Loan Management",
    "Hospitality",
]

# ─── Fixtures (exported to JSON on bench export-fixtures) ────────────────────
fixtures = [
    "THCA Strain",
    "Product Grade",
    "Workflow Queue Status",
    "Leaderboard Weight Config",
    "Organization Settings",
    "Feature Flag",
    "Payment Followup Template",
    {
        "dt": "Custom Field",
        "filters": [["module", "=", "Terp Cannabis"]],
    },
    {
        "dt": "Property Setter",
        "filters": [["module", "=", "Terp Cannabis"]],
    },
    {
        "dt": "Role",
        "filters": [["name", "in", [
            "TERP Owner",
            "TERP Accounts Manager",
            "TERP Sales Rep",
            "TERP Inventory Manager",
            "TERP Fulfillment",
            "TERP Auditor",
            "TERP VIP Client",
        ]]],
    },
]

# ─── Doc events (business logic hooks on ERPNext built-in DocTypes) ──────────
doc_events = {
    "Sales Order": {
        "validate": "terp_cannabis.controllers.order_controller.validate_pricing",
        "on_submit": "terp_cannabis.controllers.order_controller.on_submit",
        "on_cancel": "terp_cannabis.controllers.order_controller.on_cancel",
    },
    "Purchase Receipt": {
        "on_submit": "terp_cannabis.controllers.intake_controller.on_po_receipt_submit",
    },
    "Customer": {
        "after_insert": "terp_cannabis.controllers.customer_controller.after_insert",
    },
    "Batch": {
        "after_insert": "terp_cannabis.controllers.batch_controller.after_insert",
    },
    "Sales Invoice": {
        "on_submit": "terp_cannabis.controllers.accounting_controller.on_invoice_submit",
    },
    "Payment Entry": {
        "on_submit": "terp_cannabis.controllers.accounting_controller.on_payment_submit",
    },
}

# ─── Scheduled jobs ──────────────────────────────────────────────────────────
scheduler_events = {
    "daily": [
        "terp_cannabis.services.matchmaking_service.get_all_suggested_matches",
        "terp_cannabis.services.vendor_payable_service.check_vendor_payables",
        "terp_cannabis.services.notification_service.send_overdue_invoice_alerts",
        "terp_cannabis.services.notification_service.send_sample_due_alerts",
    ],
    "weekly": [
        "terp_cannabis.services.leaderboard_service.compute_weekly_rankings",
    ],
    "cron": {
        # Every 15 minutes — check for expected-today POs
        "*/15 * * * *": [
            "terp_cannabis.services.notification_service.check_expected_po_today",
        ],
    },
}

# ─── Global JS / CSS injected into Desk ─────────────────────────────────────
app_include_js = [
    "/assets/terp_cannabis/js/command_palette.js",
    "/assets/terp_cannabis/js/shortcuts.js",
    "/assets/terp_cannabis/js/item_form.js",
    "/assets/terp_cannabis/js/sales_order_form.js",
    "/assets/terp_cannabis/js/batch_form.js",
    "/assets/terp_cannabis/js/notification_bell.js",
    "/assets/terp_cannabis/js/spreadsheet_list.js",
]

app_include_css = [
    "/assets/terp_cannabis/css/terp_desk.css",
]

# ─── Web routes (VIP portal pages, shared catalogue) ────────────────────────
website_route_rules = [
    {"from_route": "/vip-portal/<path:name>", "to_route": "vip-portal"},
    {"from_route": "/shared/sales-sheet/<name>", "to_route": "shared/sales-sheet"},
    {"from_route": "/intake/verify/<name>", "to_route": "intake/verify"},
]

# ─── Override standard Frappe list queries (add cannabis-specific defaults) ──
standard_queries = {
    "Customer": "terp_cannabis.api.queries.customer_query",
    "Supplier": "terp_cannabis.api.queries.supplier_query",
    "Item": "terp_cannabis.api.queries.item_query",
    "Batch": "terp_cannabis.api.queries.batch_query",
}

# ─── Notification links ───────────────────────────────────────────────────────
notification_config = "terp_cannabis.notification_config.get_notification_config"

# ─── On app install (runs after bench install-app) ───────────────────────────
after_install = "terp_cannabis.install.after_install"
after_migrate = "terp_cannabis.install.after_migrate"

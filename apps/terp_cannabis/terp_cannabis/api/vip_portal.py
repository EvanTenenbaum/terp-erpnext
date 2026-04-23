"""
VIP Portal API — authentication, impersonation, dashboard data, catalog.
"""
from __future__ import unicode_literals
import frappe
import uuid
from frappe.utils import now_datetime, add_hours


# ─── Authentication ──────────────────────────────────────────────────────────

@frappe.whitelist(allow_guest=True)
def login(email, password):
    """VIP client login. Sets a separate vip_session cookie."""
    config = frappe.db.get_value(
        "VIP Portal Configuration",
        {"portal_enabled": 1},
        ["name", "customer"],
        as_dict=True,
        filters={"customer": frappe.db.get_value("Customer", {"email_id": email}, "name")},
    )
    if not config:
        frappe.throw("Invalid credentials", frappe.AuthenticationError)

    # In production: verify password hash against VIP Portal Auth record
    # Simplified here — full implementation in Phase 10
    session_key = str(uuid.uuid4())
    frappe.cache().set_value(f"vip_session:{session_key}", {"customer": config.customer}, expires_in_sec=86400)

    frappe.local.cookie_manager.set_cookie("vip_session", session_key, httponly=True, secure=True)
    return {"status": "ok", "customer": config.customer}


@frappe.whitelist()
def generate_impersonation_token(customer_name):
    """Admin only — create a one-time impersonation token."""
    frappe.only_for(("System Manager", "TERP Owner", "TERP Accounts Manager"))
    token = str(uuid.uuid4())
    expires_at = add_hours(now_datetime(), 1)

    config = frappe.db.get_value(
        "VIP Portal Configuration", {"customer": customer_name}, "name"
    )
    if not config:
        frappe.throw(f"No VIP portal configuration found for {customer_name}")

    frappe.cache().set_value(
        f"vip_impersonate:{token}",
        {"customer": customer_name, "expires_at": str(expires_at), "issued_by": frappe.session.user},
        expires_in_sec=3600,
    )
    return {
        "token": token,
        "url": f"/vip-portal/impersonate?token={token}",
        "expires_at": str(expires_at),
    }


@frappe.whitelist(allow_guest=True)
def exchange_impersonation_token(token):
    """Exchange one-time impersonation token for a VIP session."""
    data = frappe.cache().get_value(f"vip_impersonate:{token}")
    if not data:
        frappe.throw("Invalid or expired impersonation token", frappe.AuthenticationError)

    frappe.cache().delete_value(f"vip_impersonate:{token}")  # one-time use

    session_key = str(uuid.uuid4())
    frappe.cache().set_value(
        f"vip_session:{session_key}",
        {"customer": data["customer"], "impersonated_by": data["issued_by"]},
        expires_in_sec=3600,
    )
    frappe.local.cookie_manager.set_cookie("vip_session", session_key, httponly=True, secure=True)
    return {"status": "ok", "customer": data["customer"], "impersonating": True}


# ─── Dashboard data ──────────────────────────────────────────────────────────

@frappe.whitelist(allow_guest=True)
def get_dashboard_data():
    """Return VIP dashboard data for the authenticated VIP client."""
    customer = _require_vip_session()

    outstanding = frappe.db.sql(
        "SELECT COALESCE(SUM(outstanding_amount), 0) FROM `tabSales Invoice` WHERE customer=%s AND docstatus=1 AND outstanding_amount > 0",
        (customer,),
    )[0][0] or 0

    ytd_spend = frappe.db.sql(
        "SELECT COALESCE(SUM(grand_total), 0) FROM `tabSales Invoice` WHERE customer=%s AND docstatus=1 AND YEAR(posting_date) = YEAR(NOW())",
        (customer,),
    )[0][0] or 0

    recent_invoices = frappe.get_all(
        "Sales Invoice",
        filters={"customer": customer, "docstatus": 1},
        fields=["name", "posting_date", "grand_total", "outstanding_amount", "status"],
        order_by="posting_date desc",
        limit=10,
    )

    return {
        "customer": customer,
        "outstanding_balance": float(outstanding),
        "ytd_spend": float(ytd_spend),
        "recent_invoices": recent_invoices,
    }


def _require_vip_session():
    """Extract customer from VIP session cookie or throw."""
    session_key = frappe.request.cookies.get("vip_session")
    if not session_key:
        frappe.throw("VIP session required", frappe.AuthenticationError)
    data = frappe.cache().get_value(f"vip_session:{session_key}")
    if not data:
        frappe.throw("VIP session expired", frappe.AuthenticationError)
    return data["customer"]

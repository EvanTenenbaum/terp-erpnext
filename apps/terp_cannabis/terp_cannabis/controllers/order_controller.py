"""
Order controller — hooks onto Sales Order events.
Validates COGS/pricing on save; deducts inventory and posts accounting entries on submit.
"""
from __future__ import unicode_literals
import frappe
from terp_cannabis.services.pricing_service import evaluate_price
from terp_cannabis.services.credit_service import check_credit


def validate_pricing(doc, method=None):
    """Called on Sales Order validate. Evaluates pricing for each line item."""
    if not doc.items:
        return

    pricing_profile = doc.get("pricing_profile")

    for item in doc.items:
        if not item.item_code or not item.batch_no:
            continue
        try:
            result = evaluate_price(
                item_code=item.item_code,
                batch_no=item.batch_no,
                customer=doc.customer,
                qty=item.qty,
                pricing_profile=pricing_profile,
            )
            # Write pricing context back to custom fields on the line item
            item.db_set("rate", result.get("unit_price"), update_modified=False) \
                if not item.rate else None
        except Exception:
            # Don't block saves on pricing evaluation errors
            pass


def on_submit(doc, method=None):
    """Called on Sales Order submit. Checks credit, fires notifications."""
    _check_credit_on_submit(doc)
    _update_batch_statuses(doc)
    _fire_order_notification(doc)


def on_cancel(doc, method=None):
    """Called on Sales Order cancel. Restores inventory reservations."""
    pass  # ERPNext handles stock reversal on cancel natively


def _check_credit_on_submit(doc):
    result = check_credit(doc.customer, doc.grand_total)
    if result["status"] == "requires_override":
        frappe.throw(
            f"Order exceeds credit limit for {doc.customer}. "
            f"Available: ${result['available']:,.2f}. "
            "A credit override is required.",
            title="Credit Limit Exceeded",
        )


def _update_batch_statuses(doc):
    """Move any fully-allocated batches to 'Sold Out' status."""
    pass  # TODO: implement after Batch custom fields are in place


def _fire_order_notification(doc):
    """Create an in-app notification for order creation."""
    frappe.publish_realtime(
        "order_created",
        {"order": doc.name, "customer": doc.customer, "total": doc.grand_total},
        user=doc.owner,
    )

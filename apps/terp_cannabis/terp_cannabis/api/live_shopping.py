"""
Live Shopping API — manage sessions, participants, interest flags, and conversion.
"""
from __future__ import unicode_literals
import frappe
import random
import string


def _gen_room_code():
    return "".join(random.choices(string.ascii_uppercase + string.digits, k=6))


@frappe.whitelist()
def start_session(session_name):
    doc = frappe.get_doc("Live Shopping Session", session_name)
    doc.status = "Active"
    if not doc.room_code:
        doc.room_code = _gen_room_code()
    doc.save()
    frappe.db.commit()
    return {"status": "Active", "room_code": doc.room_code}


@frappe.whitelist()
def pause_session(session_name):
    frappe.db.set_value("Live Shopping Session", session_name, "status", "Paused")
    frappe.db.commit()
    return {"status": "Paused"}


@frappe.whitelist()
def end_session(session_name):
    frappe.db.set_value("Live Shopping Session", session_name, {
        "status": "Ended",
        "end_time": frappe.utils.now_datetime(),
    })
    frappe.db.commit()
    return {"status": "Ended"}


@frappe.whitelist()
def mark_interest(session_name, item_name, customer, status="Interest"):
    """Customer marks interest (or commits) on a live shopping item."""
    doc = frappe.get_doc("Live Shopping Session", session_name)
    for item in doc.items:
        if item.name == item_name:
            item.status = status
            break
    doc.save()
    frappe.db.commit()
    return {"item": item_name, "status": status}


@frappe.whitelist()
def convert_to_order(session_name):
    """Convert all 'Committed' items in a session to a Sales Order."""
    doc = frappe.get_doc("Live Shopping Session", session_name)
    committed = [i for i in doc.items if i.status == "Committed"]
    if not committed:
        frappe.throw("No committed items to convert")

    order = frappe.get_doc({
        "doctype": "Sales Order",
        "customer": doc.customer,
        "order_source": "Live Shopping",
        "order_type": "Sales",
        "items": [
            {
                "item_code": i.item,
                "batch_no": i.batch_no,
                "qty": 1,
                "rate": i.listed_price,
                "delivery_date": frappe.utils.add_days(frappe.utils.today(), 7),
            }
            for i in committed
        ],
    })
    order.insert()
    frappe.db.set_value("Live Shopping Session", session_name, "converted_order", order.name)
    frappe.db.commit()
    return {"order": order.name}

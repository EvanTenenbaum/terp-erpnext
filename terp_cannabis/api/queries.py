import frappe


def customer_query(doctype, txt, searchfield, start, page_len, filters):
    return frappe.db.sql(
        f"""SELECT name, customer_name, mobile_no
            FROM `tabCustomer`
            WHERE disabled = 0
              AND (name LIKE %(txt)s OR customer_name LIKE %(txt)s)
            ORDER BY customer_name
            LIMIT %(start)s, %(page_len)s""",
        {"txt": f"%{txt}%", "start": start, "page_len": page_len}
    )


def supplier_query(doctype, txt, searchfield, start, page_len, filters):
    return frappe.db.sql(
        f"""SELECT name, supplier_name
            FROM `tabSupplier`
            WHERE disabled = 0
              AND (name LIKE %(txt)s OR supplier_name LIKE %(txt)s)
            ORDER BY supplier_name
            LIMIT %(start)s, %(page_len)s""",
        {"txt": f"%{txt}%", "start": start, "page_len": page_len}
    )


def item_query(doctype, txt, searchfield, start, page_len, filters):
    return frappe.db.sql(
        f"""SELECT i.name, i.item_name, i.item_group, i.product_type, i.strain
            FROM `tabItem` i
            WHERE i.disabled = 0
              AND (i.name LIKE %(txt)s OR i.item_name LIKE %(txt)s)
            ORDER BY i.item_name
            LIMIT %(start)s, %(page_len)s""",
        {"txt": f"%{txt}%", "start": start, "page_len": page_len}
    )


def batch_query(doctype, txt, searchfield, start, page_len, filters):
    item = filters.get("item_code") if filters else None
    item_filter = "AND b.item = %(item)s" if item else ""
    return frappe.db.sql(
        f"""SELECT b.name, b.item, b.batch_status, b.unit_cost
            FROM `tabBatch` b
            WHERE b.disabled = 0
              AND b.batch_status = 'Live'
              {item_filter}
              AND (b.name LIKE %(txt)s OR b.item LIKE %(txt)s)
            ORDER BY b.creation DESC
            LIMIT %(start)s, %(page_len)s""",
        {"txt": f"%{txt}%", "start": start, "page_len": page_len, "item": item}
    )

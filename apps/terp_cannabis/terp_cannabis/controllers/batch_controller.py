"""
Batch controller — hooks onto Batch creation.
"""
from __future__ import unicode_literals
import frappe


def after_insert(doc, method=None):
    """After a Batch is created, add it to the workflow queue."""
    pass  # Batch Status History created explicitly by intake flows

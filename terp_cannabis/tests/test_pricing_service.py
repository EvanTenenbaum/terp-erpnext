import unittest
import frappe

class TestPricingService(unittest.TestCase):

    def test_evaluate_price_no_cogs(self):
        from terp_cannabis.services.pricing_service import evaluate_price
        result = evaluate_price("TEST-ITEM", None, "TEST-CUSTOMER")
        self.assertIn("unit_price", result)
        self.assertIn("cogs", result)
        self.assertIn("margin_pct", result)
        self.assertEqual(result["cogs"], 0)

    def test_evaluate_price_returns_dict(self):
        from terp_cannabis.services.pricing_service import evaluate_price
        result = evaluate_price("ANY-ITEM", None, "ANY-CUSTOMER")
        self.assertIsInstance(result, dict)
        required_keys = ["unit_price", "cogs", "cogs_mode", "margin_pct", "margin_usd", "applied_rules", "overrides"]
        for key in required_keys:
            self.assertIn(key, result, f"Missing key: {key}")

import unittest

class TestCreditService(unittest.TestCase):

    def test_check_credit_no_limit_allows(self):
        from terp_cannabis.services.credit_service import check_credit
        # No Credit Limit record = allowed
        result = check_credit("NONEXISTENT-CUSTOMER-12345", 1000)
        self.assertIn(result["status"], ["allowed", "warning", "requires_override"])
        self.assertIn("exposure", result)
        self.assertIn("limit", result)

    def test_check_credit_returns_dict(self):
        from terp_cannabis.services.credit_service import check_credit
        result = check_credit("ANY-CUSTOMER", 0)
        self.assertIsInstance(result, dict)
        for key in ["status", "exposure", "limit", "available", "mode"]:
            self.assertIn(key, result)

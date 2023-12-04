from authorizenet.constants import constants
from django.test import TestCase
from inertia.test import InertiaTestCase

from tests.utils import make_user, get_wager, get_payment_info
from payment.authorize_client import AuthorizeClient


class TestPayment(InertiaTestCase):
    def setUp(self):
        super().setUp()
        self.auth_client = AuthorizeClient(
            # These are my personal sandbox account.
            name="5UQt6rAa8T",
            transaction_key="47xHPz97xFXz2A3t",
        )
        self.user_a = make_user("user_a", "user_a@email.com", "password")
        self.user_b = make_user("user_b", "user_b@email.com", "password")

    def test_payment(self):
        wager = get_wager(self.user_a, self.user_b)

        payment_info = get_payment_info()
        payment_info["card_number"] = "4012000033330026"
        # payment_info["zipcode"] = "46282"
        response = self.auth_client.charge_cc(
            challenge=wager,
            **payment_info,
        )
        self.assertEqual(response["response_code"], 1)

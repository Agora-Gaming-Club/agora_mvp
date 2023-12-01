import datetime

from inertia.test import InertiaTestCase

from api.cron import challenge_creation_expired, password_change_expired
from api.models import Game, Wager, UserProfile

from tests.utils import make_user, get_wager


class TestCron(InertiaTestCase):
    def setUp(self):
        super().setUp()
        self.user_a = make_user("user_a", "user_a@email.com", "password")
        self.user_b = make_user("user_b", "user_b@email.com", "password")

    def test_expired_no_payment(self):
        wager = get_wager(self.user_a, self.user_b)
        unique_code = wager.unique_code
        # wager.status = Wager.IN_PROGRESS
        wager.created_at = wager.created_at - datetime.timedelta(hours=25)
        wager.save()

        challenge_creation_expired()
        wager = Wager.objects.get(unique_code=unique_code)
        self.assertEqual(wager.status, Wager.EXPIRED)

    def test_password_reset_link_expired(self):
        user = make_user("antman", "hankpym@avengers.net", "wasp")
        response = self.client.post(
            "/accounts/forgot_password",
            {"email": "hankpym@avengers.net"},
            content_type="application/json",
        )
        self.assertIn("message", self.props())

        # # Pretend that i got the email and clicked the link
        user = UserProfile.objects.get(email="hankpym@avengers.net")
        reset_password_id = user.reset_password_id

        # let 2 hours pass
        user.reset_password_time = user.reset_password_time - datetime.timedelta(
            hours=2
        )
        user.save()

        password_change_expired()

        response = self.client.post(
            f"/accounts/password_reset/{reset_password_id}",
            {
                "password": "asfafsa",
                "password_confirm": "asfafsa",
            },
            content_type="application/json",
        )
        # password link should be expired by now
        self.assertEqual({"error": "link expired"}, self.props())

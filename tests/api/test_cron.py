from datetime import datetime, timedelta

from inertia.test import InertiaTestCase

from api.cron import (
    challenge_creation_expired,
    password_change_expired,
    challenge_in_progress_expired,
)
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
        wager.created_at = wager.created_at - timedelta(hours=25)
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

        user = UserProfile.objects.get(email="hankpym@avengers.net")
        reset_password_id = user.reset_password_id

        # let 2 hours pass
        user.reset_password_time = user.reset_password_time - timedelta(hours=2)
        user.save()

        password_change_expired()
        # Pretend that i got the email and clicked the link
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

    def test_selecting_winner_and_expiring(self):
        self.client.login(username="user_a", password="password")
        response = self.client.post(
            "/challenge",
            {
                "challenger_id": self.user_a.user.id,
                "amount": "25.00",
                "platform": "xbox",
                "game": "rocket_league",
                "challenger_gamer_tag": "XxXx_SUPERCOOL_xXxX",
            },
            content_type="application/json",
        )
        wager = Wager.objects.get(challenger_id=self.user_a.user.id)
        unique_code = wager.unique_code
        self.assertEqual(wager.status, Wager.AWAITING_RESPONSE)

        # log in as other user and accept challenge
        self.client.login(username="user_b", password="password")
        response = self.client.post(
            f"/challenge/accept/{unique_code}",
            {
                "accept": True,
                "respondent_gamer_tag": "omgitsnotwanda",
            },
            content_type="application/json",
        )
        wager = Wager.objects.get(unique_code=unique_code)
        self.assertEqual(wager.status, Wager.ACCEPTED)

        # login as first user and make payment
        self.client.login(username="user_a", password="password")
        response = self.client.post(
            f"/challenge/ante/{unique_code}",
            {
                "payment_info": "This is extremely mocked right now",
            },
            content_type="application/json",
        )

        # login as second user and make payment
        self.client.login(username="user_b", password="password")
        response = self.client.post(
            f"/challenge/ante/{unique_code}",
            {
                "payment_info": "This is extremely mocked right now",
            },
            content_type="application/json",
        )
        wager = Wager.objects.get(unique_code=unique_code)
        self.assertEqual(wager.status, Wager.IN_PROGRESS)

        # Only the first person voted
        self.client.login(username="user_a", password="password")
        winner = 1
        response = self.client.post(
            f"/challenge/winner/{wager.unique_code}",
            {
                "winner": winner,
            },
            content_type="application/json",
        )
        wager = Wager.objects.get(unique_code=wager.unique_code)
        self.assertEqual(wager.challenger_vote, str(winner))

        # subtract a day from in_progress_time
        wager.in_progress_time = wager.in_progress_time - timedelta(hours=25)
        wager.save()

        challenge_in_progress_expired()

        wager = Wager.objects.get(unique_code=wager.unique_code)
        self.assertEqual(wager.winner, self.user_a)

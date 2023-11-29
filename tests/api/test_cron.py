import datetime

from inertia.test import InertiaTestCase

from api.cron import creation_expired
from api.models import Game, Wager

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

        creation_expired()
        wager = Wager.objects.get(unique_code=unique_code)
        self.assertEqual(wager.status, Wager.EXPIRED)

from django.test import TestCase
from inertia.test import InertiaTestCase

from api.models import Wager
from tests.utils import make_user, get_wager


class TestGeneral(InertiaTestCase):
    def setUp(self):
        super().setUp()
        self.user_a = make_user("user_a", "user_a@email.com", "password")
        self.user_b = make_user("user_b", "user_b@email.com", "password")

    def test_challenges_pagination_happy(self):
        total_challenges = 5
        for _ in range(total_challenges):
            wager = get_wager(self.user_a, self.user_b)
            wager.status = Wager.IN_PROGRESS
            wager.save()
        for _ in range(5):
            wager = get_wager(self.user_b, self.user_a)
            wager.status = Wager.COMPLETED
            wager.save()

        self.client.login(username="user_a", password="password")
        active_page = 1
        active_amt = 2
        old_page = 5
        old_amt = 6
        self.client.get(
            "/dashboard?active_page={}&active_amt={}&old_page={}&old_amt={}".format(
                active_page,
                active_amt,
                old_page,
                old_amt,
            ),
            content_type="application/json",
        )

        # verify all 5 results appear in the pagination total for active challenges
        self.assertEqual(total_challenges, self.props()["active"]["total_amount"])
        # verify only 2 results appear for active challenges
        self.assertEqual(active_amt, len(self.props()["active"]["result"]))
        # verify no results appear for old challenges because page 3 of 2
        self.assertEqual(0, len(self.props()["old"]["result"]))
        # verify total amt of pages correct 6 per page, 5 total should be 1 page
        self.assertEqual(1, self.props()["old"]["total_pages"])

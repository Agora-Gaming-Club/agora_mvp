from django.test import TestCase
from inertia.test import InertiaTestCase

from api.models import Game, Wager
from tests.utils import make_user, get_wager


class TestWager(InertiaTestCase):
    def setUp(self):
        super().setUp()
        self.user_a = make_user("user_a", "user_a@email.com", "password")
        self.user_b = make_user("user_b", "user_b@email.com", "password")

    def test_wager_status(self):
        wager = get_wager(self.user_a, self.user_b)
        wager.status = Wager.IN_PROGRESS
        wager.save()

    def test_wager_unique_id(self):
        """Verifying a uniqueID was created"""
        self.client.login(username="user_a", password="password")
        response = self.client.post(
            "/challenge",
            {
                "challenger_id": self.user_a.user.id,
                "respondent_id": "",
                "amount": "25.00",
                "platform": "xbox",
                "game": "rocket_league",
            },
            content_type="application/json",
        )
        self.assertIn("unique_code", self.props())

    def test_wager_accept(self):
        """Regular Accept Flow"""
        self.client.login(username="user_a", password="password")
        response = self.client.post(
            "/challenge",
            {
                "challenger_id": self.user_a.user.id,
                "amount": "25.00",
                "platform": "xbox",
                "game": "rocket_league",
            },
            content_type="application/json",
        )
        unique_code = self.props()["unique_code"]
        wager = Wager.objects.get(unique_code=unique_code)
        self.assertEqual(wager.status, Wager.AWAITING_RESPONSE)

        self.client.login(username="user_b", password="password")
        response = self.client.post(
            f"/challenge/accept/{unique_code}",
            {
                "accept": True,
                "gamer_tag": "omgitsnotwanda",
            },
            content_type="application/json",
        )
        wager = Wager.objects.get(unique_code=unique_code)
        self.assertEqual(wager.status, Wager.ACCEPTED)

    def test_wager_accept_self(self):
        """Cannot accept own challenge"""
        self.client.login(username="user_a", password="password")
        response = self.client.post(
            "/challenge",
            {
                "challenger_id": self.user_a.user.id,
                "amount": "25.00",
                "platform": "xbox",
                "game": "rocket_league",
            },
            content_type="application/json",
        )
        unique_code = self.props()["unique_code"]
        wager = Wager.objects.get(unique_code=unique_code)
        self.assertEqual(wager.status, Wager.AWAITING_RESPONSE)

        self.client.login(username="user_a", password="password")
        response = self.client.post(
            f"/challenge/accept/{unique_code}",
            {
                "accept": True,
                "gamer_tag": "omgitswanda",
            },
            content_type="application/json",
        )
        self.assertIn("accept", self.props().get("errors", []))
        wager = Wager.objects.get(unique_code=unique_code)
        self.assertEqual(wager.status, Wager.AWAITING_RESPONSE)

    def test_wager_accept_no_gamertag(self):
        """Accept flow but no gamertag"""
        self.client.login(username="user_a", password="password")
        response = self.client.post(
            "/challenge",
            {
                "challenger_id": self.user_a.user.id,
                "amount": "25.00",
                "platform": "xbox",
                "game": "rocket_league",
            },
            content_type="application/json",
        )
        unique_code = self.props()["unique_code"]
        wager = Wager.objects.get(unique_code=unique_code)
        self.assertEqual(wager.status, Wager.AWAITING_RESPONSE)

        self.client.login(username="user_b", password="password")
        response = self.client.post(
            f"/challenge/accept/{unique_code}",
            {
                "accept": True,
            },
            content_type="application/json",
        )
        self.assertIn("gamer_tag", self.props().get("errors", []))

    def test_wager_accept_payment(self):
        """Regular Accept Flow but with payment"""
        # login as user and make challenge
        self.client.login(username="user_a", password="password")
        response = self.client.post(
            "/challenge",
            {
                "challenger_id": self.user_a.user.id,
                "amount": "25.00",
                "platform": "xbox",
                "game": "rocket_league",
            },
            content_type="application/json",
        )
        unique_code = self.props()["unique_code"]
        wager = Wager.objects.get(unique_code=unique_code)
        self.assertEqual(wager.status, Wager.AWAITING_RESPONSE)

        # log in as other user and accept challenge
        self.client.login(username="user_b", password="password")
        response = self.client.post(
            f"/challenge/accept/{unique_code}",
            {
                "accept": True,
                "gamer_tag": "omgitsnotwanda",
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

    def test_selecting_winner(self):
        wager = get_wager(self.user_a, self.user_b)
        wager.status = Wager.IN_PROGRESS
        wager.save()

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

    def test_selecting_invalid_winner(self):
        wager = get_wager(self.user_a, self.user_b)
        wager.status = Wager.IN_PROGRESS
        wager.save()

        self.client.login(username="user_a", password="password")
        winner = 3
        response = self.client.post(
            f"/challenge/winner/{wager.unique_code}",
            {
                "winner": winner,
            },
            content_type="application/json",
        )
        self.assertIn("winner", self.props().get("errors", []))

    def test_invalid_winner_selector(self):
        user_c = make_user("user_c", "user_c@email.com", "password")
        wager = get_wager(self.user_a, self.user_b)
        wager.status = Wager.IN_PROGRESS
        wager.save()

        self.client.login(username="user_c", password="password")
        winner = 1
        response = self.client.post(
            f"/challenge/winner/{wager.unique_code}",
            {
                "winner": winner,
            },
            content_type="application/json",
        )
        self.assertEqual({"message": "You didnt participate"}, self.props())

    def test_selecting_agreed_winner(self):
        wager = get_wager(self.user_a, self.user_b)
        wager.status = Wager.IN_PROGRESS
        wager.save()

        winner = 1

        self.client.login(username="user_a", password="password")
        response = self.client.post(
            f"/challenge/winner/{wager.unique_code}",
            {
                "winner": winner,
            },
            content_type="application/json",
        )

        self.client.login(username="user_b", password="password")
        response = self.client.post(
            f"/challenge/winner/{wager.unique_code}",
            {
                "winner": winner,
            },
            content_type="application/json",
        )
        wager = Wager.objects.get(unique_code=wager.unique_code)
        self.assertEqual(wager.challenger_vote, wager.respondent_vote)
        self.assertEqual(wager.status, Wager.COMPLETED)

    def test_selecting_disputed_winner(self):
        wager = get_wager(self.user_a, self.user_b)
        wager.status = Wager.IN_PROGRESS
        wager.save()

        self.client.login(username="user_a", password="password")
        response = self.client.post(
            f"/challenge/winner/{wager.unique_code}",
            {
                "winner": 1,
            },
            content_type="application/json",
        )

        self.client.login(username="user_b", password="password")
        response = self.client.post(
            f"/challenge/winner/{wager.unique_code}",
            {
                "winner": 2,
            },
            content_type="application/json",
        )
        wager = Wager.objects.get(unique_code=wager.unique_code)
        self.assertNotEqual(wager.challenger_vote, wager.respondent_vote)
        self.assertEqual(wager.status, Wager.DISPUTED)

    def test_challenges_pagination(self):
        from rich import print

        total_challenges = 5
        for _ in range(total_challenges):
            wager = get_wager(self.user_a, self.user_b)
            wager.status = Wager.IN_PROGRESS
            wager.save()
        for _ in range(5):
            wager = get_wager(self.user_b, self.user_a)
            wager.status = Wager.IN_PROGRESS
            wager.save()

        self.client.login(username="user_a", password="password")
        challenger_page = 1
        challenger_amount = 2
        respondent_page = 3
        respondent_amount = 4
        self.client.get(
            "/challenges?chal_page={}&chal_amt={}&resp_page={}&resp_amt={}".format(
                challenger_page,
                challenger_amount,
                respondent_page,
                respondent_amount,
            ),
            content_type="application/json",
        )
        # verify all 5 results appear in the pagination total for challenger
        self.assertEqual(total_challenges, self.props()["challenger"]["total_amount"])
        # verify only 2 results appear for challenger
        self.assertEqual(challenger_amount, len(self.props()["challenger"]["result"]))
        # verify no results appear for respondent because page 3 of 2
        self.assertEqual(0, len(self.props()["respondent"]["result"]))
        # verify total amt of pages correct 4 per page, 5 total should be 2 pages
        self.assertEqual(2, self.props()["respondent"]["total_pages"])

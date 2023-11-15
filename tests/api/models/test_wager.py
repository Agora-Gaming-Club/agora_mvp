from django.test import TestCase

from api.models import Game, Wager
from tests.utils import make_user


class TestWager(TestCase):
    def setUp(self):
        self.user_a = make_user("user_a", "user_a@email.com", "password")
        self.user_b = make_user("user_b", "user_b@email.com", "password")

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
                "game": "minecraft",
            },
        )
        self.assertIn("unique_code", response.json())

    def test_wager_accept(self):
        """Regular Accept Flow"""
        self.client.login(username="user_a", password="password")
        response = self.client.post(
            "/challenge",
            {
                "challenger_id": self.user_a.user.id,
                "amount": "25.00",
                "platform": "xbox",
                "game": "minecraft",
            },
        )
        unique_code = response.json()["unique_code"]
        wager = Wager.objects.get(unique_code=unique_code)
        self.assertEqual(wager.status, Wager.AWAITING_RESPONSE)

        self.client.login(username="user_b", password="password")
        response = self.client.post(
            f"/challenge/accept/{unique_code}",
            {
                "accept": True,
                "gamer_tag": "omgitsnotwanda",
            },
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
                "game": "minecraft",
            },
        )
        unique_code = response.json()["unique_code"]
        wager = Wager.objects.get(unique_code=unique_code)
        self.assertEqual(wager.status, Wager.AWAITING_RESPONSE)

        self.client.login(username="user_a", password="password")
        response = self.client.post(
            f"/challenge/accept/{unique_code}",
            {
                "accept": True,
                "gamer_tag": "omgitswanda",
            },
        )
        self.assertIn("accept", response.json())
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
                "game": "minecraft",
            },
        )
        unique_code = response.json()["unique_code"]
        wager = Wager.objects.get(unique_code=unique_code)
        self.assertEqual(wager.status, Wager.AWAITING_RESPONSE)

        self.client.login(username="user_b", password="password")
        response = self.client.post(
            f"/challenge/accept/{unique_code}",
            {
                "accept": True,
            },
        )
        self.assertIn("gamer_tag", response.json())

    # def test_wager_accept(self):
    #     """Regular Accept Flow"""
    #     self.client.login(username="user_a", password="password")
    #     response = self.client.post(
    #         "/challenge",
    #         {
    #             "challenger_id": self.user_a.user.id,
    #             "amount": "25.00",
    #             "platform": "xbox",
    #             "game": "minecraft",
    #         },
    #     )
    #     unique_code = response.json()["unique_code"]
    #     wager = Wager.objects.get(unique_code=unique_code)
    #     self.assertEqual(wager.status, Wager.AWAITING_RESPONSE)

    #     self.client.login(username="user_b", password="password")
    #     response = self.client.post(
    #         f"/challenge/accept/{unique_code}",
    #         {
    #             "accept": True,
    #             "gamer_tag": "omgitsnotwanda",
    #         },
    #     )
    #     wager = Wager.objects.get(unique_code=unique_code)
    #     self.assertEqual(wager.status, Wager.ACCEPTED)

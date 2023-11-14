from django.test import TestCase

from api.models import Game, Wager


class TestWager(TestCase):
    @classmethod
    def setUpTestData(cls):
        print(
            "setUpTestData: Run once to set up non-modified data for all class methods."
        )
        pass

    def setUp(self):
        self.game = Game.objects.create(
            game=Game.GAMES[0][0],
            platform=Game.PLATFORM[0][0],
        )
        pass

    # def test_wager_unique_id(self):
    #     print("Method: test_false_is_false.")
    #     self.assertFalse(False)

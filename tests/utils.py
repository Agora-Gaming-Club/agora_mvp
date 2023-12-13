import random
import string

from django.contrib.auth.models import User

from api.models import Game, UserProfile, Wager, GameName, Platform, Term
from filestore.models import File

random.seed("seed")


def make_file():
    File.objects.create(
        name="emails/welcome.html",
        description="description",
        contents="""
Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna
aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis
aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint
occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.""",
    )


def make_user(username, email, password, *args, **kwargs):
    user = User.objects.create_user(
        username=username,
        email=email,
        password=password,
    )

    user_profile = UserProfile.objects.create(
        user=user,
        username=user.username,
        email=user.email,
        first_name="Namey",
        last_name="McNameySon",
        state="AZ",
        birthday="2000-01-01",
        phone_number=random_phonenumber(),
    )
    return user_profile


def random_phonenumber():
    phone_number = []
    for i in range(10):
        phone_number.append(random.choice(string.digits))
    return "".join(phone_number)


def make_game():
    gamename = GameName.objects.create(name="Rocket League")
    platform = Platform.objects.create(name="Playstation 5")
    terms = Term.objects.create(terms="1v1 Golden Snitch Mode")
    game = Game.objects.create(
        platform=platform,
        game=gamename,
        terms=terms,
    )
    return game


def get_wager(user_a, user_b):
    game = make_game()
    wager = Wager.objects.create(
        challenger_id=user_a.id,
        respondent_id=user_b.id,
        amount=25.00,
        game=game,
        notes="lolnotes",
        status=Wager.IN_PROGRESS,
        challenger_gamer_tag="COOL_GUY_SN",
        respondent_gamer_tag="COOLER_GUY_SN",
    )
    return wager

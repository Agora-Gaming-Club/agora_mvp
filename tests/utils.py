from django.contrib.auth.models import User

from api.models import Game, UserProfile, Wager


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
    )
    return user_profile


def get_wager(user_a, user_b):
    game = Game.objects.create(
        platform="xbox",
        game="rocket_league",
    )
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

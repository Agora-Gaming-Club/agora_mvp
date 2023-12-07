# run with `./manage.py shell < bin/install_fixtures.py`
from api.models import Game, GameName, Platform, Term

# game names
rocket_league = GameName.objects.create(name="Rocket League")
madden_24 = GameName.objects.create(name="Madden '24")
chess_dot_com = GameName.objects.create(name="Chess.com")

# platforms

ps5 = Platform.objects.create(name="Playstation 5")
xbox = Platform.objects.create(name="Xbox X|S")
pc = Platform.objects.create(name="PC")
mobile = Platform.objects.create(name="Mobile")
cross_platform = Platform.objects.create(name="Cross Platform")

# Terms
face_off = Term.objects.create(terms="1v1 Face-Off (OT with Golden Goal)")
five_min_quarters = Term.objects.create(terms="5 min quarters (All-Pro difficulty)")
three_min_blitz = Term.objects.create(terms="3 minute Blitz")


Game.objects.create(
    game=rocket_league,
    platform=cross_platform,
    terms=face_off,
    discord_link="https://www.example.com/rl_cross_platform_faceoff",
)

Game.objects.create(
    game=madden_24,
    platform=xbox,
    terms=five_min_quarters,
    discord_link="https://www.example.com/madden_xbox_5min",
)

Game.objects.create(
    game=madden_24,
    platform=ps5,
    terms=five_min_quarters,
    discord_link="https://www.example.com/madden_ps5_5min",
)
Game.objects.create(
    game=madden_24,
    platform=pc,
    terms=five_min_quarters,
    discord_link="https://www.example.com/madden_pc_5min",
)

Game.objects.create(
    game=chess_dot_com,
    platform=pc,
    terms=three_min_blitz,
    discord_link="https://www.example.com/chess_pc_3min",
)

Game.objects.create(
    game=chess_dot_com,
    platform=mobile,
    terms=three_min_blitz,
    discord_link="https://www.example.com/chess_mobile_3min",
)

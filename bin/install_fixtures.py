# run with `./manage.py shell < bin/install_fixtures.py`
from api.models import Game, GameName, Platform, Term
from filestore.models import File

# game names
rocket_league, _ = GameName.objects.get_or_create(name="Rocket League")
madden_24, _ = GameName.objects.get_or_create(name="Madden '24")
chess_dot_com, _ = GameName.objects.get_or_create(name="Chess.com")

# platforms
ps5, _ = Platform.objects.get_or_create(name="Playstation 5")
xbox, _ = Platform.objects.get_or_create(name="Xbox X|S")
pc, _ = Platform.objects.get_or_create(name="PC")
mobile, _ = Platform.objects.get_or_create(name="Mobile")
cross_platform, _ = Platform.objects.get_or_create(name="Cross Platform")

# Terms
face_off, _ = Term.objects.get_or_create(terms="1v1 Face-Off (OT with Golden Goal)")
five_min_quarters, _ = Term.objects.get_or_create(
    terms="5 min quarters (All-Pro difficulty)"
)
three_min_blitz, _ = Term.objects.get_or_create(terms="3 minute Blitz")

# The actual game objects.
Game.objects.get_or_create(
    game=rocket_league,
    platform=cross_platform,
    terms=face_off,
    discord_link="https://discord.com/channels/1173680090371068006/1174514494819541042",
)

Game.objects.get_or_create(
    game=madden_24,
    platform=xbox,
    terms=five_min_quarters,
    discord_link="https://discord.com/channels/1173680090371068006/1173680424845840585",
)

Game.objects.get_or_create(
    game=madden_24,
    platform=ps5,
    terms=five_min_quarters,
    discord_link="https://discord.com/channels/1173680090371068006/1173680424845840585",
)
Game.objects.get_or_create(
    game=madden_24,
    platform=pc,
    terms=five_min_quarters,
    discord_link="https://discord.com/channels/1173680090371068006/1173680424845840585",
)

Game.objects.get_or_create(
    game=chess_dot_com,
    platform=pc,
    terms=three_min_blitz,
    discord_link="https://discord.com/channels/1173680090371068006/1174514563450929272",
)

Game.objects.get_or_create(
    game=chess_dot_com,
    platform=mobile,
    terms=three_min_blitz,
    discord_link="https://discord.com/channels/1173680090371068006/1174514563450929272",
)

import glob

email_dir = "templates/emails/*"
sms_dir = "templates/sms/*"


def add_files(dir):
    emails = glob.glob(dir)
    email_names = [x.replace("templates/", "") for x in emails]
    print(emails)
    for i, email in enumerate(emails):
        name = email_names[i]
        with open(email) as file:
            contents = file.read()
            File.objects.get_or_create(
                name=name,
                description="",
                contents=contents,
            )


add_files(email_dir)
add_files(sms_dir)

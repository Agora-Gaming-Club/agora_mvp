from django.core import serializers

from api.models import (
    Game,
    Payment,
    UserProfile,
    Wager,
)


def serialize(obj):
    if isinstance(obj, Game):
        return serialize_game(obj)
    if isinstance(obj, Payment):
        return serialize_payment(obj)
    if isinstance(obj, UserProfile):
        return serialize_user_profile(obj)
    if isinstance(obj, Wager):
        return serialize_wager(obj)
    return {}


def serialize_objs(objs):
    if "results" in objs:
        objs = objs["results"]
    return [serialize(obj) for obj in objs]


def get_user(id):
    user = UserProfile.objects.get(user__id=id)
    return serialize_user_profile(user)


def serialize_game(game):
    return {
        "game": game.get_game_display(),
        "platform": game.get_platform_display(),
        "terms": game.terms,
    }


def serialize_payment(payment):
    return {
        "user": payment.user,
        "wager": payment.wager,
        "authorize_net_payment_id": payment.authorize_net_payment_id,
        "authorize_net_payment_status": payment.authorize_net_payment_status,
        "created_at": payment.created_at,
        "updated_at": payment.updated_at,
    }


def serialize_user_profile(user_profile):
    return {
        "username": user_profile.username,
        "first_name": user_profile.first_name,
        "last_name": user_profile.last_name,
        "email": user_profile.email,
        "state": user_profile.state,
        "phone_number": user_profile.phone_number,
        "birthday": user_profile.birthday,
        "winnings": user_profile.winnings,
        "created_at": user_profile.created_at,
        "updated_at": user_profile.updated_at,
    }


def serialize_wager(wager):
    serialized = {
        "challenger_id": wager.challenger_id,
        "challenger": get_user(wager.challenger_id),
        # "respondent" : get_user(wager.respondent_id)
        "respondent_id": wager.respondent_id,
        "amount": wager.amount,
        "game": serialize_game(wager.game),
        "notes": wager.notes,
        "unique_code": wager.unique_code,
        "challenger_gamer_tag": wager.challenger_gamer_tag,
        "respondent_gamer_tag": wager.respondent_gamer_tag,
        "status": wager.get_status_display(),
        "in_progress_time": wager.in_progress_time,
        # "winner": serialize_user_profile(wager.winner),
        "created_at": wager.created_at,
        "updated_at": wager.updated_at,
        # "challenger_vote": wager.challenger_vote,
        # "respondent_vote": wager.respondent_vote,
        "challenger_paid": wager.challenger_paid,
        "respondent_paid": wager.respondent_paid,
    }
    if wager.respondent_id:
        serialized["respondent"] = get_user(wager.respondent_id)
    if wager.winner:
        serialized["winner"] = serialize_user_profile(wager.winner)
    if wager.challenger_vote:
        serialized["challenger_vote"] = get_user(wager.challenger_vote)
    if wager.respondent_vote:
        serialized["respondent_vote"] = get_user(wager.respondent_vote)
    return serialized


# game = Game.objects.all().first()
# payment = Payment.objects.all().first()
# user_profile = UserProfile.objects.all().first()
# wager = Wager.objects.all().first()


# game = serialize_game(game)
# payment = serialize_payment(payment)
# user_profile = serialize_user_profile(user_profile)
# wager = serialize_wager(wager)


# print("game")
# print(game)
# print("payment")
# print(payment)
# print("user_profile")
# print(user_profile)
# print("wager")
# print(wager)

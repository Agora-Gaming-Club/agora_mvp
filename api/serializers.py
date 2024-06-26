from django.template.defaultfilters import slugify
from api.models import (
    Game,
    Payment,
    UserProfile,
    Wager,
)


def serialize(obj):
    """
    Converts an object to a json.

    obj: An example of an object, can be Game, Payment, UserProfile or Wager
    returns: serialized JSON version of object
    """
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
    """
    Convert a list of objects to Json.

    objs: list of objects
    returns: list of serialized objects
    """
    if "results" in objs:
        objs = objs["results"]
    return [serialize(obj) for obj in objs]


def get_user(id):
    """
    Convert user ID to serialized UserProfile

    id: User ID
    returns: a Serialized UserProfile
    """
    user = UserProfile.objects.get(user__id=id)
    return serialize_user_profile(user)


def serialize_game(game):
    """
    Converts game object to serialized JSON

    game: Game obj
    returns: a Serialized game object
    """
    return {
        "game": game.game.name,
        "platform": game.platform.name,
        "terms": game.terms.terms,
        "slug": slugify(game.game.name),
        "discord_link": game.discord_link,
    }


def serialize_payment(payment):
    """
    Converts payment object to serialized JSON

    payment: Payment obj
    returns: a Serialized payment object
    """
    return {
        "user": payment.user,
        "wager": payment.wager,
        "authorize_net_payment_id": payment.authorize_net_payment_id,
        "authorize_net_payment_status": payment.authorize_net_payment_status,
        "created_at": payment.created_at,
        "updated_at": payment.updated_at,
    }


def serialize_user_profile(user_profile):
    """
    Converts user_profile object to serialized JSON

    user_profile: UserProfile obj
    returns: a Serialized user_profile object
    """
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
    """
    Converts wager object to serialized JSON

    wager: Wager obj
    returns: a Serialized wager object
    """
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
        "winner_paid": wager.winner_paid,
        "winner_paypal": wager.winner_paypal,
    }
    if wager.respondent_id:
        serialized["respondent"] = get_user(wager.respondent_id)
    if wager.winner:
        serialized["winner"] = get_user(wager.winner.id)
        serialized["winner_id"] = wager.winner.id
    if wager.challenger_vote:
        serialized["challenger_vote"] = get_user(wager.challenger_vote)
    if wager.respondent_vote:
        serialized["respondent_vote"] = get_user(wager.respondent_vote)
    return serialized

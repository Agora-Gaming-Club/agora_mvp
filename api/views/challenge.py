"""
Challenge related endpoints
"""
import json

from django.http import HttpResponseRedirect
from django.shortcuts import get_object_or_404
from django.views.decorators.csrf import ensure_csrf_cookie
from inertia import inertia

from api.forms import (
    AcceptForm,
    AnteForm,
    ChallengeForm,
    ChallengeSearchForm,
    WinnerForm,
)
from api.models import Game, Payment, UserProfile, Wager
from api.utils import paginate

from payment.authorize_client import AuthorizeClient


@ensure_csrf_cookie
@inertia("Challenge/Create")
def challenge(request):
    if not request.user.is_authenticated:
        return {"message": "Requires Auth"}
    user = UserProfile.objects.get(user=request.user)
    if request.method == "POST":
        data = json.loads(request.body)
        form = ChallengeForm(data, initial={"challenger_username": request.user})
        if form.is_valid():
            platform = data["platform"]
            game = data["game"]
            game_obj, _ = Game.objects.get_or_create(platform=platform, game=game)
            wager = Wager.objects.create(
                challenger_id=request.user.id,
                amount=data["amount"],
                game=game_obj,
            )
            # wager.generate_unique_code()
            # Probably want additional info about the challenge here
            return HttpResponseRedirect(f"challenge/{wager.unique_code}")
        else:
            return {"errors": form.errors.get_json_data()}
    return {"user": user, "games": Game.GAMES, "platforms": Game.PLATFORM}


@inertia("Challenge/Show")
def challenge_status(request, challenge_id):
    # QUESTION: Figure out if anyone can go here or if only authenticated ppl
    challenge = get_object_or_404(Wager, unique_code=challenge_id)
    current_user = UserProfile.objects.filter(user=request.user)
    if current_user:
        current_user = current_user.first()
    challenger = UserProfile.objects.get(user__id=challenge.challenger_id)

    respondent = None
    if challenge.respondent_id:
        respondent = UserProfile.objects.filter(
            user__id=challenge.respondent_id
        ).first()

    props = {
        "challenge": challenge,
        "created_at": challenge.created_at,
        "game": challenge.game.get_game_display(),
        "challenger": challenger,
        "user": current_user,
        "respondent": respondent,
        "viewer": current_user in [challenger, respondent],
    }

    return props


@ensure_csrf_cookie
@inertia("Challenge/Search")
def challenge_search(request):
    if request.method == "POST":
        data = json.loads(request.body)
        form = ChallengeSearchForm(data)
        if form.is_valid():
            unique_code = data["unique_code"]
            challenge = Wager.objects.filter(unique_code=unique_code)
            if challenge:
                return HttpResponseRedirect(
                    f"/challenge/{challenge.first().unique_code}"
                )
            else:
                form.add_error("unique_code", "challenge does not exist")
        return {"errors": form.errors.get_json_data()}
    user = UserProfile.objects.get(user=request.user)
    form = ChallengeSearchForm()
    return {"user": user}


@ensure_csrf_cookie
@inertia("Challenge/Accept")
def challenge_accept(request, challenge_id):
    data = json.loads(request.body)
    challenge = get_object_or_404(Wager, unique_code=challenge_id)
    form = AcceptForm(data)
    if form.is_valid():
        respondent = UserProfile.objects.get(user=request.user)
        challenger = UserProfile.objects.get(user__id=challenge.challenger_id)
        if respondent == challenger:
            form.add_error("accept", "Cannot accept your own challenge")
            return {"errors": form.errors.get_json_data()}
        gamer_tag = data["gamer_tag"]
        challenge.accept(respondent, gamer_tag)
        props = {
            "respondent": respondent,
            "challenger": challenger,
        }
        props.update({"errors": form.errors.get_json_data()})
        return props
    return {"errors": form.errors.get_json_data()}


@ensure_csrf_cookie
@inertia("Challenge/Ante")
def challenge_ante(request, challenge_id):
    """
    Should take payment, and return something to indicate if
    it worked or not.
    """
    challenge = get_object_or_404(Wager, unique_code=challenge_id)
    challengers = [challenge.challenger_id, challenge.respondent_id]

    if request.user.id not in challengers:
        raise Exception("Why are you here if you arent part of this?")

    if request.method == "POST":
        # form = AnteForm(request.POST)
        amount = challenge.amount

        payment_client = AuthorizeClient("token")
        payment_status = payment_client.send_payment("source", "target", amount)

        payment, _ = Payment.objects.get_or_create(
            user=request.user,
            wager=challenge,
            authorize_net_payment_id=payment_status["id"],
            authorize_net_payment_status=payment_status["status"],
        )
        challenge.all_payments_received()
        return {"status": payment.authorize_net_payment_status}

    return {"error": "Bad Payment"}


@ensure_csrf_cookie
@inertia("Challenge/Winner")
def challenge_winner(request, challenge_id):
    """Verify both people are supposed to be here"""
    data = json.loads(request.body)
    challenge = get_object_or_404(Wager, unique_code=challenge_id)
    form = WinnerForm(data, choices=challenge.get_winner_choices())
    if form.is_valid():
        user_id = request.user.id
        if user_id == challenge.challenger_id:
            challenge.challenger_vote = data["winner"]
            challenge.save()
        elif user_id == challenge.respondent_id:
            challenge.respondent_vote = data["winner"]
            challenge.save()
        else:
            return {"message": "You didnt participate"}

        if challenge.both_voted():
            if challenge.disputed():
                challenge.status = Wager.DISPUTED
                challenge.save()
                # fire off a email, or keep voting open if they change their mind?
            else:
                challenge.status = Wager.COMPLETED
                challenge.save()
                challenge.determine_winner()
        return {"vote": f"You voted for {data['winner']}"}

    return {"errors": form.errors.get_json_data()}


@inertia("Challenge/Index")
def challenges(request):
    if request.user.is_authenticated:
        challenges = Wager.objects.filter(challenger_id=request.user.id)
        user = UserProfile.objects.get(user=request.user)
        props = {"challenges": challenges, "user": user}
        return props
    return {}

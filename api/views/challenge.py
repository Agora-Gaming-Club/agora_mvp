"""
Challenge related endpoints
"""
import json

from django.http import HttpResponseRedirect
from django.shortcuts import get_object_or_404
from django.urls import reverse
from django.views.decorators.csrf import ensure_csrf_cookie
from inertia import inertia, share

from api.emails import DisputeEmail
from api.forms import (
    AcceptForm,
    AnteForm,
    ChallengeForm,
    ChallengeSearchForm,
    PayPalForm,
    WinnerForm,
)
from api.models import Game, Payment, UserProfile, Wager
from api.serializers import serialize, serialize_objs
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
            print("hello?")
            wager = Wager.objects.create(
                challenger_id=request.user.id,
                challenger_gamer_tag=data["challenger_gamer_tag"],
                amount=data["amount"],
                game=game_obj,
            )
            return HttpResponseRedirect(f"challenge/{wager.unique_code}")
        else:
            return {"errors": form.errors.get_json_data()}
    return {
        "user": user,
        "games": serialize_objs(Game.objects.all()),
        "platforms": Game.PLATFORM,
    }


@ensure_csrf_cookie
@inertia("Challenge/Show")
def challenge_status(request, challenge_id):
    # QUESTION: Figure out if anyone can go here or if only authenticated ppl
    challenge = get_object_or_404(Wager, unique_code=challenge_id)
    current_user = UserProfile.objects.filter(user=request.user)
    if current_user:
        current_user = current_user.first()

    if request.method == "POST":
        if challenge.status == Wager.AWAITING_RESPONSE:
            return challenge_accept(request, challenge_id)
        if challenge.status == Wager.ACCEPTED:
            # expect payment
            return challenge_ante(request, challenge_id)
        if challenge.status == Wager.IN_PROGRESS:
            # select winner
            return challenge_winner(request, challenge_id)

    props = {
        "challenge": serialize(challenge),
        "user": current_user,
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
        respondent_gamer_tag = data["respondent_gamer_tag"]
        challenge.accept(respondent, respondent_gamer_tag)
        props = {"challenge": challenge}
        return props
    return {"errors": form.errors.get_json_data()}


def challenge_ante(request, challenge_id):
    """
    Should take payment, and return something to indicate if
    it worked or not.
    """
    challenge = get_object_or_404(Wager, unique_code=challenge_id)
    challengers = [challenge.challenger_id, challenge.respondent_id]

    if request.user.id not in challengers:
        raise Exception("Why are you here if you arent part of this?")

    data = json.loads(request.body)
    form = AnteForm(data)
    if form.is_valid():
        data_value = data.get("data_value")

        payment_client = AuthorizeClient("token")
        payment_status = payment_client.send_payment(
            data_value=data_value,
            amount=challenge.amount,
            wager=challenge,
            user=request.user,
        )
        status = Payment.BAD
        if payment_status.get("responseCode"):
            status = Payment.GOOD
            payment, _ = Payment.objects.get_or_create(
                user=request.user,
                wager=challenge,
                authorize_net_payment_id=payment_status.get("transId"),
                authorize_net_payment_status=status,
                description=payment_status["description"],
            )
            challenge.all_payments_received()
            return {
                "status": payment.authorize_net_payment_status,
                "challenge": challenge,
            }

    return {"errors": "Bad Payment"}


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
                email_context = challenge.get_competitors()
                email_context["challenge"] = challenge
                email_context["game"] = challenge.game
                email = DisputeEmail(
                    email_context,
                    target="product@agoragaming.gg",
                    bcc=[
                        email_context["challenger"].email,
                        email_context["respondent"].email,
                    ],
                )
                email.send()
                challenge.save()
            else:
                challenge.status = Wager.COMPLETED
                challenge.save()
                challenge.determine_winner()
        return {"challenge": challenge}

    return {"errors": form.errors.get_json_data()}


def challenge_award(request, challenge_id):
    data = json.loads(request.body)
    challenge = get_object_or_404(Wager, unique_code=challenge_id)
    form = PayPalForm(data)
    if form.is_valid():
        email = data.get("email")
        challenge.winner_paypal = email
        challenge.save()
        return {"challenge": challenge}
    else:
        return {"errors": form.errors.get_json_data()}
    return {}


@inertia("Challenge/Index")
def challenges(request):
    if request.user.is_authenticated:
        challenges = Wager.objects.filter(challenger_id=request.user.id)
        user = UserProfile.objects.get(user=request.user)
        props = {"challenges": challenges, "user": user}
        return props
    return {}

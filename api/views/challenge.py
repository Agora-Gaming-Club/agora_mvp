import json
from django.contrib.auth.models import User
from django.http import HttpResponse, HttpResponseRedirect
from django.shortcuts import get_object_or_404, render
from django.urls import reverse

# from inertia import render

from api.forms import AcceptForm, AnteForm, ChallengeForm, WinnerForm
from api.models import Game, Payment, UserProfile, Wager

from payment.authorize_client import AuthorizeClient


def challenge(request):
    # if not request.user.is_authenticated:
    #     return HttpResponse("Not Authed")
    if request.method == "POST":
        form = ChallengeForm(
            request.POST, initial={"challenger_username": request.user}
        )
        if form.is_valid():
            """Create the challenge"""
            platform = request.POST["platform"]
            game = request.POST["game"]
            game_obj, _ = Game.objects.get_or_create(platform=platform, game=game)
            wager = Wager(
                challenger_id=request.user.id,
                respondent_id=0,
                amount=request.POST["amount"],
                unique_code="new",
                game=game_obj,
            )
            wager.generate_unique_code()
            context = {"unique_code": str(wager.unique_code), "form": form}
            return HttpResponse(str(wager.unique_code))
        else:
            return HttpResponse("not valid")
    form = ChallengeForm(initial={"challenger_username": request.user.username})
    context = {"form": form}
    return render(request, "challenge_init.html", context)


def challenge_status(request, challenge_id):
    challenge = get_object_or_404(Wager, unique_code=challenge_id)
    current_user = UserProfile.objects.get(user=request.user)
    challenger = UserProfile.objects.get(user__id=challenge.challenger_id)

    respondent = None
    if challenge.respondent_id:
        respondent = UserProfile.objects.filter(
            user__id=challenge.respondent_id
        ).first()
    form = None
    if challenge.status == Wager.AWAITING_RESPONSE:
        form = AcceptForm()
    if challenge.status == Wager.ACCEPTED:
        form = AnteForm()
    if challenge.status == Wager.IN_PROGRESS:
        form = WinnerForm()
    context = {
        "challenge": challenge,
        "challenger": challenger,
        "form": form,
        "respondent": respondent,
        "viewer": current_user == challenger,
    }
    print(context)
    return render(request, "challenge_status.html", context)


def challenge_accept(request, challenge_id):
    challenge = get_object_or_404(Wager, unique_code=challenge_id)
    # make it so you cant accept your own challenge
    respondent = UserProfile.objects.get(user=request.user)
    print(respondent)
    challenger = UserProfile.objects.get(user__id=challenge.challenger_id)
    print(challenger)
    if respondent == challenger:
        return HttpResponse("cannot accept own challenge")
    challenge.accept(respondent)
    context = {
        "respondent": respondent,
        "challenger": challenger,
    }
    return HttpResponse(f"{context}")


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
        amount = challenge.amount

        payment_client = AuthorizeClient("token")
        payment_status = payment_client("source", "target", amount)

        payment = Payment.objects.get_or_create(
            user=request.user,
            wager=challenge,
            authorize_net_payment_id=payment_status["id"],
            authorize_net_payment_status=payment_status["status"],
        )
        return HttpResponse(f"{payment.authorize_net_payment_status}")

    return HttpResponse("Bad Payment")


def challenge_winner(request, challenge_id):
    """Verify both people are supposed to be here"""
    pass


def challenges(request):
    """
    Gets all of a users challenges
    """
    if request.user.is_authenticated:
        challenges = Wager.objects.filter(challenger_id=request.user.id)
        context = {"challenges": challenges}
        return render(request, "challenges.html", context)
    return HttpResponse("None")

"""
Challenge related endpoints

TODO: ?
"""
import json

from django.contrib.auth.models import User
from django.http import HttpResponse, HttpResponseRedirect, JsonResponse
from django.shortcuts import get_object_or_404, render
from django.urls import reverse
from django.views.decorators.csrf import ensure_csrf_cookie
from inertia import inertia

# from inertia import render

from api.forms import AcceptForm, AnteForm, ChallengeForm, WinnerForm
from api.models import Game, Payment, UserProfile, Wager

from payment.authorize_client import AuthorizeClient


@ensure_csrf_cookie
@inertia("Challenge/Create")
def challenge(request):
    if not request.user.is_authenticated:
        return JsonResponse({"message": "Not Authed"})
    if request.method == "POST":
        data = json.loads(request.body)
        form = ChallengeForm(data, initial={"challenger_username": request.user})
        if form.is_valid():
            """Create the challenge"""
            platform = data["platform"]
            game = data["game"]
            game_obj, _ = Game.objects.get_or_create(platform=platform, game=game)
            wager = Wager(
                challenger_id=request.user.id,
                amount=data["amount"],
                unique_code="new",
                game=game_obj,
            )
            wager.generate_unique_code()
            context = {"unique_code": str(wager.unique_code)}
            return JsonResponse(context)
        else:
            return JsonResponse(form.errors.get_json_data())
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
        # challenger_ids = [challenge.challenger_id, challenge.respondent_id]
        # choices = [
        #     (user_id, UserProfile.objects.get(user__id=user_id))
        #     for user_id in challenger_ids
        # ]
        # print(choices)

    context = {
        "challenge": challenge,
        "challenger": challenger,
        "form": form,
        "respondent": respondent,
        "viewer": current_user == challenger,
    }
    context.update(form.errors.get_json_data())
    return render(request, "challenge_status.html", context)


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
            return JsonResponse(form.errors.get_json_data())
        gamer_tag = data["gamer_tag"]
        challenge.accept(respondent, gamer_tag)
        context = {
            "respondent": respondent,
            "challenger": challenger,
        }
        return JsonResponse(form.errors.get_json_data())
    return JsonResponse(form.errors.get_json_data())


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
        payment_status = payment_client.send_payment("source", "target", amount)

        payment, _ = Payment.objects.get_or_create(
            user=request.user,
            wager=challenge,
            authorize_net_payment_id=payment_status["id"],
            authorize_net_payment_status=payment_status["status"],
        )
        challenge.all_payments_received()
        return HttpResponse(f"{payment.authorize_net_payment_status}")

    return HttpResponse("Bad Payment")


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
            return JsonResponse({"message": "You didnt participate"})
        if challenge.both_voted():
            if challenge.disputed():
                challenge.status = Wager.DISPUTED
                challenge.save()
                # fire off a email, or keep voting open if they change their mind?
            else:
                challenge.status = Wager.COMPLETED
                challenge.save()
        return JsonResponse({"vote": f"You voted for {data['winner']}"})

    return JsonResponse(form.errors.get_json_data())

    # challenger_ids = [challenge.challenger_id, challenge.respondent_id]
    # choices = [
    #     (user_id, UserProfile.objects.get(user__id=user_id))
    #     for user_id in challenger_ids
    # ]
    # print(choices)
    # form.CHOICES = choices


@inertia("Challenge/Index")
def challenges(request):
    """
    Gets all of a users challenges
    """
    if request.user.is_authenticated:
        challenges = Wager.objects.filter(challenger_id=request.user.id)
        context = {"challenges": challenges}
        return render(request, "challenges.html", context)
    return HttpResponse("None")

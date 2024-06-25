"""
Challenge related endpoints
"""

from datetime import datetime, timezone
import json
import os

from django.http import JsonResponse, HttpResponseRedirect
from django.shortcuts import get_object_or_404
from django.views.decorators.csrf import ensure_csrf_cookie
from inertia import inertia, share

from api.emails import Email
from api.sms import (
    AcceptedSMS,
    BeginSMS,
    SelectedSMS,
)
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
from kernel import settings

# from payment.authorize_client import AuthorizeClient
from payment.paynote_client import PaynoteClient


@ensure_csrf_cookie
@inertia("Challenge/Create")
def challenge(request):
    """
    Create a challenge.

    Puts challenge into AWAITING_RESPONSE status.
    Challenge will expire if noone accepts within time limit.
    """
    if not request.user.is_authenticated:
        return {"message": "Requires Auth"}
    user = UserProfile.objects.get(user=request.user)
    if request.method == "POST":
        data = json.loads(request.body)
        form = ChallengeForm(data, initial={"challenger_username": request.user})
        if form.is_valid():
            platform = data["platform"]
            game = data["game"]
            terms = data["terms"]
            game_obj = Game.objects.get(
                game__name=game, terms__terms=terms, platform__name=platform
            )
            wager = Wager.objects.create(
                challenger_id=request.user.id,
                challenger_gamer_tag=data["challenger_gamer_tag"],
                amount=data["amount"],
                game=game_obj,
            )
            wager.winning_amt = wager.calculate_winning_payment()
            wager.save()
            return HttpResponseRedirect(f"challenge/{wager.unique_code}")
        else:
            print(form.errors.get_json_data())
            return {"errors": form.errors.get_json_data()}
    return {
        "user": user,
        "games": serialize_objs(Game.objects.all()),
        "platforms": Game.PLATFORM,
        "choices": Game.get_selections(),
    }


@ensure_csrf_cookie
@inertia("Challenge/Show")
def challenge_status(request, challenge_id):
    """Gets info on an existing challenge."""
    challenge = get_object_or_404(Wager, unique_code=challenge_id)
    current_user = None
    if not request.user.is_authenticated:
        return {"challenge": serialize(challenge)}
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
        if challenge.status == Wager.COMPLETED:
            return challenge_award(request, challenge_id)

    props = {
        "challenge": serialize(challenge),
        "user": current_user,
        "authorize_public_key": settings.AUTHORIZE_PUBLIC_KEY,
        "authorize_login_id": settings.AUTHORIZE_LOGIN_ID,
    }

    return props


@ensure_csrf_cookie
@inertia("Challenge/Search")
def challenge_search(request):
    """Looks up a challenge by its unique_code."""
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
    """Allows a respondent to accept a challenge."""
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
        AcceptedSMS(
            context={"challenge": challenge},
            target=challenger.phone_number,
        ).send()
        return props
    return {"errors": form.errors.get_json_data()}


def challenge_ante(request, challenge_id):
    """Takes payments from users."""
    challenge = get_object_or_404(Wager, unique_code=challenge_id)
    challengers = [challenge.challenger_id, challenge.respondent_id]

    if request.user.id not in challengers:
        raise Exception("You are not part of this challenge.")

    data = json.loads(request.body)
    print("Challenge Ante Request Body: ", request.body)
    form = AnteForm(data)
    if form.is_valid():
        data_value = data.get("data_value")

        # Extract necessary details
        first_name = request.user.first_name
        last_name = request.user.last_name
        email = request.user.email
        business_name = request.user.username
        phone = "1234567890"  # Replace with actual phone number if available

        routing = data_value.get("routing")
        number = data_value.get("number")
        account_type = data_value.get("type", "checking")
        bank = data_value.get("bank")

        payment_client = PaynoteClient()

        # Step 1: Create Customer
        customer_response = payment_client.create_customer(first_name, last_name, email, business_name, phone)
        if not customer_response.get("success"):
            return JsonResponse({"errors": "Failed to create customer", "details": customer_response}, status=400)

        user_id = customer_response["user"]["user_id"]

        # Step 2: Create Funding Source
        funding_response = payment_client.create_funding_source(
            user_id=user_id,
            routing=routing,
            number=number,
            account_type=account_type,
            bank=bank
        )
        print("PASS PHASE 1", funding_response)

        if funding_response.get("responseCode"):
            status = Payment.GOOD
            payment, _ = Payment.objects.get_or_create(
                user=request.user,
                wager=challenge,
                authorize_net_payment_id=funding_response.get("transId"),
                authorize_net_payment_status=status,
                description=funding_response.get("description"),
            )
            
            # Update challenge status to reflect payment
            if request.user.id == challenge.challenger_id:
                challenge.challenger_paid = True
            elif request.user.id == challenge.respondent_id:
                challenge.respondent_paid = True
            challenge.save()
            
            both_paid = challenge.all_payments_received()
            if both_paid:
                phone_numbers = [challenge.get_challenger().phone_number, challenge.get_respondent().phone_number]
                for number in phone_numbers:
                    BeginSMS(context={"challenge": challenge}, target=number).send()
                
                # Automatically trigger challenge_winner function
                challenge.determine_winner()
                
                return JsonResponse({"status": payment.authorize_net_payment_status, "challenge": serialize(challenge)})
            return JsonResponse({"status": "payment processed", "challenge": serialize(challenge)})
        else:
            error_details = funding_response.get("errorText", funding_response.get("errorDetails", "No detailed error information available."))
            return JsonResponse({
                "errors": "Bad Payment",
                "details": error_details,
                "full_response": funding_response
            })
    else:
        # Log the form errors for debugging purposes
        print("Form validation failed with errors: ", form.errors.get_json_data())
        
    return JsonResponse({"errors": "Form validation failed or other errors"})



def challenge_winner(request, challenge_id):
    """
    Users select who they believe won.

    Can keep it in IN_PROGRESS if only one user voted.
    Can move wager to DISPUTED if both vote and they differ.
    Can move wager to COMPLETED if both vote and agree.
    """
    try:
        data = json.loads(request.body)
        print("Challenge Winner Request Body: ", request.body)
    except json.JSONDecodeError as e:
        return JsonResponse({'error': 'Invalid JSON data'}, status=400)

    challenge = get_object_or_404(Wager, unique_code=challenge_id)
    form = WinnerForm(data, choices=challenge.get_winner_choices())
    if form.is_valid():
        user_id = request.user.id
        if user_id == challenge.challenger_id:
            challenge.challenger_vote = data["winner"]
            challenge.save()
            not_voter = challenge.get_respondent()
        elif user_id == challenge.respondent_id:
            challenge.respondent_vote = data["winner"]
            challenge.save()
            not_voter = challenge.get_respondent()
        else:
            return JsonResponse({"message": "You didn't participate"}, status=403)

        if not challenge.both_voted():
            SelectedSMS(
                context={"challenge": challenge},
                target=not_voter.phone_number,
            ).send()

        if challenge.both_voted():
            if challenge.disputed():
                challenge.status = Wager.DISPUTED
                email_context = challenge.get_competitors()
                email_context["challenge"] = challenge
                email_context["game"] = challenge.game
                email = Email(
                    "dispute",
                    context=email_context,
                    sent_from=settings.EMAIL_CONTACT_SENDER,
                    target=settings.EMAIL_CONTACT_SENDER,
                    bcc=[
                        email_context["challenger"].email,
                        email_context["respondent"].email,
                    ],
                    subject="Challenge Dispute",
                )
                email.send()
                challenge.save()
            else:
                challenge.status = Wager.COMPLETED
                challenge.save()
                challenge.determine_winner()
        return JsonResponse({"challenge": serialize(challenge)})

    return JsonResponse({"errors": form.errors.get_json_data()}, status=400)



def challenge_award(request, challenge_id):
    """Once a winner is chosen, they have to fill out Paypal info."""
    data = json.loads(request.body)
    challenge = get_object_or_404(Wager, unique_code=challenge_id)
    form = PayPalForm(data)
    if form.is_valid():
        paypal_email = data.get("paypal_email")
        challenge.winner_paypal = paypal_email
        challenge.paypal_time_start = datetime.now(timezone.utc)
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

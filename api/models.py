from datetime import datetime, timezone
from decimal import Decimal
import uuid

from django.db import models
from django import forms
from django.contrib.auth.models import User

from api.utils import generate_unique_code


# Create your models here.
class UserProfile(models.Model):
    """A profile that represents a user."""

    user = models.ForeignKey(User, on_delete=models.CASCADE)
    username = models.CharField(max_length=30, blank=False)
    first_name = models.CharField(max_length=40)
    last_name = models.CharField(max_length=40)
    email = models.EmailField()
    state = models.CharField(max_length=2)
    phone_number = models.CharField(max_length=11, blank=False, null=False, unique=True)
    birthday = models.DateField(null=False, blank=False)
    winnings = models.DecimalField(
        max_digits=10, decimal_places=2, default=00.00, null=True
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    reset_password_id = models.CharField(max_length=36, null=True, blank=True)
    reset_password_time = models.DateTimeField(null=True, blank=True)
    verification_id = models.CharField(default=uuid.uuid4, max_length=36, blank=False)
    acct_verified = models.BooleanField(default=False, null=False)

    def __str__(self):
        return f"<Profile: {self.username} #{self.id}>"

    def __repr__(self):
        return self.__str__()

    def reset_password(self):
        self.reset_password_id = uuid.uuid4()
        self.save()

    def natural_key(self):
        return self.get_user_display()


class Wager(models.Model):
    """Object representation of a Wager"""

    ACCEPTED = "accepted"  # respondent has accepted the challenge
    IN_PROGRESS = "in_progress"  # payment recieved
    AWAITING_RESPONSE = "awaiting_response"  # just created (default)
    COMPLETED = "completed"  # completed
    DISPUTED = "disputed"  # disputed
    EXPIRED = "expired"  # expired

    WAGER_STATUS = [
        (ACCEPTED, "Accepted"),
        (IN_PROGRESS, "In Progress"),
        (AWAITING_RESPONSE, "Awaiting Response"),
        (COMPLETED, "Completed"),
        (DISPUTED, "Disputed"),
        (EXPIRED, "Expired"),
    ]

    ACTIVE_STATUS = [
        ACCEPTED,
        IN_PROGRESS,
        AWAITING_RESPONSE,
        DISPUTED,
    ]

    INACTIVE_STATUS = [
        COMPLETED,
        EXPIRED,
    ]
    TEN = Decimal("10.00")
    TWENTYFIVE = Decimal("25.00")
    FIFTY = Decimal("50.00")
    AMOUNT_CHOICES = [
        (TEN, "10.00"),
        (TWENTYFIVE, "25.00"),
        (FIFTY, "50.00"),
    ]

    challenger_id = models.IntegerField()
    respondent_id = models.IntegerField(blank=True, null=True)
    # make amount a choice box
    amount = models.DecimalField(
        choices=AMOUNT_CHOICES,
        max_digits=6,
        decimal_places=2,
        # widget=forms.Select(choices=AMOUNT_CHOICES),
    )
    game = models.ForeignKey("Game", on_delete=models.CASCADE, blank=True)
    notes = models.CharField(max_length=200, blank=True, null=True)
    unique_code = models.CharField(
        default=generate_unique_code, max_length=40, blank=True
    )
    challenger_gamer_tag = models.CharField(max_length=40, blank=True, null=True)
    respondent_gamer_tag = models.CharField(max_length=40, blank=True, null=True)
    status = models.CharField(
        max_length=30, choices=WAGER_STATUS, default=AWAITING_RESPONSE
    )
    in_progress_time = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    challenger_vote = models.CharField(max_length=10, null=True, blank=True)
    respondent_vote = models.CharField(max_length=10, null=True, blank=True)

    challenger_paid = models.BooleanField(default=False)
    respondent_paid = models.BooleanField(default=False)

    winner = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True)
    winning_amt = models.DecimalField(
        default=0.00, max_digits=6, decimal_places=2, null=True, blank=True
    )
    winner_paypal = models.CharField(max_length=100, blank=True, null=True)
    paypal_payment_id = models.CharField(max_length=40, null=True, blank=True)
    winner_paid = models.BooleanField(default=False)

    def __str__(self):
        respondent = "NOT ACCEPTED"
        if self.respondent_id:
            respondent = self.respondent_id
        return f"<{self.challenger_id} vs {respondent} at {self.game}: {self.status}>"

    def __repr__(self):
        return self.__str__()

    def get_challenger(self):
        return UserProfile.objects.get(user__id=self.challenger_id)

    def get_respondent(self):
        return UserProfile.objects.get(user__id=self.respondent_id)

    def get_winner_choices(self):
        """Returns a list of potential winners for use in a form choices"""
        choice_a = self.challenger_id, User.objects.get(id=self.challenger_id)
        choice_b = self.respondent_id, User.objects.get(id=self.respondent_id)
        choices = choice_a, choice_b
        return choices

    def get_competitors(self):
        """Returns dict of Users in challenge"""
        return {
            "challenger": User.objects.get(id=self.challenger_id),
            "respondent": User.objects.get(id=self.respondent_id),
            "challenger_vote": User.objects.get(id=self.challenger_vote),
            "respondent_vote": User.objects.get(id=self.respondent_vote),
        }

    def both_voted(self):
        return self.challenger_vote and self.respondent_vote

    def disputed(self):
        """verifies both voted and they are not equal"""
        return self.both_voted() and (
            str(self.challenger_vote) != str(self.respondent_vote)
        )

    def accept(self, respondent, respondent_gamer_tag):
        """Allows a respondent to accepts a challenge"""
        self.respondent_id = respondent.user.id
        self.respondent_gamer_tag = respondent_gamer_tag
        self.status = self.ACCEPTED
        self.save()

    def all_payments_received(self):
        """Checks if both users paid"""
        challenger = Payment.objects.filter(wager=self, user__id=self.challenger_id)
        respondent = Payment.objects.filter(wager=self, user__id=self.respondent_id)
        if challenger:
            self.challenger_paid = True
        if respondent:
            self.respondent_paid = True

        if self.challenger_paid and self.respondent_paid:
            self.status = Wager.IN_PROGRESS
            self.in_progress_time = datetime.now(timezone.utc)
        self.save()
        return self.challenger_paid and self.respondent_paid

    def determine_winner(self):
        """Determines all winner conditions."""
        challenger_vote = None
        respondent_vote = None
        if self.winner:
            return self.winner

        if self.challenger_vote:
            challenger_vote = UserProfile.objects.get(user__id=self.challenger_vote)
        if self.respondent_vote:
            respondent_vote = UserProfile.objects.get(user__id=self.respondent_vote)

        # 1: Both people select the same person.
        if challenger_vote == respondent_vote:
            self.winner = challenger_vote.user
        # 2: Only one votes.
        elif challenger_vote and not respondent_vote:
            self.winner = challenger_vote.user
        # 3: Only one votes.
        elif not challenger_vote and respondent_vote:
            self.winner = respondent_vote.user
        # 4: No one votes.
        elif not respondent_vote and not challenger_vote:
            self.winner = None

        self.save()
        self.award_payment()
        return self.winner

    def calculate_winning_payment(self):
        """Simple winning calculating"""
        if self.amount == 10.00:
            return 18.00
        elif self.amount == 25.00:
            return 45.00
        elif self.amount == 50.00:
            return 90.00

    def award_payment(self):
        """Adds calculated payment to winner's profile"""
        winning = self.calculate_winning_payment()
        winner = UserProfile.objects.get(user=self.winner)
        winner.winnings += Decimal(winning)
        winner.save()


class Payment(models.Model):
    """A profile that represents a Payment."""

    GOOD = "go"
    BAD = "ba"
    OKAY = "ok"

    PAYMENT_STATUS = [
        (GOOD, "GOOD"),
        (BAD, "BAD"),
        (OKAY, "OKAY"),
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE)
    wager = models.ForeignKey("Wager", on_delete=models.CASCADE)
    authorize_net_payment_id = models.CharField(max_length=16)
    authorize_net_payment_status = models.CharField(
        max_length=2, choices=PAYMENT_STATUS, default=GOOD
    )
    description = models.CharField(max_length=100, null=False, blank=True, default="")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"<{self.user} paid {self.wager.amount} for {self.wager.unique_code}>"


class Game(models.Model):
    PLATFORM = [
        ("xbox", "Xbox"),
        ("playstation_5", "Playstation 5"),
        ("switch", "Switch"),
        ("pc", "Superior PC"),
    ]
    GAMES = [
        ("rocket_league", "Rocket League"),
        ("madden_24", "Madden 24"),
        ("nba_2k_24", "NBA 2K 24"),
    ]
    platform = models.ForeignKey("Platform", on_delete=models.CASCADE)
    game = models.ForeignKey("GameName", on_delete=models.CASCADE)
    terms = models.ForeignKey("Term", on_delete=models.CASCADE)
    discord_link = models.URLField(null=False, blank=False)

    def __str__(self):
        return f"<{self.game} for {self.platform}: {self.terms}>"

    def __repr__(self):
        return self.__str__()

    def natural_key(self):
        return f"{self.get_game_display()} for {self.get_platform_display()}"

    @staticmethod
    def get_selections():
        """returns tree representation of games/platforms/terms"""
        choices = {}
        games = Game.objects.all()
        for game in games:
            game_name = game.game.name
            platform = game.platform.name
            terms = game.terms.terms
            if game_name not in choices:
                choices[game_name] = {"terms": [], "platforms": []}
            if platform not in choices[game_name]["platforms"]:
                choices[game_name]["platforms"].append(platform)
            if terms not in choices[game_name]["terms"]:
                choices[game_name]["terms"].append(
                    {"term": terms, "discord_link": game.discord_link}
                )
        return choices


class GameName(models.Model):
    name = models.CharField(max_length=200, blank=False, null=False)

    def __str__(self):
        return self.name


class Platform(models.Model):
    name = models.CharField(max_length=200, blank=False, null=False)

    def __str__(self):
        return self.name


class Term(models.Model):
    terms = models.CharField(max_length=200, blank=False, null=False)

    def __str__(self):
        return self.terms

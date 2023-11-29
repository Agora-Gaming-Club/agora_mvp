import datetime
import random
import string
import uuid

from datetime import datetime
from django.db import models
from django.contrib.auth.models import User


# Create your models here.
class UserProfile(models.Model):
    """
    A profile that represents a user.

    Note: username and email might not actually be required here
    because they area already estored in the user field
    """

    user = models.ForeignKey(User, on_delete=models.CASCADE)
    username = models.CharField(max_length=30, blank=False)
    first_name = models.CharField(max_length=40)
    last_name = models.CharField(max_length=40)
    email = models.EmailField()
    state = models.CharField(max_length=2)
    phone_number = models.CharField(max_length=11, blank=False, null=False)
    birthday = models.DateField(null=False, blank=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    verification_id = models.CharField(max_length=36, blank=False)
    acct_verified = models.BooleanField(default=False, null=False)
    winnings = models.DecimalField(
        max_digits=10, decimal_places=2, default=00.00, null=True
    )

    def __str__(self):
        return f"<Profile: {self.username} #{self.id}>"

    def __repr__(self):
        return self.__str__()

    def set_verification_id(self):
        self.verification_id = str(uuid.uuid4())
        self.save()


class Wager(models.Model):
    CHALLENGER_WINS = "challenger_wins"
    RESPONDENT_WINS = "respondent_wins"
    ACCEPTED = "accepted"
    IN_PROGRESS = "in_progress"
    AWAITING_RESPONSE = "awaiting_response"
    COMPLETED = "completed"
    DISPUTED = "disputed"
    EXPIRED = "expired"

    WAGER_STATUS = [
        (CHALLENGER_WINS, "Challenger Wins"),
        (RESPONDENT_WINS, "Respondent Wins"),
        (ACCEPTED, "Accepted"),
        (IN_PROGRESS, "In Progress"),
        (AWAITING_RESPONSE, "Awaiting Response"),
        (COMPLETED, "Completed"),
        (DISPUTED, "Disputed"),
        (EXPIRED, "Expired"),
    ]

    challenger_id = models.IntegerField()
    respondent_id = models.IntegerField(blank=True, null=True)
    # make amount a choice box
    amount = models.DecimalField(max_digits=6, decimal_places=2)
    game = models.ForeignKey("Game", on_delete=models.CASCADE, blank=True)
    notes = models.CharField(max_length=200, blank=True, null=True)
    unique_code = models.CharField(max_length=40, blank=True)  # make this unique
    gamer_tag = models.CharField(max_length=40, blank=True, null=True)
    status = models.CharField(
        max_length=30, choices=WAGER_STATUS, default=AWAITING_RESPONSE
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    challenger_vote = models.CharField(max_length=10, null=True, blank=True)
    respondent_vote = models.CharField(max_length=10, null=True, blank=True)

    def __str__(self):
        respondent = "NOT ACCEPTED"
        if self.respondent_id:
            respondent = self.respondent_id
        return f"<{self.challenger_id} vs {respondent} at {self.game}: {self.status}>"

    def __repr__(self):
        return self.__str__()

    def generate_unique_code(self):
        """
        Code should be 12 characters long
        should be formatted like: 1234567890AB
        will be used as url slug
        """

        def random_char():
            return random.choice(string.ascii_letters)

        pieces = [random_char() for x in range(12)]
        code = "".join(pieces)
        self.unique_code = code
        self.save()

    def get_winner_choices(self):
        choice_a = self.challenger_id, User.objects.get(id=self.challenger_id)
        choice_b = self.respondent_id, User.objects.get(id=self.respondent_id)
        choices = choice_a, choice_b
        return choices

    def both_voted(self):
        return self.challenger_vote and self.respondent_vote

    def disputed(self):
        """verifies both voted and they are not equal"""
        return self.both_voted() and (
            str(self.challenger_vote) != str(self.respondent_vote)
        )

    def is_expired(self):
        """
        Index can expire, make this a setting

        Unsure if all challenges can expire at the same age, or if its per challenge
        """
        one_day = datetime.timedelta(days=1)
        now = datetime.now()
        if self.created_at + one_day > now:
            if self.status == self.AWAITING_RESPONSE:
                self.status = self.EXPIRED
                self.save()
                return True
        return False

    def accept(self, respondent, gamer_tag):
        self.respondent_id = respondent.user.id
        self.gamer_tag = gamer_tag
        self.status = self.ACCEPTED
        self.save()

    def all_payments_received(self):
        challengers = [self.challenger_id, self.respondent_id]
        payments = Payment.objects.filter(user__id__in=challengers)
        if len(payments) == 2:
            self.status = Wager.IN_PROGRESS
            self.save()

    def award_payment(self):
        # 1: Both people select the same person.
        if self.challenger_vote == self.respondent_vote:
            print("""Send it to the vote, minus the rake""")
        # 2: Only one votes.
        elif self.challenger_vote and not self.respondent_vote:
            print("""send it to the vote, minus the rake""")
        # 3: Only one votes.
        elif not self.respondent_vote and self.challenger_vote:
            print("""send it to the vote, minus the rake""")
        # 4: No one votes.
        elif not self.respondent_vote and not self.challenger_vote:
            print("""refund all, minus the rake""")


class Payment(models.Model):
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
    platform = models.CharField(max_length=20, choices=PLATFORM)
    game = models.CharField(max_length=20, choices=GAMES)

    def __str__(self):
        return f"<{self.game} for {self.platform}>"

    def __repr__(self):
        return self.__str__()


# TODO: Add a Platform model
# TODO: Replace Game module with something that takes the platform as an arg
# TODO: add terms model that takes game + platform as arg, admin will manually create these 3 models

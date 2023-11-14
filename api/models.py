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
    # phone_number = models.CharField(max_length=15, blank=False, null=False)
    birthday = models.DateField(null=False, blank=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    verification_id = models.CharField(max_length=36, blank=False)
    acct_verified = models.BooleanField(default=False, null=False)
    # impliment this before switching to the API
    # winnings = models.DecimalField(max_digits=10, decimal_places=2, default=00.00)

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
    EXPIRED = "expired"

    WAGER_STATUS = [
        (CHALLENGER_WINS, "Challenger Wins"),
        (RESPONDENT_WINS, "Respondent Wins"),
        (ACCEPTED, "Accepted"),
        (IN_PROGRESS, "In Progress"),
        (AWAITING_RESPONSE, "Awaiting Response"),
        (COMPLETED, "Completed"),
        (EXPIRED, "Expired"),
    ]

    challenger_id = models.IntegerField()
    respondent_id = models.IntegerField(blank=True)
    amount = models.DecimalField(max_digits=6, decimal_places=2)
    game = models.ForeignKey("Game", on_delete=models.CASCADE, blank=True)
    unique_code = models.CharField(max_length=40, blank=True)  # make this unique
    gamer_tag = models.CharField(max_length=40, blank=True)
    status = models.CharField(
        max_length=30, choices=WAGER_STATUS, default=AWAITING_RESPONSE
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

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

    def is_expired(self):
        """
        Challenges can expire, make this a setting

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

    def accept(self, respondent):
        self.respondent_id = respondent.user.id
        self.status = self.ACCEPTED
        self.save()


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


class Game(models.Model):
    PLATFORM = [
        ("xbox", "Xbox"),
        ("playstation_5", "Playstation 5"),
        ("switch", "Switch"),
        ("pc", "Superior PC"),
    ]
    GAMES = [
        ("minecraft", "Minecraft"),
        ("destiny", "Destiny"),
        ("cod_bo3", "COD:BO3"),
        ("minecraft", "Minecraft"),
    ]
    platform = models.CharField(max_length=20, choices=PLATFORM)
    game = models.CharField(max_length=20, choices=GAMES)

    def __str__(self):
        return f"<{self.game} for {self.platform}>"

    def __repr__(self):
        return self.__str__()

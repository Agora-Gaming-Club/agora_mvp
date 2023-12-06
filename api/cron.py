from datetime import datetime, timezone
from api.models import Wager, UserProfile

from kernel.agora_settings import (
    CHALLENGE_EXPIRE_TIME,
    CHALLENGE_RESPONSE_EXPIRE_TIME,
    PASSWORD_CHANGE_EXPIRE_TIME,
)


def my_cron_job():
    print("I should appear in logs")


def challenge_creation_expired():
    challenges = Wager.objects.filter(status=Wager.AWAITING_RESPONSE)
    now = datetime.now(timezone.utc)
    for challenge in challenges:
        if challenge.created_at + CHALLENGE_EXPIRE_TIME < now:
            challenge.status = Wager.EXPIRED
            challenge.save()


def challenge_in_progress_expired():
    challenges = Wager.objects.filter(status=Wager.IN_PROGRESS)
    now = datetime.now(timezone.utc)
    for challenge in challenges:
        if challenge.in_progress_time + CHALLENGE_RESPONSE_EXPIRE_TIME < now:
            challenge.status = Wager.COMPLETED
            challenge.determine_winner()
            challenge.save()


def password_change_expired():
    profiles = UserProfile.objects.exclude(reset_password_id=None)
    now = datetime.now(timezone.utc)
    for profile in profiles:
        if profile.reset_password_time + PASSWORD_CHANGE_EXPIRE_TIME < now:
            profile.reset_password_id = None
            profile.reset_password_time = None
            profile.save()

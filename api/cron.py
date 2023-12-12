"""
Declaration of cron jobs.

Remember to run: `./manage.py crontab add` to actually install the jobs
"""
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
    """
    Move expired challenges into EXPIRED status

    Trolls all challenges in AWAITING_RESPONSE status.
    If they have been in this state for more than CHALLENGE_EXPIRE_TIME, they are marked as EXPIRED.
    """
    challenges = Wager.objects.filter(status=Wager.AWAITING_RESPONSE)
    now = datetime.now(timezone.utc)
    for challenge in challenges:
        if challenge.created_at + CHALLENGE_EXPIRE_TIME < now:
            challenge.status = Wager.EXPIRED
            challenge.save()


def challenge_in_progress_expired():
    """
    Automatically selects winner if challenge is in progress.

    Will mark the user who has a vote as the winner.
    """
    challenges = Wager.objects.filter(status=Wager.IN_PROGRESS)
    now = datetime.now(timezone.utc)
    for challenge in challenges:
        if challenge.in_progress_time + CHALLENGE_RESPONSE_EXPIRE_TIME < now:
            challenge.status = Wager.COMPLETED
            challenge.determine_winner()
            challenge.save()


def password_change_expired():
    """
    Resets user's Password reset request, after PASSWORD_CHANGE_EXPIRE_TIME.

    sets reset_password_id and reset_password_time to None,
    so password reset will no longer work
    """
    profiles = UserProfile.objects.exclude(reset_password_id=None)
    now = datetime.now(timezone.utc)
    for profile in profiles:
        if profile.reset_password_time + PASSWORD_CHANGE_EXPIRE_TIME < now:
            profile.reset_password_id = None
            profile.reset_password_time = None
            profile.save()

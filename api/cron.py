import datetime
from api.models import Wager

from kernel.agora_settings import (
    CHALLENGE_EXPIRE_TIME,
    CHALLENGE_RESPONSE_EXPIRE_TIME,
)


def my_cron_job():
    print("I should appear in logs")


def creation_expired():
    challenges = Wager.objects.filter(status=Wager.IN_PROGRESS)
    now = datetime.datetime.now(datetime.timezone.utc)
    for challenge in challenges:
        if challenge.created_at + CHALLENGE_EXPIRE_TIME < now:
            challenge.status = Wager.EXPIRED
            challenge.save()

"""
Settings specific to the agora gaming app
"""
from datetime import datetime, timedelta

# challenges expires after one day of noone accepting
CHALLENGE_EXPIRE_TIME = timedelta(days=1)
# challenges go to the winner if only one party reports winner
CHALLENGE_RESPONSE_EXPIRE_TIME = timedelta(minutes=360)
# Users have time to reset password if requested
PASSWORD_CHANGE_EXPIRE_TIME = timedelta(minutes=60)

# This list will have 3 additional states added eventually
FORBIDDEN_STATES = [
    "UT",
    "HI",
]
LEGAL_GAMBLING_AGE = 18

"""
Settings specific to the agora gaming app
"""
import datetime

# challenges expires after one day of noone accepting
CHALLENGE_EXPIRE_TIME = datetime.timedelta(days=1)
# challenges go to the winner if only one party reports winner
CHALLENGE_RESPONSE_EXPIRE_TIME = datetime.timedelta(minutes=360)

# This list will have 3 additional states added eventually
FORBIDDEN_STATES = [
    "UT",
    "HI",
]
LEGAL_GAMBLING_AGE = {"AZ": 21}

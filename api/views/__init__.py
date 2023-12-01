from .auth import (
    log_in,
    log_out,
    password_change,
    register,
    forgot_password,
    password_reset,
)
from .general import landing, dashboard
from .challenge import (
    challenge,
    challenge_accept,
    challenge_ante,
    challenge_status,
    challenge_search,
    challenge_winner,
    challenges,
)
from .profile import (
    profile_edit,
    profile_view,
)

_ = [  # This does nothing, but silence a pep8 error
    log_in,
    log_out,
    password_change,
    forgot_password,
    password_reset,
    register,
    challenge,
    challenge_accept,
    challenge_ante,
    challenge_status,
    challenge_search,
    challenge_winner,
    challenges,
    profile_edit,
    profile_view,
]

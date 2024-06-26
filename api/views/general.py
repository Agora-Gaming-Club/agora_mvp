"""General endpoints"""
from django.http import HttpResponseRedirect
from django.urls import reverse
from inertia import inertia

from api.models import UserProfile, Wager
from api.serializers import serialize_objs
from api.utils import paginate


# Create your views here.
@inertia("Welcome")
def landing(request):
    if request.user.is_authenticated:
        return HttpResponseRedirect(reverse("dashboard"))
    return {}


@inertia("Dashboard")
def dashboard(request):
    """
    Gets all of a users challenges, paginated

    query_params:
    active_page: page of challenger query
    active_amt: amount per challenger page
    old_page: page of respondent query
    old_amt: amount per respondent page
    """
    active_page = request.GET.get("active_page", 1)
    active_amt = request.GET.get("active_amt", 10)
    old_page = request.GET.get("old_page", 1)
    old_amt = request.GET.get("old_amt", 10)

    if request.user.is_authenticated:
        user = UserProfile.objects.get(user=request.user)

        active_challenges = Wager.objects.filter(
            challenger_id=request.user.id, status__in=Wager.ACTIVE_STATUS
        ) | Wager.objects.filter(
            respondent_id=request.user.id, status__in=Wager.ACTIVE_STATUS
        ).order_by(
            "created_at"
        )

        old_challenges = Wager.objects.filter(
            challenger_id=request.user.id, status__in=Wager.INACTIVE_STATUS
        ) | Wager.objects.filter(
            respondent_id=request.user.id, status__in=Wager.INACTIVE_STATUS
        ).order_by(
            "created_at"
        )

        # TODO:  make a serializer for the challenges
        active_challenges = serialize_objs(active_challenges)
        active = paginate(active_challenges, active_page, active_amt)

        old_challenges = serialize_objs(old_challenges)
        old = paginate(old_challenges, old_page, old_amt)

        props = {
            "user": user,
            "active": active,
            "old": old,
        }
        return props
    return {}

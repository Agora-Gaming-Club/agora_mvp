from inertia import inertia

from api.models import UserProfile, Wager


# Create your views here.
@inertia("Welcome")
def landing(request):
    return {}


@inertia("Dashboard")
def dashboard(request):
    challenges = Wager.objects.filter(challenger_id=request.user.id)
    user = UserProfile.objects.get(user=request.user)
    return {
        "user": user,
        "challenges": challenges
    }

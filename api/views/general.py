from inertia import inertia


# Create your views here.
@inertia("Welcome")
def landing(request):
    return {}


@inertia("Dashboard")
def dashboard(request):
    return {}

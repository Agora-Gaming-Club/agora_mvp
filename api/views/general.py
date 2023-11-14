from django.contrib.auth.models import User
from django.http import HttpResponse, HttpResponseRedirect
from django.shortcuts import get_object_or_404, render
from django.urls import reverse

# from inertia import render

from api.forms import ChallengeForm
from api.models import Wager, UserProfile


# Create your views here.
def index(request):
    return render(request, "home.html")

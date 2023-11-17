from django.contrib.auth.models import User
from django.http import HttpResponse, HttpResponseRedirect
from django.shortcuts import get_object_or_404, render
from django.urls import reverse
from inertia import inertia


# from inertia import render

from api.forms import ChallengeForm
from api.models import Wager, UserProfile


# Create your views here.
@inertia("Home")
def index(request):
    return {}


# Create your views here.
@inertia("Welcome")
def landing(request):
    return {}

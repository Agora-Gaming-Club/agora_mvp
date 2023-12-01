# TODO EVERYTHING HERE SHOUD BE MOVED TO auth.py
import json

from django.contrib.auth.models import User
from django.contrib.auth import logout, login
from django.core import serializers
from django.http import HttpResponse, HttpResponseRedirect
from django.shortcuts import get_object_or_404, render
from django.urls import reverse
from django.views.decorators.csrf import ensure_csrf_cookie
from inertia import inertia

from api.models import UserProfile
from api.forms import ProfileForm, RegisterForm


@inertia("Profile/Index")
def profile_view(request, user_id=None):
    if user_id:
        profile = get_object_or_404(UserProfile, user__id=user_id)
    else:
        profile = UserProfile.objects.get(user=request.user)
    return {"profile": profile}


@ensure_csrf_cookie
@inertia("Profile/Edit")
def profile_edit(request):
    if request.method == "POST":
        form = ProfileForm(request.POST)
        if form.is_valid():
            UserProfile.objects.filter(user=request.user).update(
                username=request.POST.get("username"),
                email=request.POST.get("email"),
                bio=request.POST.get("bio"),
                is_streamer=request.POST.get("is_streamer") == "on",
                profile_image_url=request.POST.get("profile_image_url"),
            )
            return HttpResponse("profile updated")
    else:
        profile = UserProfile.objects.get(user=request.user)
        serialized = serializers.serialize("json", [profile])
        serialized_dict = json.loads(serialized)[0]
        form = ProfileForm(initial=serialized_dict["fields"])
        context = {"form": form}
        return {
            "user": profile
        }

import json

from django.contrib.auth.models import User
from django.contrib.auth import logout, login
from django.core import serializers
from django.http import HttpResponse, HttpResponseRedirect
from django.shortcuts import get_object_or_404, render
from django.urls import reverse

from api.models import UserProfile
from api.forms import ProfileForm, RegisterForm


def profile_view(request, user_id=None):
    if user_id:
        profile = get_object_or_404(UserProfile, user__id=user_id)
    else:
        print(request.user)
        profile = UserProfile.objects.get(user=request.user)
        print(profile)
    context = {"profile": profile}
    return render(request, "registration/profile.html", context)


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
        return render(request, "registration/profile_edit.html", context)

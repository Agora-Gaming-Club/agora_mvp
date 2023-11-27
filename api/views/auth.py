"""
Auth related endpooints

TODO: Verify that @ensure_csrf_cookie is required (not 100% sure)
TODO: replace renders on login/logout/password_change
"""
import json

from django.contrib.auth.models import User
from django.contrib.auth import logout, login, authenticate
from django.http import HttpResponse, HttpResponseRedirect, JsonResponse
from django.shortcuts import render
from django.urls import reverse
from django.views.decorators.csrf import ensure_csrf_cookie
from inertia import inertia
from inertia.share import share


from api.models import UserProfile
from api.forms import RegisterForm, PasswordChangeForm, LoginForm
from api.utils import good_email


@ensure_csrf_cookie
@inertia("Auth/Login")
def log_in(request):
    """
    Standard login page with error bubbling.

    User is to use email
    """
    errors = []
    if request.method == "POST":
        data = json.loads(request.body)
        form = LoginForm(data)
        if form.is_valid():
            username = ""
            # username=data['username']
            if good_email(data["username"]):
                user_profile = User.objects.filter(email=data["username"])
                if user_profile:
                    username = user_profile.first().username

            password = data["password"]
            user = authenticate(username=username, password=password)
            if user:
                login(request, user)
                return HttpResponseRedirect(reverse("profile_view"))
            else:
                form.add_error("username", "Email/Password incorrect")
                return {"errors": form.errors.get_json_data()}
        else:
            return {"errors": form.errors.get_json_data()}
    form = LoginForm()
    context = {
        "form": form,
        "errors": errors,
    }
    return {}


@ensure_csrf_cookie
def log_out(request):
    logout(request)
    return HttpResponseRedirect(reverse("landing"))


@ensure_csrf_cookie
@inertia("Auth/Register")
def register(request):
    share(request, user={"user": "test"})
    if request.method == "POST":
        data = json.loads(request.body)
        form = RegisterForm(data)
        if form.is_valid():
            user = User.objects.create_user(
                username=data["username"],
                email=data["email"],
                password=data["password"],
                first_name=data["first_name"],
                last_name=data["last_name"],
            )
            profile = UserProfile.objects.create(
                user=user,
                username=data["username"],
                first_name=data["first_name"],
                last_name=data["last_name"],
                email=data["email"],
                state=data["state"].upper(),
                phone_number=data["phone_number"],
                birthday=data["birthday"],
                acct_verified=False,
            )
            profile.set_verification_id()
            login(request, user)
            return HttpResponseRedirect(reverse("profile_view"))
        return {"errors": form.errors.get_json_data()}
    return {}


@ensure_csrf_cookie
@inertia("Auth/PasswordChange")
def password_change(request):
    if request.method == "POST":
        data = json.loads(request.body)
        form = PasswordChangeForm(data)
        if form.is_valid():
            username = request.user.username
            password = data["password"]
            user = authenticate(username=username, password=password)
            if user is not None:
                user.set_password(data["new_password"])
                user.save()
                login(request, user)
                return JsonResponse({"message": "password changed"})
        return JsonResponse(form.errors.get_json_data())

    form = PasswordChangeForm()
    context = {"form": form}
    return render(request, "registration/password_change.html", context)

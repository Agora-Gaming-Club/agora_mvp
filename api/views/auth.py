"""
Auth related endpooints

TODO: Verify that @ensure_csrf_cookie is required (not 100% sure)
"""
from datetime import datetime, timezone
import json
import uuid

from django.contrib.auth.models import User
from django.contrib.auth import logout, login, authenticate
from django.http import HttpResponseRedirect
from django.urls import reverse
from django.views.decorators.csrf import ensure_csrf_cookie
from inertia import inertia
from inertia.share import share

from api.emails import WelcomeEmail, PasswordResetEmail
from api.models import UserProfile
from api.forms import (
    RegisterForm,
    LoginForm,
    PasswordChangeForm,
    PasswordForgotForm,
    PasswordResetForm,
)
from api.utils import good_email


@ensure_csrf_cookie
@inertia("Auth/Login")
def log_in(request):
    """
    Standard login page with error bubbling.

    User is to use email
    """
    errors = []
    if request.user.is_authenticated:
        return HttpResponseRedirect(reverse("dashboard"))

    if request.method == "POST":
        data = json.loads(request.body)
        redirect = data.pop('redirect', None)

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
                if redirect:
                    return HttpResponseRedirect(redirect)
                return HttpResponseRedirect(reverse("dashboard"))
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
    if request.user.is_authenticated:
        return HttpResponseRedirect(reverse("dashboard"))

    if request.method == "POST":
        data = json.loads(request.body)
        redirect = data.pop('redirect', None)
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
            login(request, user)
            email = WelcomeEmail({"profile": profile}, target=profile.email)
            email.send()
            if redirect:
                return HttpResponseRedirect(redirect)
            return HttpResponseRedirect(reverse("dashboard"))
        return {"errors": form.errors.get_json_data()}
    return {}


@ensure_csrf_cookie
@inertia("Profile/ChangePassword")
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
                return {"message": "password changed"}

            form.add_error("password", "Current Password is Incorrect")
        return {"errors": form.errors.get_json_data()}

    user = UserProfile.objects.get(user=request.user)
    return {"user": user}


@ensure_csrf_cookie
@inertia("Auth/ForgotPassword")
def forgot_password(request):
    if request.method == "POST":
        data = json.loads(request.body)
        form = PasswordForgotForm(data)
        if form.is_valid():
            email = data["email"]
            user_profile = UserProfile.objects.filter(email=email)
            if user_profile:
                profile = user_profile.first()
                profile.reset_password_time = datetime.now(timezone.utc)
                username = profile.username
                profile.reset_password()
                email = PasswordResetEmail(
                    {"code": profile.reset_password_id},
                    target=profile.email,
                )
                email.send()
            return {"message": "email sent"}
    return {}


@ensure_csrf_cookie
@inertia("Auth/ResetPassword")
def password_reset(request, reset_password_id):
    if request.method == "POST":
        data = json.loads(request.body)
        form = PasswordResetForm(data)
        if form.is_valid():
            password = data.get("password")
            user_profile = UserProfile.objects.filter(
                reset_password_id=reset_password_id
            )
            if user_profile:
                profile = user_profile.first()
            else:
                return {"error": "link expired"}
            user = profile.user
            user.set_password(password)
            profile.reset_password_id = None
            user.save()
            logout(request)
            return {"message": "password changed"}
        return {"errors": form.errors.get_json_data()}
    return {
        "token": reset_password_id
    }

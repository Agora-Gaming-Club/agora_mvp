import json

from django.contrib.auth.models import User
from django.contrib.auth import logout, login, authenticate
from django.core.validators import validate_email
from django.http import HttpResponse, HttpResponseRedirect, JsonResponse
from django.shortcuts import get_object_or_404, render
from django.urls import reverse
from django.views.decorators.csrf import ensure_csrf_cookie
from inertia import inertia

from api.models import UserProfile
from api.forms import RegisterForm, PasswordChangeForm, LoginForm


def log_in(request):
    """
    Standard login page with error bubbling.

    User is to use username.
    TODO: Make it so it can be either username or email or even phone number
    (preferrably a way to turn one off)
    """
    errors = []
    if request.method == "POST":
        form = LoginForm(request.POST)
        if form.is_valid():
            # something like:
            # if validate_email(request.POST["username"]):
            #     username = UserProfile.objects.filter(request.POST["username"]).first().username
            username = request.POST["username"]
            password = request.POST["password"]
            user = authenticate(username=username, password=password)
            if user:
                login(request, user)
                return HttpResponseRedirect(reverse("profile_view"))
            else:
                form.add_error("username", "Username/Password incorrect")
                return JsonResponse(form.errors.get_json_data())
        else:
            return JsonResponse(form.errors.get_json_data())
    form = LoginForm()
    context = {
        "form": form,
        "errors": errors,
    }
    return render(request, "registration/login.html", context)


def log_out(request):
    logout(request)
    return HttpResponse("you are logged out")


@ensure_csrf_cookie
@inertia('Auth/Register')
def register(request):
    if request.method == "POST":
        print(request.body)
        form = RegisterForm(request.body)
        if form.is_valid():
            user = User.objects.create_user(
                username=request.body["username"],
                email=request.body["email"],
                password=request.body["password"],
                first_name=request.body["first_name"],
                last_name=request.body["last_name"],
            )
            profile = UserProfile.objects.create(
                user=user,
                username=request.body["username"],
                first_name=request.body["first_name"],
                last_name=request.body["last_name"],
                email=request.body["email"],
                state=request.body["state"].upper(),
                phone_number=request.body["phone_number"],
                birthday=request.body["birthday"],
                acct_verified=False,
            )
            profile.set_verification_id()
            login(request, user)
            context = {"profile": profile}
            return {'message': 'Successful!'}
            return HttpResponseRedirect(reverse("profile_view"))
        return JsonResponse(form.errors.get_json_data())
    else:
        form = RegisterForm()
    context = {"form": form}
    return {
        'csrf_token': 'fake'
    }


def password_change(request):
    if request.method == "POST":
        form = PasswordChangeForm(request.POST)
        if form.is_valid():
            username = request.user.username
            password = request.POST["password"]
            user = authenticate(username=username, password=password)
            if user is not None:
                user.set_password(request.POST["new_password"])
                user.save()
                login(request, user)
                return HttpResponse("password changed")
        return JsonResponse(form.errors.get_json_data())

    form = PasswordChangeForm()
    context = {"form": form}
    return render(request, "registration/password_change.html", context)

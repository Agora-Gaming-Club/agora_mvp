import json

from django.contrib.auth.models import User
from django.contrib.auth import logout, login, authenticate
from django.core.validators import validate_email
from django.http import HttpResponse, HttpResponseRedirect, JsonResponse
from django.shortcuts import get_object_or_404, render, redirect
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
                return form.errors.get_json_data()
        else:
            return form.errors.get_json_data()
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
        data = json.loads(request.body)
        print(data)
        # print(request.body)
        # return {
        #     'message': 'return erarly'
        # }
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
            context = {"profile": profile}
            return HttpResponseRedirect(reverse("profile_view"))
            return {
                'url': reverse("profile_view")
            }
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

from django.urls import path
from api import views

urlpatterns = [
    path("", views.index, name="index"),
    path("challenge", views.challenge, name="challenge"),
    path(
        "challenge/accept/<challenge_id>",
        views.challenge_accept,
        name="challenge_accept",
    ),
    path(
        "challenge/ante/<challenge_id>",
        views.challenge_ante,
        name="challenge_ante",
    ),
    path(
        "challenge/winner/<challenge_id>",
        views.challenge_winner,
        name="challenge_winner",
    ),
    path("challenge/<challenge_id>", views.challenge_status, name="challenge_status"),
    path("challenges", views.challenges, name="challenges"),
    path("accounts/profile/", views.profile_view, name="profile_view"),
    path("accounts/profile/edit", views.profile_edit, name="profile_edit"),
    path("accounts/profile/<user_id>", views.profile_view, name="profile_view"),
    path("accounts/register", views.register, name="register"),
    path("accounts/login", views.log_in, name="log_in"),
    path("accounts/logout", views.log_out, name="log_out"),
    path("accounts/password_change", views.password_change, name="password_change"),
]

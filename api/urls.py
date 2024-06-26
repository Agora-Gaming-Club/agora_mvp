"""URLS for api app."""
from django.urls import path
from api import views

urlpatterns = [
    path("", views.landing, name="landing"),
    path("dashboard", views.dashboard, name="dashboard"),
    path("challenge", views.challenge, name="challenge"),
    path("challenge/search", views.challenge_search, name="challenge_search"),
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
    path("accounts/forgot_password", views.forgot_password, name="forgot_password"),
    path(
        "accounts/password_reset/<reset_password_id>",
        views.password_reset,
        name="password_reset",
    ),
    path("user", views.create_customer, name="create_customer"),
    path("accounts/update_profile/", views.update_user_profile, name="update_user_profile"),
    path("on-demand/create_funding_source/", views.create_funding_source, name="create_funding_source"),
    path("funding-source/user/<str:user_id>", views.get_funding_sources, name="get_funding_sources"),
    path("funding-source/<str:source_id>", views.get_funding_details, name="get_funding_details"),
    path("wager/update_payment_status/", views.update_payment_status, name="update_payment_status"),
    path("ach-debit", views.create_ach_debit, name="create_ach_debit"),
]

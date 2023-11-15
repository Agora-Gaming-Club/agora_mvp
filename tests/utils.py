from django.contrib.auth.models import User

from api.models import UserProfile


def make_user(username, email, password, *args, **kwargs):
    user = User.objects.create_user(
        username=username,
        email=email,
        password=password,
    )

    user_profile = UserProfile.objects.create(
        user=user,
        username=user.username,
        email=user.email,
        first_name="Namey",
        last_name="McNameySon",
        state="AZ",
        birthday="2000-01-01",
    )
    return user_profile

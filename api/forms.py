import datetime

from django import forms
from django.contrib.auth.models import User
from django.core.exceptions import ValidationError
from django.forms import ModelForm
from django.shortcuts import get_object_or_404

from api.models import UserProfile, Wager, Game
from kernel.agora_settings import FORBIDDEN_STATES, LEGAL_GAMBLING_AGE


class AcceptForm(forms.Form):
    accept = forms.BooleanField()
    gamer_tag = forms.CharField(max_length=30)

    def is_valid(self):
        valid = super(AcceptForm, self).is_valid()
        valid_gamertag = self.data.get("gamer_tag") is not None
        validation = [valid, valid_gamertag]
        return all(validation)


class ChallengeForm(forms.Form):
    """
    TODO: game/platform will eventually be one field, once Game is open text field for admins
    """

    challenger_username = forms.CharField(max_length=30, disabled=True)
    respondent_username = forms.CharField(max_length=30, required=False)
    gamer_tag = forms.CharField(max_length=30, required=False)
    game = forms.ChoiceField(choices=Game.GAMES)
    platform = forms.ChoiceField(choices=Game.PLATFORM)
    notes = forms.CharField(max_length=200, required=False)
    amount = forms.DecimalField(max_digits=6, decimal_places=2)

    def __init__(self, *args, **kwargs):
        # if "terms" in kwargs:
        #     terms = kwargs.pop("terms")
        super().__init__(*args, **kwargs)
        self.fields["challenger_username"].disabled = True
        # self.fields["terms"].choices = terms

    def is_valid(self):
        valid = super(ChallengeForm, self).is_valid()
        validation = [valid]
        # validate dollar amount is ok?
        return all(validation)


class ChallengeSearchForm(forms.Form):
    unique_code = forms.CharField(max_length=16)


class PasswordForgotForm(forms.Form):
    password = forms.CharField(max_length=40, widget=forms.PasswordInput())
    password_confirm = forms.CharField(max_length=40, widget=forms.PasswordInput())


class PasswordResetForm(forms.Form):
    email = forms.EmailField()


class RegisterForm(forms.Form):
    """Form for registration"""

    username = forms.CharField(max_length=40)
    password = forms.CharField(max_length=40, widget=forms.PasswordInput())
    password_confirm = forms.CharField(max_length=40, widget=forms.PasswordInput())
    first_name = forms.CharField(max_length=40)
    last_name = forms.CharField(max_length=40)
    email = forms.EmailField()
    state = forms.CharField(max_length=2)
    phone_number = forms.CharField(max_length=11)
    birthday = forms.DateField(widget=forms.DateInput())

    def is_valid(self):
        """Validates the fields in the form

        Currently validating:
        if selected user name already exists
        if passwords match
        if email already exists
        if old enough
        if from legal state
        NOT validating:
        password complexity rules (ie: must have special char...etc)
        """
        valid = super(RegisterForm, self).is_valid()
        user_name_exists = User.objects.filter(username=self.data["username"])
        if user_name_exists:
            self.add_error("username", "username unavailable")

        # # Add this back in and get it working properly
        # phone_number_exists = User.objects.filter(
        #     phone_number=self.data["phone_number"]
        # )
        # if phone_number_exists:
        #     self.add_error("phone_number", "username unavailable")

        passwords_match = self.data["password"] == self.data["password_confirm"]
        if not passwords_match:
            self.add_error("password", "passwords dont match")
        email_exists = User.objects.filter(email=self.data["email"])
        if email_exists:
            self.add_error("email", "email unavailable")

        of_age = True
        legal_age = datetime.timedelta(days=365.2425 * LEGAL_GAMBLING_AGE)
        now = datetime.datetime.now()
        birthday = self.data["birthday"]
        birthday_datetime = datetime.datetime.strptime(birthday, "%Y-%m-%d")

        if now - legal_age < birthday_datetime:
            self.add_error("birthday", "too young")
            of_age = False
        accepted_format = "2023-11-14"  # can be messed with later
        forbidden_state = self.data["state"].upper() in FORBIDDEN_STATES
        if forbidden_state:
            self.add_error("state", f"{self.data['state']} is unavailable")

        validation = [
            valid,
            not user_name_exists,
            # not phone_number_exists,
            passwords_match,
            not email_exists,
            of_age,
            not forbidden_state,
        ]
        return all(validation)


class ProfileForm(ModelForm):
    class Meta:
        model = UserProfile
        fields = [
            "username",
            "email",
        ]


class PasswordChangeForm(forms.Form):
    password = forms.CharField(max_length=40, widget=forms.PasswordInput())
    new_password = forms.CharField(max_length=40, widget=forms.PasswordInput())
    new_password_confirm = forms.CharField(max_length=40, widget=forms.PasswordInput())

    def is_valid(self):
        """Validates the fields in the form

        Currently validating:
        This only checks if new and old password match.
        """
        valid = super(PasswordChangeForm, self).is_valid()
        passwords_match = self.data["new_password"] == self.data["new_password_confirm"]
        if not passwords_match:
            self.add_error("new_password", "passwords dont match")
        validation = [
            valid,
            passwords_match,
        ]
        return all(validation)


class LoginForm(forms.Form):
    username = forms.CharField(max_length=40)
    password = forms.CharField(max_length=40, widget=forms.PasswordInput())


class WinnerForm(forms.Form):
    """Needs to be populated with the two combatants"""

    CHOICES = ((5, "User A"), (3, "User B"))

    winner = forms.ChoiceField(choices=CHOICES)

    def __init__(self, *args, **kwargs):
        if "choices" in kwargs:
            choices = kwargs.pop("choices")
        super(WinnerForm, self).__init__(*args, **kwargs)
        self.fields["winner"].choices = choices


class AnteForm(forms.Form):
    """
    Will be a basic credit card form or authorizenet profile form.
    unsure atm.
    """

    payment_info = forms.CharField(max_length=400)


def phone_number_validator(phone_number):
    import re

    regex = "^(\+\d{1,2}\s)?\(?\d{3}\)?[\s.-]\d{3}[\s.-]\d{4}$"
    p = re.compile(regex)
    return p.match(phone_number)


# pn = "520-123-4567"
# x = phone_number_validator(pn)
# print(x)

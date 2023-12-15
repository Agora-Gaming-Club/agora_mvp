from inertia.test import InertiaTestCase

from django.conf import settings
from django.contrib.auth.models import User
from django.contrib.auth import authenticate

from api.models import UserProfile
from tests.utils import make_user, make_file

settings.EMAIL_TEST_MODE = True


class TestAuth(InertiaTestCase):
    def setUp(self):
        super().setUp()
        make_file()
        self.user = User.objects.create_user(
            username="UserName",
            email="totallyreal@email.com",
            password="password",
        )

    def base_register_data(self):
        return {
            "username": "ScarletWitch",
            "email": "wanda@avengers.net",
            "password": "magneto",
            "password_confirm": "magneto",
            "first_name": "Wanda",
            "last_name": "Maximoff",
            "birthday": "1989-02-10",
            "phone_number": "5201234567",
            "state": "CA",
            "acct_verified": False,
        }

    # Login
    def test_change_password(self):
        user = self.client.login(
            username="UserName",
            password="password",
        )
        new_password = "password123"
        self.client.post(
            "/accounts/password_change",
            {
                "password": "password",
                "new_password": new_password,
                "new_password_confirm": new_password,
            },
            content_type="application/json",
        )
        user = authenticate(
            username="UserName",
            password=new_password,
        )
        self.assertEqual(user, self.user)

    def test_change_password_fail(self):
        user = self.client.login(
            username="UserName",
            password="password",
        )
        new_password = "password123"
        self.client.post(
            "/accounts/password_change",
            {
                "password": "password",
                "new_password": new_password,
                "new_password_confirm": "wrong",
            },
            content_type="application/json",
        )
        user = authenticate(
            username="UserName",
            password=new_password,
        )
        self.assertEqual(user, None)

    def test_login_username_fail(self):
        response = self.client.post(
            "/accounts/login",
            {
                "username": "UserName",
                "password": "password",
            },
            content_type="application/json",
        )
        self.assertIn("username", self.props().get("errors", []))

    def test_login_success_email(self):
        response = self.client.post(
            "/accounts/login",
            {
                "username": "totallyreal@email.com",
                "password": "password",
            },
            content_type="application/json",
        )
        self.assertEqual(response.status_code, 302)

    def test_login_wrong_pass(self):
        response = self.client.post(
            "/accounts/login",
            {
                "username": "totallyreal@email.com",
                "password": "password2",
            },
            content_type="application/json",
        )
        self.assertIn("username", self.props().get("errors", []))

    def test_login_wrong_email(self):
        response = self.client.post(
            "/accounts/login",
            {
                "username": "absolutelyfake@email.com",
                "password": "password2",
            },
            content_type="application/json",
        )
        self.assertIn("username", self.props().get("errors", []))

    def test_login_missing_info(self):
        # missing password
        response = self.client.post(
            "/accounts/login",
            {
                "username": "totallyreal@email.com",
                "password": "",
            },
            content_type="application/json",
        )
        self.assertIn("password", self.props().get("errors", []))

        # missing email
        response = self.client.post(
            "/accounts/login",
            {
                "username": "",
                "password": "password",
            },
            content_type="application/json",
        )
        self.assertIn("username", self.props().get("errors", []))

        # missing email and password
        response = self.client.post(
            "/accounts/login",
            {
                "username": "",
                "password": "",
            },
            content_type="application/json",
        )
        self.assertIn("username", self.props().get("errors", []))
        self.assertIn("password", self.props().get("errors", []))

    # Register

    def test_register_success(self):
        base_data = self.base_register_data()
        response = self.client.post(
            "/accounts/register",
            base_data,
            content_type="application/json",
        )

        self.assertEqual(response.status_code, 302)
        # log her in
        user_wanda = User.objects.get(username="ScarletWitch")
        user = authenticate(
            username="ScarletWitch",
            password="magneto",
        )
        self.assertEqual(user, user_wanda)

    def test_forbidden_state(self):
        base_data = self.base_register_data()
        base_data["state"] = "AZ"
        response = self.client.post(
            "/accounts/register",
            base_data,
            content_type="application/json",
        )
        self.assertIn("state", self.props().get("errors", []))

    def test_not_legal_age(self):
        base_data = self.base_register_data()
        base_data["birthday"] = "2019-02-10"
        response = self.client.post(
            "/accounts/register",
            base_data,
            content_type="application/json",
        )
        self.assertIn("birthday", self.props().get("errors", []))

    def test_register_fail_match_passwords(self):
        base_data = self.base_register_data()
        base_data["password_confirm"] = "not_magneto"
        response = self.client.post(
            "/accounts/register",
            base_data,
            content_type="application/json",
        )
        self.assertIn("password", self.props().get("errors", []))

        base_data = self.base_register_data()
        base_data["password"] = "not_magneto"
        response = self.client.post(
            "/accounts/register",
            base_data,
            content_type="application/json",
        )
        self.assertIn("password", self.props().get("errors", []))

    def test_register_missing_required_field(self):
        base_data = self.base_register_data()
        base_data["username"] = ""
        response = self.client.post(
            "/accounts/register",
            base_data,
            content_type="application/json",
        )
        self.assertIn("username", self.props().get("errors", []))

    def test_register_preexisting_acct(self):
        base_data = self.base_register_data()
        response = self.client.post(
            "/accounts/register",
            base_data,
            content_type="application/json",
        )

        response = self.client.post(
            "/accounts/register",
            base_data,
            content_type="application/json",
        )

        users = UserProfile.objects.filter(email=base_data["email"])
        self.assertEqual(1, len(users))

    # Password Reset
    def test_forgot_password_happy(self):
        user = make_user("antman", "hankpym@avengers.net", "wasp")
        response = self.client.post(
            "/accounts/forgot_password",
            {"email": "hankpym@avengers.net"},
            content_type="application/json",
        )
        self.assertIn("message", self.props())

        # # Pretend that i got the email and clicked the link
        user = UserProfile.objects.get(email="hankpym@avengers.net")
        reset_password_id = user.reset_password_id

        response = self.client.post(
            f"/accounts/password_reset/{reset_password_id}",
            {
                "password": "asfafsa",
                "password_confirm": "asfafsa",
            },
            content_type="application/json",
        )
        self.assertEqual(self.props(), {"message": "password changed"})

    def test_forgot_password_email_doesnt_exist(self):
        user = make_user("antman", "hankpym@avengers.net", "wasp")
        response = self.client.post(
            "/accounts/forgot_password",
            {"email": "hankpym@avengers.net"},
            content_type="application/json",
        )
        # Should return as if all was good, but no email to use.
        self.assertIn("message", self.props())

    def test_forgot_password_invalid_link(self):
        reset_password_id = "alfaldgsg"
        response = self.client.post(
            f"/accounts/password_reset/{reset_password_id}",
            {
                "password": "asfafsa",
                "password_confirm": "asfafsa",
            },
            content_type="application/json",
        )
        # return generic link expired error if its invalid
        self.assertEqual({"error": "link expired"}, self.props())

    def test_forgot_password_email_expired(self):
        user = make_user("antman", "hankpym@avengers.net", "wasp")
        reset_password_id = "8458e01d-3bee-4847-aaa9-bc1b1801269d"
        response = self.client.post(
            f"/accounts/password_reset/{reset_password_id}",
            {
                "password": "test_forgot_password_email_expired",
                "password_confirm": "test_forgot_password_email_expired",
            },
            content_type="application/json",
        )
        # user doenst have reset_password_id so it will seem expired
        self.assertEqual({"error": "link expired"}, self.props())

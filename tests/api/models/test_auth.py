import json

from inertia.test import InertiaTestCase

from django.test import TestCase
from django.contrib.auth.models import User
from django.contrib.auth import logout, login, authenticate

from api.models import UserProfile


class TestAuth(InertiaTestCase):
    def setUp(self):
        super().setUp()
        self.user = User.objects.create_user(
            username="UserName",
            email="totallyreal@email.com",
            password="password",
        )

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
        self.assertIn("username", response.json())

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
        self.assertIn("username", response.json())

    def test_login_wrong_email(self):
        response = self.client.post(
            "/accounts/login",
            {
                "username": "absolutelyfake@email.com",
                "password": "password2",
            },
            content_type="application/json",
        )
        self.assertIn("username", response.json())

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
        self.assertIn("password", response.json())

        # missing email
        response = self.client.post(
            "/accounts/login",
            {
                "username": "",
                "password": "password",
            },
            content_type="application/json",
        )
        self.assertIn("username", response.json())

        # missing email and password
        response = self.client.post(
            "/accounts/login",
            {
                "username": "",
                "password": "",
            },
            content_type="application/json",
        )
        self.assertIn("username", response.json())
        self.assertIn("password", response.json())

    # Register

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
        base_data["state"] = "UT"
        response = self.client.post(
            "/accounts/register",
            base_data,
            content_type="application/json",
        )
        self.assertIn("state", response.json())

    def test_not_legal_age(self):
        base_data = self.base_register_data()
        base_data["birthday"] = "2019-02-10"
        response = self.client.post(
            "/accounts/register",
            base_data,
            content_type="application/json",
        )
        self.assertIn("birthday", response.json())

    def test_register_fail_match_passwords(self):
        base_data = self.base_register_data()
        base_data["password_confirm"] = "not_magneto"
        response = self.client.post(
            "/accounts/register",
            base_data,
            content_type="application/json",
        )
        self.assertIn("password", response.json())

        base_data = self.base_register_data()
        base_data["password"] = "not_magneto"
        response = self.client.post(
            "/accounts/register",
            base_data,
            content_type="application/json",
        )
        self.assertIn("password", response.json())

    def test_register_missing_required_field(self):
        base_data = self.base_register_data()
        base_data["username"] = ""
        response = self.client.post(
            "/accounts/register",
            base_data,
            content_type="application/json",
        )
        self.assertIn("username", response.json())

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
        self.assertIn("username", response.json())
        self.assertIn("email", response.json())

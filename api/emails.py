from smtplib import SMTPSenderRefused

from django.conf import settings
from django.core.mail import EmailMultiAlternatives

from api.utils import load_text


class Email:
    def __init__(self, email_type, context, target=None, bcc=None):
        self.email_type = email_type
        self.context = context
        self.target = target
        self.bcc = bcc
        self.subject = ""

    def send(self):
        # TODO: Grab the templates from the DB if available, first.
        plaintext_filename = f"emails/{self.email_type}.txt"
        text_content = load_text(plaintext_filename, self.context)

        html_filename = f"emails/{self.email_type}.html"
        html_content = load_text(html_filename, self.context)

        message = EmailMultiAlternatives(
            self.subject,
            text_content,
            settings.EMAIL_DEFAULT_SENDER,
            [self.target],
            bcc=self.bcc,
        )
        message.attach_alternative(html_content, "text/html")
        if settings.EMAIL_ENABLED:
            try:
                message.send()
                return True
            except SMTPSenderRefused as sr:
                print("Please check `echo $SENDGRID_API_KEY", sr)
                return False
        if settings.EMAIL_TEST_MODE:
            return True
        else:
            print("FAKE EMAIL SENT:")
            print(f"TO: {self.target}")
            print(f"BCC: {self.bcc}")
            print(f"FROM: {settings.EMAIL_DEFAULT_SENDER}")
            print(f"SUBJECT: {self.subject}")
            print(f"HTMLBODY: {html_content}")
            print(f"TEXTBODY: {text_content}")
            return True


class WelcomeEmail(Email):
    def __init__(self, context, target=None):
        super().__init__("welcome", context, target)
        self.subject = "Welcome"


class PasswordResetEmail(Email):
    def __init__(self, context, target=None):
        super().__init__("password_reset", context, target)
        self.subject = "Password Reset"


class DisputeEmail(Email):
    def __init__(self, context, target=None, bcc=None):
        super().__init__("dispute", context, target, bcc)
        self.subject = "Challenge Dispute"


# class VerificationEmail(Email):
#     def __init__(self, context, target):
#         super().__init__("verification", context, target)
#         self.subject = "Verification"

"""
from api.emails import WelcomeEmail
x = WelcomeEmail({"test": "test"}, 'tristan.royal@nerdery.com')
x.send()
"""

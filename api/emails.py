from smtplib import SMTPSenderRefused

from django.core.mail import EmailMultiAlternatives
from django.template.loader import get_template
from django.conf import settings


class Email:
    def __init__(self, email_type, context, from_=None, target=None, bcc=None):
        self.email_type = email_type
        self.context = context
        self.from_ = from_ or settings.EMAIL_DEFAULT_SENDER
        self.target = target
        self.bcc = bcc
        self.subject = ""

    def send(self):
        # TODO: Grab the templates from the DB if available, first.
        plaintext = get_template(f"emails/{self.email_type}.txt")
        html = get_template(f"emails/{self.email_type}.html")

        text_content = plaintext.render(self.context)
        html_content = html.render(self.context)
        message = EmailMultiAlternatives(
            self.subject,
            text_content,
            self.from_,
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
            print(f"FROM: {self.from_}")
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
        self.from_ = "contact@agoragaming.gg"
        self.subject = "Challenge Dispute"


class DisputeResolvedEmail(Email):
    def __init__(self, context, target):
        super().__init__("dispute_resolved", context, target)
        self.from_ = "contact@agoragaming.gg"
        self.subject = "Dispute Resolved"


"""
from api.emails import WelcomeEmail
x = WelcomeEmail({"test": "test"}, 'tristan.royal@nerdery.com')
x.send()
"""

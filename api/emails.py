from smtplib import SMTPSenderRefused

from django.core.mail import EmailMultiAlternatives
from django.template.loader import get_template
from django.conf import settings


class Email:
    def __init__(self, email_type, context, sent_from=None, target=None, bcc=None):
        self.email_type = email_type
        self.context = context
        self.sent_from = sent_from or settings.EMAIL_DEFAULT_SENDER
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
            self.sent_from,
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
            print(f"FROM: {self.sent_from}")
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
        self.sent_from = "contact@agoragaming.gg"
        self.subject = "Challenge Dispute"


class DisputeResolvedEmail(Email):
    def __init__(self, context, target):
        super().__init__("dispute_resolved", context, target)
        self.sent_from = "contact@agoragaming.gg"
        self.subject = "Dispute Resolved"

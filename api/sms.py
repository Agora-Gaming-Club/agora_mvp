"""Simple SMS client using twilio"""
import os

from django.conf import settings
from django.template.loader import get_template

from twilio.rest import Client


class SMS:
    def __init__(self, sms_type, context, target):
        self.sms_type = sms_type
        self.context = context
        self.target = target
        self.client = Client(
            os.environ.get("TWILIO_ACCOUNT_SID"),
            os.environ.get("TWILIO_AUTH_TOKEN"),
        )

    def send(self):
        text = get_template(f"sms/{self.sms_type}.txt")
        from_number = settings.TWILIO_DEFAULT_NUMBER
        text_content = text.render(self.context)

        if settings.SMS_ENABLED:
            message = self.client.messages.create(
                to=self.target,
                from_=from_number,
                body=text_content,
            )
            print(message.sid)
            return True
        else:
            print("FAKE SMS SENT:")
            print(f"TO: {self.target}")
            print(f"FROM: {from_number}")
            print(f"BODY: {text_content}")
            return True


class AcceptedSMS(SMS):
    def __init__(self, context, target):
        super().__init__("accepted", context, target)


class BeginSMS(SMS):
    def __init__(self, context, target):
        super().__init__("begin", context, target)


class PaidSMS(SMS):
    def __init__(self, context, target):
        super().__init__("paid", context, target)


class SelectedSMS(SMS):
    def __init__(self, context, target):
        super().__init__("selected", context, target)

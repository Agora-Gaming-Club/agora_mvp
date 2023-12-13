"""Simple SMS client using twilio"""
import os

from django.conf import settings
from django.template.loader import get_template

from twilio.rest import Client

from filestore.models import File


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
        file_name = f"sms/{self.sms_type}.txt"
        text = load_text(file_name)
        from_number = settings.TWILIO_DEFAULT_NUMBER
        text_content = text.render(self.context)

        if settings.SMS_ENABLED:
            try:
                message = self.client.messages.create(
                    to=self.target,
                    from_=from_number,
                    body=text_content,
                )
            except Exception as e:
                print("SMS Failed. Please check if number verified.", e)
                return False
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


def load_text(file_name):
    file = File.objects.filter(name=file_name)
    if file:
        text = file.first().contents
    else:
        text = get_template(file_name)
    return text

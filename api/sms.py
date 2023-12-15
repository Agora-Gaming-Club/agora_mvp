"""Simple SMS client using twilio"""
import os

from django.conf import settings

from twilio.rest import Client

from api.utils import load_text


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
        text_content = load_text(file_name, self.context)

        if settings.SMS_ENABLED:
            try:
                message = self.client.messages.create(
                    to=self.target,
                    from_=settings.TWILIO_DEFAULT_NUMBER,
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
            print(f"FROM: {settings.TWILIO_DEFAULT_NUMBER}")
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

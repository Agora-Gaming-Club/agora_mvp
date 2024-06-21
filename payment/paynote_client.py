import requests
import logging

logger = logging.getLogger('paynote_client')
logger.info("Forced Logging Check")

PAYNOTE_PUBLIC_KEY = "pk_test_01J0TXFJPMGF0WFHHSD2GVBB29"
PAYNOTE_SECRET_KEY = "sk_test_01J0TXFJPMGF0WFHHSD2GVBB28"

class PaynoteClient:
    def __init__(self):
        self.headers = {
            "Authorization": f"Bearer {PAYNOTE_SECRET_KEY}"  # Typically Bearer token
        }
        self.base_url = "https://api-paynote.seamlesschex.com/v1"
        logger.info("PaynoteClient initialized with API keys.")

    def send_payment(self, data_value, amount, user_id):
        """Sends a payment request to the Paynote API."""
        logger.info(f"Sending payment: Amount={amount}, UserID={user_id}, Description='{data_value}'")

        data = {
            "amount": str(amount),
            "customer": {
                "id": user_id,
            },
            "description": data_value if data_value else "",
        }

        url = f"{self.base_url}/payments"
        response = requests.post(url, headers=self.headers, json=data)
        logger.info(f"API response status: {response.status_code}")
        response_data = response.json()
        logger.info(f"Full API response: {response_data}")

        return self._process_response(response)

    def _process_response(self, response):
        if response.status_code == 200:
            response_data = response.json()
            logger.info(f"Payment successful: Transaction ID={response_data.get('id')}, Status={response_data.get('status')}")
            return {
                "transId": response_data.get("id"),
                "responseCode": response_data.get("status"),
            }
        else:
            error_text = response.text or "Unknown error"
            logger.error(f"Payment failed: HTTP {response.status_code}, Error={error_text}")
            if response.status_code == 400:
                error_data = response.json().get("errors")
                if error_data:
                    error_text = ", ".join([error["message"] for error in error_data])
            return {
                "errorCode": response.status_code,
                "errorText": error_text,
            }

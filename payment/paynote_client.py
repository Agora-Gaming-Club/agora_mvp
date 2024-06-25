import requests
import logging

logger = logging.getLogger('paynote_client')
logger.info("Forced Logging Check")

PAYNOTE_PUBLIC_KEY = "pk_test_01J0TXFJPMGF0WFHHSD2GVBB29"
PAYNOTE_SECRET_KEY = "sk_test_01J0TXFJPMGF0WFHHSD2GVBB28"
PAYNOTE_LIVE_ENDPOINT = "https://api-paynote.seamlesschex.com/"
PAYNOTE_SANDBOX_ENDPOINT = "https://sandbox-paynote.seamlesschex.com/"

class PaynoteClient:
    def __init__(self):
        self.api_url = 'https://sandbox-paynote.seamlesschex.com/v1/'  # Ensure this is the correct base URL
        self.api_key = 'sk_test_01J0TXFJPMGF0WFHHSD2GVBB28'  # Replace with your actual API key
        self.headers = {
            'Authorization': f'Bearer {self.api_key}',
            'Content-Type': 'application/json'
        }
        print("PaynoteClient initialized with API keys.")

    def create_customer(self, first_name, last_name, email, business_name, phone):
        url = f"{self.api_url}user"
        payload = {
            "firstName": first_name,
            "lastName": last_name,
            "email": email,
            "businessName": business_name,
            "phone": phone
        }
        response = requests.post(url, json=payload, headers=self.headers)
        return self._process_response(response)

    def create_funding_source(self, user_id, routing, number, account_type, bank):
        url = f"{self.api_url}on-demand/funding-source"
        payload = {
            "user_id": user_id,
            "routing": routing,
            "number": number,
            "type": account_type,
            "bank": bank
        }
        response = requests.post(url, json=payload, headers=self.headers)
        return self._process_response(response)

    def _process_response(self, response):
        try:
            response_json = response.json()
        except requests.exceptions.JSONDecodeError:
            response_json = {
                'responseCode': None,
                'errorText': response.text
            }

        if response.status_code not in [200, 201]:
            print(f"Payment failed: HTTP {response.status_code}, Error={response.text}")
            return response_json
        return response_json

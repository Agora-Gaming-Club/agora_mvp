import requests

PAYNOTE_PUBLIC_KEY = "pk_test_01J0TXFJPMGF0WFHHSD2GVBB29"  # Ensure these keys are correct
PAYNOTE_SECRET_KEY = "sk_test_01J0TXFJPMGF0WFHHSD2GVBB28"

class PaynoteClient:
    def __init__(self):
        self.headers = {
            "Authorization": f"Bearer {PAYNOTE_SECRET_KEY}"  # Typically Bearer token
        }
        self.base_url = "https://api-paynote.seamlesschex.com/v1"
        print("PaynoteClient initialized with API keys.")

    def send_payment(self, data_value, amount, user_id):
        """
        Sends a payment request to the Paynote API.

        Args:
            data_value (str): Opaque data for the payment (refer to Paynote API docs).
            amount (float): The payment amount.
            user_id (int): The user ID to associate with the payment.

        Returns:
            dict: A dictionary containing transaction details or error information.
        """
        print(f"Sending payment: Amount={amount}, UserID={user_id}, Description='{data_value}'")

        data = {
            "amount": str(amount),
            "customer": {
                "id": user_id,
                # Include other customer-related fields as required by the API
            },
            "description": data_value if data_value else "",  # Include description if provided
            # Add other relevant data fields as needed by Paynote API (refer to docs)
        }

        url = f"{self.base_url}/payments"
        response = requests.post(url, headers=self.headers, json=data)
        response_data = response.json()
        print("Full API response: ", response_data)

        return self._process_response(response)

    def _process_response(self, response):
        if response.status_code == 200:
            response_data = response.json()
            print(f"Payment successful: Transaction ID={response_data.get('id')}, Status={response_data.get('status')}")
            return {
                "transId": response_data.get("id"),
                "responseCode": response_data.get("status"),
            }
        else:
            error_text = response.text or "Unknown error"
            print(f"Payment failed: HTTP {response.status_code}, Error={error_text}")
            if response.status_code == 400:
                error_data = response.json().get("errors")
                if error_data:
                    error_text = ", ".join([error["message"] for error in error_data])
            return {
                "errorCode": response.status_code,
                "errorText": error_text,
            }

if __name__ == "__main__":
    client = PaynoteClient()
    result = client.send_payment("Payment Description", 123.45, user_id=1)
    print(result)
    print("Final result:", result)

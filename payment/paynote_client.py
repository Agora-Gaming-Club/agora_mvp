import requests

# Replace with your Paynote API keys
PAYNOTE_PUBLIC_KEY = "pk_01HW96B6NX3Q6TSXEJFX6JBAPR"
PAYNOTE_SECRET_KEY = "sk_01HW96B6NX3Q6TSXEJFX6JBAPQ"


class PaynoteClient:
    def __init__(self):
        self.headers = {
            "Authorization": f"Basic {PAYNOTE_SECRET_KEY}:{PAYNOTE_PUBLIC_KEY}"  # Note reversed order
        }
        self.base_url = "https://api.paynote.com/v1"
        # https://api-paynote.seamlesschex.com/v1
        print("PaynoteClient initialized with API keys.")

    def send_payment(self, data_value, amount, user_id):
        """
        Sends a payment request to the Paynote API, similar to an authorization
        transaction in Authorize.Net. Paynote doesn't support capturing funds
        during authorization, so this initiates a payment request.

        Args:
            data_value (str, optional): Opaque data for the payment (refer to Paynote API docs). Defaults to None.
            amount (float): The payment amount.
            user_id (int): The user ID to associate with the payment.

        Returns:
            dict: A dictionary containing transaction details or error information.
        """
        print(f"Sending payment: Amount={amount}, UserID={user_id}, Description='{data_value}'")

        # Prepare Paynote API request data
        data = {
            "amount": str(amount),
            "customer": user_id,
            "description": data_value if data_value else "",  # Include description if provided
            # Add other relevant data fields as needed by Paynote API (refer to docs)
        }

        # Send POST request to Paynote API endpoint for payments
        url = f"{self.base_url}/payments"
        response = requests.post(url, headers=self.headers, json=data)
        print(f"Payment request sent, awaiting response...")

        # Handle response
        return self._process_response(response)

    def _process_response(self, response):
        if response.status_code == 200:
            response_data = response.json()
            print(f"Payment successful: Transaction ID={response_data.get('id')}, Status={response_data.get('status')}")
            # Assuming "id" and "status" are present in successful response
            return {
                "transId": response_data.get("id"),
                "responseCode": response_data.get("status"),
            }
        else:
            error_text = response.text or "Unknown error"
            print(f"Payment failed: HTTP {response.status_code}, Error={error_text}")
            # Check for specific Paynote error codes (refer to docs for error codes)
            if response.status_code == 400:  # Example: Bad request
                error_data = response.json().get("errors")
                if error_data:
                    error_text = ", ".join([error["message"] for error in error_data])
            return {
                "errorCode": response.status_code,
                "errorText": error_text,
            }


if __name__ == "__main__":
    client = PaynoteClient()
    result = client.send_payment("Payment Description", 123.45, user_id=1)  # Assuming user_id is available
    print(result)
    print("Final result:", result)

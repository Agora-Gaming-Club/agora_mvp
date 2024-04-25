"""
Authorize client for accepting payments from users

https://developer.authorize.net/api/reference/index.html#payment-transactions
"""

from authorizenet import apicontractsv1
from authorizenet.apicontrollers import createTransactionController


from django.conf import settings

from api.utils import generate_unique_code


class AuthorizeClient:
    def __init__(self, token):
        self.token = token

    def send_payment(self, data_value, amount, wager, user):
        """Do a transaction type: Create an Accept Payment Transaction"""
        # Set up merchant authentication
        merchantAuth = apicontractsv1.merchantAuthenticationType()
        merchantAuth.name = settings.AUTHORIZE_LOGIN_ID
        merchantAuth.transactionKey = settings.AUTHORIZE_TRANSACTION_KEY

        # Create a payment object with the opaque data
        payment = apicontractsv1.paymentType()
        payment.opaqueData = apicontractsv1.opaqueDataType()
        payment.opaqueData.dataDescriptor = "COMMON.ACCEPT.INAPP.PAYMENT"
        payment.opaqueData.dataValue = data_value

        # Set up transaction request
        transactionrequest = apicontractsv1.transactionRequestType()
        transactionrequest.transactionType = "authCaptureTransaction"
        transactionrequest.amount = amount
        transactionrequest.payment = payment

        # Create the request
        createtransactionrequest = apicontractsv1.createTransactionRequest()
        createtransactionrequest.merchantAuthentication = merchantAuth
        createtransactionrequest.refId = generate_unique_code()
        createtransactionrequest.transactionRequest = transactionrequest

        # Make the API Call
        controller = createTransactionController(createtransactionrequest)
        controller.execute()

        # Get the response
        response = controller.getresponse()
        # TODO: convert this to JSON for simple life

        if response is not None:
            # Check to see if the API request was successfully received and acted upon
            if response.messages.resultCode == "Ok":
                # Since the API request was successful, look for a transaction response
                # and parse it to display the results of authorizing the card
                if hasattr(response.transactionResponse, "messages") is True:
                    result = {}
                    result["transId"] = response.transactionResponse.transId
                    result["responseCode"] = response.transactionResponse.responseCode
                    result["code"] = response.transactionResponse.messages.message[
                        0
                    ].code
                    result[
                        "description"
                    ] = response.transactionResponse.messages.message[0].description
                    print("Payment successful with transaction ID:", result["transId"])  # Logging success
                else:
                    print("Failed Transaction.")
                    if hasattr(response.transactionResponse, "errors") is True:
                        result = {}
                        result["errorCode"] = response.transactionResponse.errors.error[
                            0
                        ].errorCode
                        result["errorText"] = response.transactionResponse.errors.error[
                            0
                        ].errorText

            # Or, print errors if the API request wasn't successful
            else:
                print("Failed Transaction.")
                if (
                    hasattr(response, "transactionResponse") is True
                    and hasattr(response.transactionResponse, "errors") is True
                ):
                    result = {}
                    result["errorCode"] = response.transactionResponse.errors.error[
                        0
                    ].errorCode
                    result["errorText"] = response.transactionResponse.errors.error[
                        0
                    ].errorText

                else:
                    result = {}
                    result["errorCode"] = response.messages.message[0]["code"].text
                    result["errorText"] = response.messages.message[0]["text"].text
        else:
            result = {"errorCode": "?", "errorText": "Null Response."}

        return result


if __name__ == "__main__":
    x = AuthorizeClient("tokenabc1234")
    g = x.send_payment("root", "root2", 123.45)
    print(g)
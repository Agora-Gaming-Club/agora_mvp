"""
Charge a credit card
"""
import imp
import os
import sys
import uuid

from authorizenet import apicontractsv1
from authorizenet.constants import constants
from authorizenet.apicontrollers import createTransactionController

from django.conf import settings


class AuthorizeClient:
    def __init__(self, name, transaction_key, environment=constants.SANDBOX):
        self.merchantAuth = apicontractsv1.merchantAuthenticationType()
        self.merchantAuth.name = name
        self.merchantAuth.transactionKey = transaction_key
        self.environment = environment

    def send_payment(self, source, target, amount):
        """I havent looked at the API yet, so this is fake"""
        payment_url = f"http://some_site.com/payment/{source}/to/{target}/for/{amount}"
        response = FakeRequest.request("GET", payment_url)
        return response

    def charge_cc(
        self,
        card_number,
        exp_date,
        cvv2,
        amount,
        challenge,
        firstname,
        lastname,
        company,
        address,
        city,
        state,
        zipcode,
        country,
        email,
    ):
        # Create the payment data for a credit card
        creditCard = apicontractsv1.creditCardType()
        creditCard.cardNumber = card_number
        creditCard.expirationDate = exp_date  # "2035-12"
        creditCard.cardCode = cvv2

        # Add the payment data to a paymentType object
        payment = apicontractsv1.paymentType()
        payment.creditCard = creditCard

        # Create order information
        order = apicontractsv1.orderType()
        order.invoiceNumber = challenge.unique_code
        order.description = str(challenge)

        # Set the customer's Bill To address
        customerAddress = apicontractsv1.customerAddressType()
        customerAddress.firstName = firstname
        customerAddress.lastName = lastname
        customerAddress.company = company
        customerAddress.address = address
        customerAddress.city = city
        customerAddress.state = state  # 2 Char like AZ
        customerAddress.zip = zipcode
        customerAddress.country = country  # Country like "USA"

        # Set the customer's identifying information
        customerData = apicontractsv1.customerDataType()
        customerData.type = "individual"
        customerData.id = "99999456654"
        customerData.email = email

        # Add values for transaction settings # idk what this is
        duplicateWindowSetting = apicontractsv1.settingType()
        duplicateWindowSetting.settingName = "duplicateWindow"
        duplicateWindowSetting.settingValue = "600"
        settings = apicontractsv1.ArrayOfSetting()
        settings.setting.append(duplicateWindowSetting)

        line_item_1 = apicontractsv1.lineItemType()
        line_item_1.itemId = challenge.unique_code
        line_item_1.name = "challenge name"
        line_item_1.description = "challenge description"
        line_item_1.quantity = "1"
        line_item_1.unitPrice = amount

        # build the array of line items
        line_items = apicontractsv1.ArrayOfLineItem()
        line_items.lineItem.append(line_item_1)

        # Create a transactionRequestType object and add the previous objects to it.
        transactionrequest = apicontractsv1.transactionRequestType()
        transactionrequest.transactionType = "authCaptureTransaction"
        transactionrequest.amount = amount
        transactionrequest.payment = payment
        transactionrequest.order = order
        transactionrequest.billTo = customerAddress
        transactionrequest.customer = customerData
        transactionrequest.transactionSettings = settings
        transactionrequest.lineItems = line_items

        # Assemble the complete transaction request
        createtransactionrequest = apicontractsv1.createTransactionRequest()
        createtransactionrequest.merchantAuthentication = self.merchantAuth
        createtransactionrequest.refId = "MerchantID-0001"
        createtransactionrequest.transactionRequest = transactionrequest
        # Create the controller
        createtransactioncontroller = createTransactionController(
            createtransactionrequest
        )
        createtransactioncontroller.setenvironment(self.environment)
        createtransactioncontroller.execute()

        response = createtransactioncontroller.getresponse()
        if response is not None:
            # Check to see if the API request was successfully received and acted upon
            if response.messages.resultCode == "Ok":
                # Since the API request was successful, look for a transaction response
                # and parse it to display the results of authorizing the card
                if hasattr(response.transactionResponse, "messages") is True:
                    return {
                        "transaction_id": response.transactionResponse.transId,
                        "response_code": response.transactionResponse.responseCode,
                        "message_code": response.transactionResponse.messages.message[
                            0
                        ].code,
                        "description": response.transactionResponse.messages.message[
                            0
                        ].description,
                    }

                else:
                    print("Failed Transaction.")
                    if hasattr(response.transactionResponse, "errors") is True:
                        return {
                            "error_code": response.transactionResponse.errors.error[
                                0
                            ].errorCode,
                            "error_message": response.transactionResponse.errors.error[
                                0
                            ].errorText,
                        }
            # Or, print errors if the API request wasn't successful
            else:
                print("Failed Transaction.")
                if (
                    hasattr(response, "transactionResponse") is True
                    and hasattr(response.transactionResponse, "errors") is True
                ):
                    return {
                        "error_code": str(
                            response.transactionResponse.errors.error[0].errorCode
                        ),
                        "error_message": response.transactionResponse.errors.error[
                            0
                        ].errorText,
                    }
                else:
                    return {
                        "error_code": response.messages.message[0]["code"].text,
                        "error_message": response.messages.message[0]["text"].text,
                    }
        else:
            return {
                "error_code": "UNK",
                "error_message": "null response",
            }

        return response

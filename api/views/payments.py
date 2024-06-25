import json
from django.http import JsonResponse
from payment.paynote_client import PaynoteClient

def create_customer(request):
    data = json.loads(request.body)
    paynote_client = PaynoteClient()
    response = paynote_client.create_customer(
        first_name=data["firstName"],
        last_name=data["lastName"],
        email=data["email"],
        business_name=data["businessName"],
        phone=data["phone"]
    )
    return JsonResponse(response)

def create_funding_source(request):
    data = json.loads(request.body)
    paynote_client = PaynoteClient()
    response = paynote_client.create_funding_source(
        user_id=data["user_id"],
        routing=data["routing"],
        number=data["number"],
        account_type=data["type"],
        bank=data["bank"]
    )
    return JsonResponse(response)

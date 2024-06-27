import json
from django.http import JsonResponse
from payment.paynote_client import PaynoteClient
from api.models import Wager

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

def get_funding_sources(request, user_id):
    paynote_client = PaynoteClient()
    response = paynote_client.get_funding_sources(user_id)
    return JsonResponse(response)

def get_funding_details(request, source_id):
    paynote_client = PaynoteClient()
    response = paynote_client.get_funding_details(source_id)
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

def update_payment_status(request):
    if request.method == "POST":
        data = json.loads(request.body)
        print('PAYMENT DATA: ', data)
        challenge_id = data.get("challengeId")
        customer_agora_id = data.get("customerAgoraId")

        try:
            wager = Wager.objects.get(unique_code=challenge_id)
            if wager.challenger_id == customer_agora_id:
                wager.challenger_paid = True
            elif wager.respondent_id == customer_agora_id:
                wager.respondent_paid = True
            wager.save()
            return JsonResponse({"message": "Wager updated successfully"})
        except Wager.DoesNotExist:
            return JsonResponse({"error": "Wager not found"}, status=404)

        

def create_ach_debit(request):
    if request.method == "POST":
        data = json.loads(request.body)
        sender = data.get("sender")
        name = data.get("name")
        amount = data.get("amount")
        description = data.get("description")
        number = data.get("number", "")
        recurring = data.get("recurring", None)

        paynote_client = PaynoteClient()
        response = paynote_client.create_ach_debit(sender, name, amount, description, number, recurring)
        return JsonResponse(response)
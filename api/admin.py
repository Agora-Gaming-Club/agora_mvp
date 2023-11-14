from django.contrib import admin
from api.models import Payment, UserProfile, Wager

# Register your models here.


class PaymentAdmin(admin.ModelAdmin):
    list_display = [
        "user",
        "wager",
        "authorize_net_payment_id",
        "authorize_net_payment_status",
        "created_at",
        "updated_at",
    ]


class UserProfileAdmin(admin.ModelAdmin):
    list_display = [
        "user",
        "username",
        "first_name",
        "last_name",
        "email",
        "state",
        "birthday",
        "acct_verified",
        "created_at",
        "updated_at",
    ]


class WagerAdmin(admin.ModelAdmin):
    list_display = [
        "challenger_id",
        "respondent_id",
        "amount",
        "unique_code",
        "status",
        "created_at",
        "updated_at",
    ]


admin.site.register(Payment, PaymentAdmin)
admin.site.register(UserProfile, UserProfileAdmin)
admin.site.register(Wager, WagerAdmin)

"""
Admin page for the main app's model.
"""
from django.contrib import admin
from api.models import (
    Payment,
    UserProfile,
    Wager,
)


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
        "winnings",
        "phone_number",
        "acct_verified",
        "created_at",
        "updated_at",
    ]


class WagerAdmin(admin.ModelAdmin):
    list_display = [
        "unique_code",
        "challenger_id",
        "respondent_id",
        "amount",
        "status",
        "challenger_paid",
        "respondent_paid",
        "challenger_gamer_tag",
        "respondent_gamer_tag",
        "challenger_vote",
        "respondent_vote",
        "winner",
        "created_at",
        "updated_at",
    ]
    list_filter = ["status"]
    readonly_fields = ["winner_paid"]


admin.site.register(Payment, PaymentAdmin)
admin.site.register(UserProfile, UserProfileAdmin)
admin.site.register(Wager, WagerAdmin)

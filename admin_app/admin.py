from django.contrib import admin
from django.contrib.auth.models import User

from api.models import (
    Game,
    GameName,
    Platform,
    Term,
    Wager,
)
from admin_app.models import (
    WagerDisputeProxy,
    WagerPayoutProxy,
)

# Register your models here.


class GameAdmin(admin.ModelAdmin):
    list_display = [
        "game",
        "platform",
        "terms",
        "discord_link",
    ]


class GameAdmin(admin.ModelAdmin):
    list_display = [
        "game",
        "platform",
        "terms",
        "discord_link",
    ]


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
        "challenger_id",
        "respondent_id",
        "amount",
        "unique_code",
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


class WagerDisputeAdmin(admin.ModelAdmin):
    list_display = [
        "amount",
        "unique_code",
        "challenger",
        "challenger_voted",
        "respondent",
        "respondent_voted",
        "status",
    ]
    readonly_fields = [
        "challenger",
        "challenger_voted",
        "respondent",
        "respondent_voted",
    ]

    @admin.display(description="Challenger")
    def challenger(self, instance):
        return User.objects.get(id=instance.challenger_id)

    @admin.display(description="challenger vote")
    def challenger_voted(self, instance):
        return User.objects.get(id=instance.challenger_vote)

    @admin.display(description="respondent")
    def respondent(self, instance):
        return User.objects.get(id=instance.respondent_id)

    @admin.display(description="respondent vote")
    def respondent_voted(self, instance):
        return User.objects.get(id=instance.respondent_vote)

    class Meta:
        verbose_name = "Wager Dispute"
        verbose_plural_name = "Wager Disputes"

    def has_add_permission(self, request, obj=None):
        return False

    def get_queryset(self, request):
        qs = super().get_queryset(request)
        return qs.filter(status=Wager.DISPUTED)


class WagerPayoutAdmin(admin.ModelAdmin):
    list_display = [
        "amount",
        "unique_code",
        "status",
        "winner_paypal",
        "paypal_payment_id",
        "winner_paid",
        "winner",
    ]
    list_filter = ["winner_paid"]

    def has_add_permission(self, request, obj=None):
        return False

    def get_queryset(self, request):
        qs = super().get_queryset(request)
        return qs.filter(status=Wager.COMPLETED)


class GameNameAdmin(admin.ModelAdmin):
    list_display = ["name"]


class PlatformAdmin(admin.ModelAdmin):
    list_display = ["name"]


class TermAdmin(admin.ModelAdmin):
    list_display = ["terms"]


admin.site.register(Game, GameAdmin)
admin.site.register(WagerDisputeProxy, WagerDisputeAdmin)
admin.site.register(WagerPayoutProxy, WagerPayoutAdmin)
admin.site.register(GameName, GameNameAdmin)
admin.site.register(Platform, PlatformAdmin)
admin.site.register(Term, TermAdmin)

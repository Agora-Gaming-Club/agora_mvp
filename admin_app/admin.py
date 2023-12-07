from django.contrib import admin
from django.contrib.auth.models import User

from api.models import (
    Wager,
)
from admin_app.models import (
    WagerDisputeProxy,
    WagerPayoutProxy,
    GameProxy,
    GameNameProxy,
    PlatformProxy,
    TermProxy,
)

# Register your models here.


class GameProxyAdmin(admin.ModelAdmin):
    list_display = [
        "game",
        "platform",
        "terms",
        "discord_link",
    ]


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


class GameNameProxydmin(admin.ModelAdmin):
    list_display = ["name"]


class PlatformProxyAdmin(admin.ModelAdmin):
    list_display = ["name"]


class TermProxyAdmin(admin.ModelAdmin):
    list_display = ["terms"]


admin.site.register(GameProxy, GameProxyAdmin)
admin.site.register(WagerDisputeProxy, WagerDisputeAdmin)
admin.site.register(WagerPayoutProxy, WagerPayoutAdmin)
admin.site.register(GameNameProxy, GameNameProxydmin)
admin.site.register(PlatformProxy, PlatformProxyAdmin)
admin.site.register(TermProxy, TermProxyAdmin)

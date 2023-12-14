"""Admin page declaration for the admin_app"""
from django.contrib import admin
from django.contrib.auth.models import User

from api.models import Wager, UserProfile
from admin_app.models import (
    WagerDisputeProxy,
    WagerPayoutProxy,
    GameProxy,
    GameNameProxy,
    PlatformProxy,
    TermProxy,
)
from api.sms import PaidSMS


class GameProxyAdmin(admin.ModelAdmin):
    list_display = [
        "game",
        "platform",
        "terms",
        "discord_link",
    ]
    search_fields = [
        "game__name",
        "platform__name",
        "terms__terms",
        "discord_link",
    ]


class WagerDisputeAdmin(admin.ModelAdmin):
    list_display = [
        "unique_code",
        "amount",
        "challenger",
        "challenger_voted",
        "respondent",
        "respondent_voted",
        "winner",
        "status",
    ]
    readonly_fields = [
        "challenger",
        "challenger_voted",
        "respondent",
        "respondent_voted",
    ]
    raw_id_fields = ("winner",)
    readonly_fields = ["winner_paid"]
    search_fields = [
        "unique_code",
        "amount",
        "foreign_key__challenger",
    ]
    list_filter = [
        "game__game",
        "amount",
    ]

    def get_actions(self, request):
        actions = super().get_actions(request)
        if "delete_selected" in actions:
            del actions["delete_selected"]
        return actions

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


@admin.action(description="Mark Wagers as Paid")
def mark_paid(modeladmin, request, queryset):
    queryset = queryset.filter(winner_paid=False).exclude(paypal_payment_id=None)
    for challenge in queryset:
        winner = UserProfile.objects.get(user=challenge.winner)
        PaidSMS(
            context={"challenge", challenge},
            target=winner.phone_number,
        ).send()
        print(challenge)
    queryset.update(winner_paid=True)


class WagerPayoutAdmin(admin.ModelAdmin):
    list_display = [
        "unique_code",
        "amount",
        "status",
        "winner_paypal",
        "paypal_payment_id",
        "winner_paid",
        "winner",
        "winning_amt",
    ]
    list_filter = ["winner_paid"]
    readonly_fields = ["winner_paid"]
    actions = [mark_paid]
    search_fields = [
        "unique_code",
        "amount",
        "status",
        "winner_paypal",
        "paypal_payment_id",
        "winner_paid",
        "winner__username",
    ]

    def get_actions(self, request):
        actions = super().get_actions(request)
        if "delete_selected" in actions:
            del actions["delete_selected"]
        return actions

    def has_add_permission(self, request, obj=None):
        return False

    def get_queryset(self, request):
        qs = super().get_queryset(request)
        return qs.filter(status=Wager.COMPLETED)


class GameNameProxydmin(admin.ModelAdmin):
    list_display = ["name"]
    search_fields = list_display


class PlatformProxyAdmin(admin.ModelAdmin):
    list_display = ["name"]
    search_fields = list_display


class TermProxyAdmin(admin.ModelAdmin):
    list_display = ["terms"]
    search_fields = list_display


admin.site.register(GameProxy, GameProxyAdmin)
admin.site.register(WagerDisputeProxy, WagerDisputeAdmin)
admin.site.register(WagerPayoutProxy, WagerPayoutAdmin)
admin.site.register(GameNameProxy, GameNameProxydmin)
admin.site.register(PlatformProxy, PlatformProxyAdmin)
admin.site.register(TermProxy, TermProxyAdmin)

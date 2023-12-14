"""Proxy models for use in this app's admin page."""
from django.db.models.signals import post_save, post_init
from django.contrib.auth.models import User
from django.dispatch import receiver


from api.models import Wager, GameName, Platform, Term, Game
from api.emails import DisputeResolvedEmail


class GameProxy(Game):
    class Meta:
        proxy = True
        verbose_name = "Game"
        verbose_name_plural = "Games"


class GameNameProxy(GameName):
    class Meta:
        proxy = True
        verbose_name = "Game Name"
        verbose_name_plural = "Game Names"


class TermProxy(Term):
    class Meta:
        proxy = True
        verbose_name = "Term"
        verbose_name_plural = "Terms"


class PlatformProxy(Platform):
    class Meta:
        proxy = True
        verbose_name = "Platform"
        verbose_name_plural = "Platforms"


class WagerDisputeProxy(Wager):
    class Meta:
        proxy = True
        verbose_name = "Wager Dispute"
        verbose_name_plural = "Wager Disputes"


@receiver(post_init, sender=WagerDisputeProxy)
def remember_previous_status(sender, instance, **kwargs):
    instance.previous_status = instance.status


@receiver(post_save, sender=WagerDisputeProxy)
def send_email(sender, instance, created, **kwargs):
    previous_status = instance.previous_status
    if previous_status == Wager.DISPUTED and instance.status == Wager.COMPLETED:
        if instance.winner:
            context = {
                "challenge": instance,
                "user_1": User.objects.get(id=instance.challenger_id),
                "user_2": User.objects.get(id=instance.respondent_id),
                "winner": instance.winner,
            }
            email = DisputeResolvedEmail(
                context=context,
                target=instance.winner.email,
            )
            email.send()


class WagerPayoutProxy(Wager):
    class Meta:
        proxy = True
        verbose_name = "Payout"
        verbose_name_plural = "Payouts"

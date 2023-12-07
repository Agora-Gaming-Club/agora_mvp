from api.models import Wager, GameName, Platform, Term, Game


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


class WagerPayoutProxy(Wager):
    class Meta:
        proxy = True
        verbose_name = "Payout"
        verbose_name_plural = "Payouts"

from api.models import Wager


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

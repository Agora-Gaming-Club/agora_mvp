"""
Admin page for the main app's model.
"""
import csv

from django.contrib import admin
from django.http import HttpResponse

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
    list_filter = ["state"]
    search_fields = [
        "username",
        "first_name",
        "last_name",
        "email",
        "state",
        "phone_number",
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
    list_filter = ["status", "game__game", "amount"]
    readonly_fields = ["winner_paid"]


def export_selected_objects(modeladmin, request, queryset):
    # change this as a file download
    opts = queryset.model._meta
    model = queryset.model
    response = HttpResponse(content_type="text/csv")
    # force download.
    response["Content-Disposition"] = f"attachment;filename={model.__name__}.csv"
    # the csv writer
    writer = csv.writer(response)
    field_names = [field.name for field in opts.fields]
    # Write a first row with header information
    writer.writerow(field_names)
    # Write data rows
    for obj in queryset:
        writer.writerow([getattr(obj, field) for field in field_names])
    return response


admin.site.add_action(export_selected_objects)
admin.site.register(Payment, PaymentAdmin)
admin.site.register(UserProfile, UserProfileAdmin)
admin.site.register(Wager, WagerAdmin)

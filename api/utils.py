"""Util methods for api app."""
import random
import string
from django.core.paginator import Paginator, EmptyPage
from django.core.validators import validate_email

STATES = {
    "ALABAMA": "AL",
    "ALASKA": "AK",
    "AMERICAN SAMOA": "AS",
    "ARIZONA": "AZ",
    "ARKANSAS": "AR",
    "CALIFORNIA": "CA",
    "COLORADO": "CO",
    "CONNECTICUT": "CT",
    "DELAWARE": "DE",
    "DISTRICT OF COLUMBIA": "DC",
    "FLORIDA": "FL",
    "GEORGIA": "GA",
    "GUAM": "GU",
    "HAWAII": "HI",
    "IDAHO": "ID",
    "ILLINOIS": "IL",
    "INDIANA": "IN",
    "IOWA": "IA",
    "KANSAS": "KS",
    "KENTUCKY": "KY",
    "LOUISIANA": "LA",
    "MAINE": "ME",
    "MARYLAND": "MD",
    "MASSACHUSETTS": "MA",
    "MICHIGAN": "MI",
    "MINNESOTA": "MN",
    "MISSISSIPPI": "MS",
    "MISSOURI": "MO",
    "MONTANA": "MT",
    "NEBRASKA": "NE",
    "NEVADA": "NV",
    "NEW HAMPSHIRE": "NH",
    "NEW JERSEY": "NJ",
    "NEW MEXICO": "NM",
    "NEW YORK": "NY",
    "NORTH CAROLINA": "NC",
    "NORTH DAKOTA": "ND",
    "NORTHERN MARIANA IS": "MP",
    "OHIO": "OH",
    "OKLAHOMA": "OK",
    "OREGON": "OR",
    "PENNSYLVANIA": "PA",
    "PUERTO RICO": "PR",
    "RHODE ISLAND": "RI",
    "SOUTH CAROLINA": "SC",
    "SOUTH DAKOTA": "SD",
    "TENNESSEE": "TN",
    "TEXAS": "TX",
    "UTAH": "UT",
    "VERMONT": "VT",
    "VIRGINIA": "VA",
    "VIRGIN ISLANDS": "VI",
    "WASHINGTON": "WA",
    "WEST VIRGINIA": "WV",
    "WISCONSIN": "WI",
    "WYOMING": "WY",
}


def form_errors(form):
    {"accept": [{"message": "Cannot accept your own challenge", "code": ""}]}
    errors = {"errors": {}}
    for key, value in form.errors.get_json_data().items():
        message = value[0]["message"]
        errors["errors"] = message
    return errors


def good_email(email):
    """Validate email without an exception."""
    try:
        validate_email(email)
        return True
    except:
        return False


def paginate(queryset, page, amt):
    """Simple pagination for a queryset."""
    paginator = Paginator(queryset, amt)
    result = paginator.get_page(page)
    try:
        paginator.page(page)
        total = result.object_list
    except EmptyPage:
        total = []
    return {
        "result": total,
        "current_page": int(page),
        "total_pages": paginator.num_pages,
        "total_amount": paginator.count,
    }


def generate_unique_code():
    """
    Generate 12 character long code.

    Can be used as url slug
    """

    def random_char():
        return random.choice(string.ascii_letters)

    pieces = [random_char() for x in range(12)]
    code = "".join(pieces)
    return code

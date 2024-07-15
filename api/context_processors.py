# api/context_processors.py
import os

def paynote_keys(request):
    return {
        'PAYNOTE_PUBLIC_KEY_SANDBOX': os.getenv('PAYNOTE_PUBLIC_KEY_SANDBOX'),
        'PAYNOTE_PUBLIC_KEY_PROD': os.getenv('PAYNOTE_PUBLIC_KEY_PROD'),
    }

# api/context_processors.py
import os

def paynote_keys(request):
    return {
        'PAYNOTE_PUBLIC_KEY': os.getenv('PAYNOTE_PUBLIC_KEY'),
        'PAYNOTE_SECRET_KEY': os.getenv('PAYNOTE_SECRET_KEY'),
    }

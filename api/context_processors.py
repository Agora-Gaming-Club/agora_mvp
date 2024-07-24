# api/context_processors.py
import os

def paynote_keys(request):
    return {
        'PAYNOTE_PUBLIC_KEY': os.getenv('PAYNOTE_PUBLIC_KEY'),
        'REACT_APP_ENV': os.getenv('REACT_APP_ENV', 'development')
    }

from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
import json
import re

@csrf_exempt
@api_view(['POST'])
@permission_classes([AllowAny])
def bkash_sms_webhook(request):
    """
    Receives SMS from the Android Forwarder App.
    Parses TrxID and Amount to verify payments automatically.
    """
    try:
        # Some forwarders send JSON, some send Form data. We handle JSON here.
        data = json.loads(request.body)
        sms_content = data.get('message', '') or data.get('text', '')
        sender = data.get('from', '')

        # Basic Validation: Ensure it's from bKash (usually 'bKash' or '16247')
        # Adjust filter based on your actual SMS sender ID
        if 'bKash' not in sender and '16247' not in sender:
             print(f"Ignored SMS from {sender}")
             return JsonResponse({'status': 'ignored'}, status=200)

        # Regex to extract TrxID and Amount
        # Example Msg: "You have received Tk 500.00 from ... TrxID 9G76..."
        trx_match = re.search(r'TrxID\s+([A-Z0-9]+)', sms_content)
        amount_match = re.search(r'Tk\s+([0-9,]+\.[0-9]{2})', sms_content)

        if trx_match and amount_match:
            trx_id = trx_match.group(1)
            amount = amount_match.group(1)
            
            print(f"💰 PAYMENT VERIFIED: TrxID {trx_id} for Tk {amount}")
            
            # TODO: Find the pending order with this Amount (or TrxID if user submitted it) and mark as PAID
            # Payment.objects.filter(amount=amount, status='PENDING').update(status='PAID', trx_id=trx_id)
            
            return JsonResponse({'status': 'verified', 'trx_id': trx_id, 'amount': amount}, status=200)
        
        return JsonResponse({'status': 'parsed_no_match'}, status=200)

    except Exception as e:
        print(f"Webhook Error: {str(e)}")
        return JsonResponse({'status': 'error'}, status=400)

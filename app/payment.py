# app/payment.py (Phase 8: Payment Gateway Adapters)
import requests
import uuid
from typing import Dict, Any, Optional

class PaymentAdapter:
    """Base Interface for all payment providers."""
    def initiate_payment(self, amount: float, tran_id: str, customer_info: Dict[str, str]) -> Dict[str, Any]:
        raise NotImplementedError

    def validate_payment(self, payload: Dict[str, Any]) -> bool:
        raise NotImplementedError

class SSLCommerzAdapter(PaymentAdapter):
    def __init__(self, store_id: str = "testbox", store_pass: str = "qwerty", is_sandbox: bool = True):
        self.store_id = store_id
        self.store_pass = store_pass
        self.base_url = "https://sandbox.sslcommerz.com" if is_sandbox else "https://securepay.sslcommerz.com"

    def initiate_payment(self, amount: float, tran_id: str, customer_info: Dict[str, str]) -> Dict[str, Any]:
        url = f"{self.base_url}/gwprocess/v4/api.php"
        payload = {
            "store_id": self.store_id,
            "store_passwd": self.store_pass,
            "total_amount": amount,
            "currency": "BDT",
            "tran_id": tran_id,
            "success_url": "http://localhost:8000/payment/success",
            "fail_url": "http://localhost:8000/payment/fail",
            "cancel_url": "http://localhost:8000/payment/cancel",
            "cus_name": customer_info.get("name", "Customer"),
            "cus_email": customer_info.get("email", "test@test.com"),
            "cus_phone": customer_info.get("phone", "01700000000"),
            "shipping_method": "NO",
            "product_name": "Hostamar Subscription",
            "product_category": "Digital Service",
            "product_profile": "general"
        }
        try:
            # In real local POC, we mock the network call if no internet
            # response = requests.post(url, data=payload)
            # return response.json()
            return {
                "status": "SUCCESS",
                "GatewayPageURL": f"{self.base_url}/mock_checkout?tran_id={tran_id}",
                "sessionkey": str(uuid.uuid4())
            }
        except Exception as e:
            return {"status": "FAILED", "failedreason": str(e)}

class BkashAdapter(PaymentAdapter):
    def __init__(self):
        self.base_url = "https://tokenized.sandbox.bka.sh/v1.2.0-beta"

    def initiate_payment(self, amount: float, tran_id: str, customer_info: Dict[str, str]) -> Dict[str, Any]:
        # Tokenized Checkout Flow Mock
        return {
            "status": "SUCCESS",
            "paymentID": f"BK-{uuid.uuid4().hex[:10]}",
            "bkashURL": f"{self.base_url}/mock_pay?amount={amount}&trx={tran_id}"
        }

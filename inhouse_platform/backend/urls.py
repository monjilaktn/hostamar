from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import LeadViewSet, DeploymentViewSet, DGPAssetViewSet, PaymentViewSet
from .payment_views import bkash_sms_webhook

router = DefaultRouter()
router.register(r'leads', LeadViewSet)
router.register(r'deployments', DeploymentViewSet)
router.register(r'assets', DGPAssetViewSet)
router.register(r'payments', PaymentViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('bkash-webhook/', bkash_sms_webhook, name='bkash-webhook'),
]
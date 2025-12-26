from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import LeadViewSet, DeploymentViewSet

router = DefaultRouter()
router.register(r'leads', LeadViewSet)
router.register(r'deployments', DeploymentViewSet)

urlpatterns = [
    path('', include(router.urls)),
]

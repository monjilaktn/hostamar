from rest_framework import viewsets, permissions
from .models import Lead, Deployment, DGPAsset, Payment
from .serializers import LeadSerializer, DeploymentSerializer, DGPAssetSerializer, PaymentSerializer

class LeadViewSet(viewsets.ModelViewSet):
    queryset = Lead.objects.all()
    serializer_class = LeadSerializer

    def get_permissions(self):
        if self.action == 'create':
            return [permissions.AllowAny()]
        return [permissions.IsAuthenticated()]

class DeploymentViewSet(viewsets.ModelViewSet):
    queryset = Deployment.objects.all().order_by('-deployed_at')
    serializer_class = DeploymentSerializer
    permission_classes = [permissions.IsAuthenticated]

class DGPAssetViewSet(viewsets.ModelViewSet):
    """
    API endpoint for the 100 DGP Assets.
    """
    queryset = DGPAsset.objects.all().order_by('symbol')
    serializer_class = DGPAssetSerializer
    # In production, make this ReadOnly for public, Write for Admin
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

class PaymentViewSet(viewsets.ModelViewSet):
    queryset = Payment.objects.all().order_by('-created_at')
    serializer_class = PaymentSerializer
    permission_classes = [permissions.IsAuthenticated]
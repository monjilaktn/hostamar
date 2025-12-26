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

from rest_framework.decorators import action
from rest_framework.response import Response

class DeploymentViewSet(viewsets.ModelViewSet):
    queryset = Deployment.objects.all().order_by('-deployed_at')
    serializer_class = DeploymentSerializer
    permission_classes = [permissions.IsAuthenticated]

    @action(detail=False, methods=['get'])
    def summary(self, request):
        total_leads = Lead.objects.count()
        # Mock data for now, can be connected to real metrics later
        return Response({
            'revenue': 1240.00,
            'leads': total_leads,
            'servers': 42,
            'ai_thought': 'Local DeepSeek-R1 is monitoring your infrastructure.'
        })

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
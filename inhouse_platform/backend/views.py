from rest_framework import viewsets, permissions
from .models import Lead, Deployment
from .serializers import LeadSerializer, DeploymentSerializer

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

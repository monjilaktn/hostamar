from rest_framework import viewsets, permissions
from .models import Lead
from .serializers import LeadSerializer

class LeadViewSet(viewsets.ModelViewSet):
    queryset = Lead.objects.all()
    serializer_class = LeadSerializer

    def get_permissions(self):
        """
        Allow anyone to create a lead (POST).
        Require authentication for everything else (GET, PUT, DELETE).
        """
        if self.action == 'create':
            return [permissions.AllowAny()]
        return [permissions.IsAuthenticated()]
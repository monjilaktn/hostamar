from rest_framework import serializers
from .models import Lead, Deployment, DGPAsset, Payment

class LeadSerializer(serializers.ModelSerializer):
    class Meta:
        model = Lead
        fields = '__all__'

class DeploymentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Deployment
        fields = '__all__'

class DGPAssetSerializer(serializers.ModelSerializer):
    class Meta:
        model = DGPAsset
        fields = '__all__'

class PaymentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Payment
        fields = '__all__'

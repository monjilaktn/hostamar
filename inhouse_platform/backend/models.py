from django.db import models
from django.db.models.signals import post_save
from django.dispatch import receiver

class Lead(models.Model):
    # ... (existing lead model code)
    company_name = models.CharField(max_length=255)
    contact_person = models.CharField(max_length=255)
    email = models.EmailField(unique=True)
    phone = models.CharField(max_length=20, blank=True)
    status = models.CharField(max_length=20, default='NEW')
    created_at = models.DateTimeField(auto_now_add=True)

class DGPAsset(models.Model):
    symbol = models.CharField(max_length=20, unique=True)
    name = models.CharField(max_length=100)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    status = models.CharField(max_length=20, default='active')
    performance_score = models.IntegerField(default=98)
    last_updated = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.symbol} - {self.name}"

class Payment(models.Model):
    user_email = models.EmailField()
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    trx_id = models.CharField(max_length=100, unique=True)
    status = models.CharField(max_length=20, default='PENDING')
    created_at = models.DateTimeField(auto_now_add=True)
from django.db import models

class Lead(models.Model):
    STATUS_CHOICES = [
        ('NEW', 'New'),
        ('CONTACTED', 'Contacted'),
        ('PROPOSAL', 'Proposal Sent'),
        ('WON', 'Won'),
        ('LOST', 'Lost'),
    ]

    company_name = models.CharField(max_length=255)
    contact_person = models.CharField(max_length=255)
    email = models.EmailField(unique=True)
    phone = models.CharField(max_length=20, blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='NEW')
    notes = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.company_name

class Deployment(models.Model):
    STATUS_CHOICES = [
        ('PENDING', 'Pending'),
        ('BUILDING', 'Building'),
        ('SUCCESS', 'Success'),
        ('FAILED', 'Failed'),
    ]

    repo_name = models.CharField(max_length=255)
    commit_hash = models.CharField(max_length=40)
    commit_message = models.CharField(max_length=255)
    ai_audit_result = models.TextField(blank=True, default="Pending AI Analysis")
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='PENDING')
    logs = models.TextField(blank=True)
    deployed_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.repo_name} - {self.status}"
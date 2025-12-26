from django.db import models
from django.db.models.signals import post_save
from django.dispatch import receiver
# Note: We import inside the signal to avoid circular imports if needed, 
# or use a clean import here.
# from .notifications import send_push_notification

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

@receiver(post_save, sender=Lead)
def lead_created_notification(sender, instance, created, **kwargs):
    if created:
        try:
            # Lazy import to avoid AppRegistryNotReady issues
            from .notifications import send_push_notification
            send_push_notification(
                title="New Business Lead!",
                body=f"{instance.company_name} just signed up. Contact: {instance.contact_person}"
            )
        except ImportError:
            print("Notification module not found or failed to load.")
        except Exception as e:
            print(f"Failed to trigger notification: {e}")

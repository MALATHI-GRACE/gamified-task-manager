from django.db import models
from django.contrib.auth.models import User 



CATEGORY_CHOICES = [
    ('Technical', 'Technical'),
    ('Communication', 'Communication'),
    ('Others', 'Others'),
]

DURATION_CHOICES = [
    ('15days', '15 Days'),
    ('1 Month', '1 Month'),
    ('2 Month', '2 Months'),
    ('3 Month', '3 Months'),
    ('6 Month', '6 Months'),
]

class Task(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True)
    title = models.CharField(max_length=200)
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES)
    duration = models.CharField(max_length=20, choices=DURATION_CHOICES, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title

class Subtask(models.Model):
    task = models.ForeignKey(Task, related_name='subtasks', on_delete=models.CASCADE)
    title = models.CharField(max_length=200)
    is_completed = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.title} ({'Done' if self.is_completed else 'Pending'})"

"""
URL configuration for task_manager project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""

from django.contrib import admin
from django.urls import path, include
from myapp import views
from rest_framework.routers import DefaultRouter
from myapp.views import TaskViewSet

# DRF Router for ViewSet-based APIs
router = DefaultRouter()
router.register(r'tasks', TaskViewSet, basename='task')

urlpatterns = [
    # Admin Panel
    path('admin/', admin.site.urls),

    # Core Views
    path('', views.home, name='home'),
    path('skill/', views.skill_career, name='skill'),
    path('personal/', views.personal, name='personal'),
    path('dashboard/', views.dashboard, name='dashboard'),

    # Authentication
    path('login/', views.login_view, name='login'),
    path('register/', views.register_view, name='register'),
    path('logout/', views.logout_view, name='logout'),

    # Task Operations (Frontend)
    path('add-task/', views.add_task, name='add_task'),

    # Custom API Endpoints (Non-ViewSet)
    path('api/user-tasks/', views.get_user_tasks, name='get_user_tasks'),
    path('api/update-subtask/<int:subtask_id>/', views.update_subtask, name='update_subtask'),
    path('api/get-task/<int:task_id>/', views.get_task_data, name='get_task_data'),

    # DRF Router APIs
    path('api/', include(router.urls)),
]






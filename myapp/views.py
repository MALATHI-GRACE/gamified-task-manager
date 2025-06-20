from django.shortcuts import render, redirect
from django.http import JsonResponse
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.contrib import messages
from django.contrib.auth.models import User
from django import forms
from .models import Task, Subtask
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import viewsets
from .serializers import TaskSerializer
from django.views.decorators.csrf import csrf_exempt
import json


class TaskForm(forms.ModelForm):
    class Meta:
        model = Task
        fields = ['title', 'category', 'duration']


def home(request):
    return render(request, 'myapp/home.html')


@login_required(login_url='login')
def skill_career(request):
    user = request.user

    user_tasks = Task.objects.filter(user=user, category__in=['Technical', 'Communication', 'Others'])

    total_subtasks = 0
    completed_subtasks = 0
    total_points = 0

    for task in user_tasks:
        task_subtasks = task.subtasks.all()
        total_subtasks += task_subtasks.count()
        completed_count = task_subtasks.filter(is_completed=True).count()
        completed_subtasks += completed_count

        total_points += completed_count * 20

        if task_subtasks.exists() and completed_count == task_subtasks.count():
            total_points += 100

    if total_points >= 500:
        badge = "Gold"
    elif total_points >= 300:
        badge = "Silver"
    elif total_points >= 100:
        badge = "Bronze"
    else:
        badge = "None"

    progress_percent = int((completed_subtasks / total_subtasks) * 100) if total_subtasks > 0 else 0

    context = {
        'tasks': user_tasks,
        'careerPoints': total_points,
        'careerBadge': badge,
        'careerTasksCompleted': completed_subtasks,
        'careerProgress': progress_percent
    }

    return render(request, 'myapp/skill_career.html', context)


@login_required(login_url='login')
def add_task(request):
    print("🔁 ENTERED add_task VIEW") 
    if request.method == 'POST':
        print("✅ POST request received")  
        print("USER INSIDE VIEW:", request.user) 
        form = TaskForm(request.POST)

        if form.is_valid():
            task = form.save(commit=False)
            print("Logged in user:", request.user)
            print("User is authenticated:", request.user.is_authenticated)

            task.user = request.user
            task.save()

            subtasks = request.POST.getlist('subtasks[]')
            if subtasks:
                for sub in subtasks:
                    if sub.strip():
                        Subtask.objects.create(task=task, title=sub.strip())

            messages.success(request, 'Task added successfully!')
            return redirect('skill')
        else:
            messages.error(request, 'There was an issue with your task form submission.')
    else:
        form = TaskForm()

    user_tasks = Task.objects.filter(user=request.user, category__in=['Technical', 'Communication', 'Others'])

    return render(request, 'myapp/skill_career.html', {
        'form': form,
        'tasks': user_tasks
    })


@login_required(login_url='login')
def personal(request):
    return render(request, 'myapp/personal.html')


@login_required(login_url='login')
def dashboard(request):
    user = request.user

    tasks = Task.objects.filter(user=user)
    total_categories = tasks.count()

    subtasks = Subtask.objects.filter(task__in=tasks)
    total_subtasks = subtasks.count()
    completed_subtasks = subtasks.filter(is_completed=True).count()

    points = completed_subtasks * 20
    for task in tasks:
        task_subtasks = task.subtasks.all()
        if task_subtasks.exists() and all(s.is_completed for s in task_subtasks):
            points += 100

    if points >= 500:
        badge = "Gold"
    elif points >= 300:
        badge = "Silver"
    elif points >= 100:
        badge = "Bronze"
    else:
        badge = "None"

    progress_percent = int((completed_subtasks / total_subtasks) * 100) if total_subtasks > 0 else 0

    context = {
        'careerPoints': points,
        'careerBadge': badge,
        'categoryCount': total_categories,
        'careerTasksCompleted': completed_subtasks,
        'careerProgress': progress_percent
    }

    return render(request, 'myapp/dashboard.html', context)


def login_view(request):
    if request.method == 'POST':
        username = request.POST.get('username')
        password = request.POST.get('password')
        user = authenticate(request, username=username, password=password)

        if user is not None:
            login(request, user)
            return redirect('dashboard')
        else:
            messages.error(request, 'Invalid username or password')

    return render(request, 'myapp/login.html')


def register_view(request):
    if request.method == 'POST':
        username = request.POST.get('username')
        email = request.POST.get('email')
        password1 = request.POST.get('password1')
        password2 = request.POST.get('password2')

        if User.objects.filter(username=username).exists() or User.objects.filter(email=email).exists():
            messages.error(request, "You have already registered with these details.")
            return redirect('register')

        if password1 != password2:
            messages.error(request, "Passwords do not match!")
            return redirect('register')

        try:
            user = User.objects.create_user(username=username, email=email, password=password1)
            user.save()
            messages.success(request, "Registration successful! You can now log in.")
            return redirect('login')
        except Exception as e:
            messages.error(request, f"An error occurred: {e}")
            return redirect('register')

    return render(request, 'myapp/register.html')


@login_required(login_url='login')
def logout_view(request):
    logout(request)
    messages.success(request, "You have been logged out.")
    return redirect('home')


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_user_tasks(request):
    tasks = Task.objects.filter(user=request.user)
    serializer = TaskSerializer(tasks, many=True)
    return Response(serializer.data)


@csrf_exempt
@login_required(login_url='login')
def update_subtask(request, subtask_id):
    if request.method == 'POST':
        data = json.loads(request.body)
        is_completed = data.get("is_completed", False)

        try:
            subtask = Subtask.objects.get(id=subtask_id, task__user=request.user)
            subtask.is_completed = is_completed
            subtask.save()
            return JsonResponse({"success": True})
        except Subtask.DoesNotExist:
            return JsonResponse({"success": False, "error": "Subtask not found or access denied"})

    return JsonResponse({"success": False, "error": "Invalid request"})


@login_required(login_url='login')
def get_task_data(request, task_id):
    try:
        task = Task.objects.get(id=task_id, user=request.user)
        data = {
            "id": task.id,
            "title": task.title,
            "category": task.category,
            "duration": task.duration,
            "subtasks": [{"id": st.id, "title": st.title, "is_completed": st.is_completed} for st in task.subtasks.all()]
        }
        return JsonResponse(data)
    except Task.DoesNotExist:
        return JsonResponse({"error": "Task not found"}, status=404)

class TaskViewSet(viewsets.ModelViewSet):
    serializer_class = TaskSerializer

    def get_queryset(self):
        user = self.request.user
        return Task.objects.filter(user=user)
    
    def perform_create(self, serializer):
        print("Saving task for user:", self.request.user)
        serializer.save(user=self.request.user)

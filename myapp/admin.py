from django.contrib import admin
from .models import Task, Subtask

class SubtaskInline(admin.TabularInline):
    model = Subtask
    extra = 1

@admin.register(Task)
class TaskAdmin(admin.ModelAdmin):
    list_display = ('user', 'title', 'category','duration', 'created_at', 'updated_at')
    list_filter = ('user', 'category', 'duration')  
    search_fields = ('title', 'user__username')  
    inlines = [SubtaskInline]

@admin.register(Subtask)
class SubtaskAdmin(admin.ModelAdmin):
    list_display = ('id', 'task', 'get_category', 'title', 'is_completed')
    list_filter = ('is_completed', 'task__category')
    search_fields = ('title', 'task__title', 'task__category')

    def get_category(self, obj):
        return obj.task.category
    get_category.short_description = 'Category'

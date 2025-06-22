from rest_framework import serializers
from .models import Task, Subtask

class SubtaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = Subtask
        fields = ['id', 'title', 'is_completed']

class TaskSerializer(serializers.ModelSerializer):
    subtasks = SubtaskSerializer(many=True)
    
    class Meta:
        model = Task
        fields = ['id', 'title', 'category', 'duration', 'notes', 'subtasks']

    
    def create(self, validated_data):
        subtasks_data = validated_data.pop('subtasks')
        task = Task.objects.create(**validated_data)
        for subtask_data in subtasks_data:
            Subtask.objects.create(task=task, **subtask_data)
        return task


    def update(self, instance, validated_data):
        subtasks_data = validated_data.pop('subtasks', [])
        
        instance.title = validated_data.get('title', instance.title)
        instance.category = validated_data.get('category', instance.category)
        instance.duration = validated_data.get('duration', instance.duration)
        instance.notes = validated_data.get('notes', instance.notes)
        instance.save()

        # Clear and recreate subtasks
        instance.subtasks.all().delete()
        for subtask_data in subtasks_data:
            Subtask.objects.create(
                task=instance, 
                title=subtask_data.get('title'),
                is_completed=subtask_data.get('is_completed', False)
            )
        return instance

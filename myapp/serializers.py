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
        fields = ['id', 'title', 'category', 'duration', 'subtasks']

    
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
        instance.save()

        # Clear and recreate subtasks
        instance.subtasks.all().delete()
        for subtask_data in subtasks_data:
            Subtask.objects.create(task=instance, **subtask_data)

        return instance

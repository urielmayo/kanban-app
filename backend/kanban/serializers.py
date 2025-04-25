from rest_framework import serializers
from .models import (
    User,
    Project,
    Status,
    TaskTemplate,
    Task,
    TaskComment,
    TaskTimeLog,
    TaskLog,
    ProjectStatus,
)


class UserSerializer(serializers.ModelSerializer):
    confirm_password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = [
            "id",
            "email",
            "first_name",
            "last_name",
            "password",
            "confirm_password",
        ]
        extra_kwargs = {'password': {'write_only': True}}

    def validate(self, attrs):
        """Check that the passwords match and call base validation."""
        # Call the base class validation
        confirm_password = attrs.pop('confirm_password', None)
        if attrs.get('password') != confirm_password:
            raise serializers.ValidationError("Password don't match")

        return super().validate(attrs)

    def create(self, validated_data):
        password = validated_data.pop('password', None)
        validated_data.pop('confirm_password', None)
        validated_data['is_active'] = True

        user = self.Meta.model.objects.create_user(**validated_data)
        if password:
            user.set_password(password)
            user.save()
        return user


class StatusSerializer(serializers.ModelSerializer):
    class Meta:
        model = Status
        fields = "__all__"


class TaskTemplateSerializer(serializers.ModelSerializer):
    class Meta:
        model = TaskTemplate
        fields = "__all__"


class TaskListSerializer(serializers.ModelSerializer):
    class Meta:
        model = Task
        fields = ["id", "title", "assigned_to", "status", "deadline"]


class ProjectStatusSerializer(serializers.ModelSerializer):
    status = StatusSerializer(read_only=True)

    class Meta:
        model = ProjectStatus
        fields = ["status", "order"]

    def to_internal_value(self, data):
        if not isinstance(data, dict):
            raise serializers.ValidationError(
                "Expected a dictionary with 'status' and 'order' keys."
            )

        status_data = data.get("status")
        if not status_data:
            raise serializers.ValidationError(
                {"status": "This field is required."}
            )

        order = data.get("order")
        if order is None:
            raise serializers.ValidationError(
                {"order": "This field is required."}
            )

        try:
            status_instance = Status.objects.get(id=status_data)
        except Status.DoesNotExist:
            raise serializers.ValidationError({"status": "Invalid status ID."})

        return {
            "status": status_instance,
            "order": order,
        }


class ProjectSerializer(serializers.ModelSerializer):
    members = UserSerializer(many=True, read_only=True)
    tasks = TaskListSerializer(many=True, read_only=True)
    statuses = ProjectStatusSerializer(many=True)

    class Meta:
        model = Project
        fields = [
            "id",
            "name",
            "description",
            "members",
            "tasks",
            "statuses",
        ]

    def validate_statuses(self, value):
        if not value:
            raise serializers.ValidationError(
                "There should be at least one status"
            )
        seen_statuses = set()
        seen_orders = set()
        errors = []

        for item in value:
            status = item["status"]
            order = item["order"]

            if status in seen_statuses:
                errors.append(f"Repeated status: {status}")
            seen_statuses.add(status)

            if order in seen_orders:
                errors.append(f"Repeated order: {order}")
            seen_orders.add(order)

        if errors:
            raise serializers.ValidationError(errors)
        return value

    def create(self, validated_data):
        statuses = validated_data.pop("statuses", [])
        project = Project.objects.create(**validated_data)

        for status in statuses:
            ProjectStatus.objects.create(
                project=project,
                status=status["status"],
                order=status["order"],
            )
        return project

    def update(self, instance, validated_data):
        statuses = validated_data.pop('statuses', None)

        if statuses is not None:
            current_status_ids = set(
                instance.statuses.values_list('status_id', flat=True)
            )
            new_status_ids = {item["status"].id for item in statuses}
            statuses_to_delete = current_status_ids - new_status_ids

            linked_tasks = Task.objects.filter(
                status_id__in=statuses_to_delete,
                project=instance,
            )
            if linked_tasks.exists():
                raise serializers.ValidationError(
                    {"statuses": ["Cannot delete a status with active tasks"]}
                )

            instance.statuses.all().delete()
            for item in statuses:
                ProjectStatus.objects.create(
                    project=instance,
                    status=item["status"],
                    order=item["order"],
                )

        # Actualizar los demás campos del proyecto
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        return instance


class TaskCommentSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)

    class Meta:
        model = TaskComment
        exclude = ["task"]


class TaskTimeLogSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)

    class Meta:
        model = TaskTimeLog
        exclude = ["task"]


class TaskLogSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)

    class Meta:
        model = TaskLog
        fields = "__all__"


class TaskSerializer(serializers.ModelSerializer):
    template = TaskTemplateSerializer(read_only=True)
    project = serializers.StringRelatedField()
    timelogs = TaskTimeLogSerializer(many=True, read_only=True)

    class Meta:
        model = Task
        fields = [
            "id",
            "project",
            "title",
            "description",
            "assigned_to",
            "status",
            "deadline",
            "created_at",
            "timelogs",
            "template",
        ]
        read_only_fields = ["project"]

    def to_representation(self, instance):
        res = super().to_representation(instance)
        res['assigned_to'] = (
            instance.assigned_to
            and UserSerializer(instance=instance.assigned_to).data
            or None
        )
        return res

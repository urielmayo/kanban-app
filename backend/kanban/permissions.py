from rest_framework.permissions import BasePermission


class IsMemberPermission(BasePermission):

    def has_object_permission(self, request, view, obj) -> bool:
        return request.user in obj.members.all()

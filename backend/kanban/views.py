from rest_framework import viewsets, permissions, status, generics
from rest_framework.decorators import action
from django.contrib.auth import authenticate
from rest_framework.response import Response
from django.middleware.csrf import get_token
from django.shortcuts import get_object_or_404
from .models import (
    Project,
    Task,
    Status,
    TaskComment,
    TaskTimeLog,
    User,
    TaskTemplate,
)
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from .serializers import (
    ProjectSerializer,
    TaskSerializer,
    StatusSerializer,
    TaskCommentSerializer,
    TaskTimeLogSerializer,
    UserSerializer,
    TaskTemplateSerializer,
)
from django.conf import settings

import logging

# Create your views here.
_logger = logging.getLogger('django')


class ProjectViewSet(viewsets.ModelViewSet):
    queryset = Project.objects.all()
    serializer_class = ProjectSerializer

    def get_queryset(self):
        return self.queryset.filter(members=self.request.user)

    def perform_create(self, serializer):
        project = serializer.save()
        project.members.add(self.request.user)

    @action(detail=True, methods=['get'])
    def members(self, request, pk=None):
        project = self.get_object()
        members = project.members.all()
        serializer = UserSerializer(members, many=True)
        return Response(serializer.data)


class StatusViewSet(viewsets.ModelViewSet):
    serializer_class = StatusSerializer

    def get_queryset(self):
        project_id = self.kwargs.get('project_pk')
        return Status.objects.filter(project_id=project_id)

    def perform_create(self, serializer):
        project = get_object_or_404(Project, pk=self.kwargs.get('project_pk'))
        serializer.save(project=project)


class TaskTemplateViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = TaskTemplate.objects.all()
    serializer_class = TaskTemplateSerializer


class TaskViewSet(viewsets.ModelViewSet):
    serializer_class = TaskSerializer

    def get_queryset(self):
        project_id = self.kwargs.get('project_pk')
        return Task.objects.filter(
            project_id=project_id,
            project_id__members=self.request.user,
        )

    def perform_create(self, serializer):
        project = get_object_or_404(Project, pk=self.kwargs.get('project_pk'))
        serializer.save(project=project)

    @action(detail=True, methods=['post'])
    def move(self, request, project_pk=None, pk=None):
        task = self.get_object()
        new_status_id = request.data.get('status')
        new_status = get_object_or_404(Status, id=new_status_id)
        task.status = new_status
        task.save()
        return Response(self.get_serializer(task).data)

    @action(detail=True, methods=["POST"])
    def add_time(self, request, project_pk=None, pk=None):
        task = self.get_object()
        serializer = TaskTimeLogSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save(task=task, user=request.user)
        return Response(serializer.data, status=status.HTTP_201_CREATED)


class TaskCommentViewSet(viewsets.ModelViewSet):
    queryset = TaskComment.objects.all()
    serializer_class = TaskCommentSerializer

    def get_queryset(self):
        task_id = self.kwargs.get('task_pk')
        return self.queryset.filter(task_id=task_id)

    def perform_create(self, serializer):
        task = get_object_or_404(Task, pk=self.kwargs.get('task_pk'))
        serializer.save(task=task, user=self.request.user)


class TaskTimeLogViewSet(viewsets.ModelViewSet):
    queryset = TaskTimeLog.objects.all()
    serializer_class = TaskTimeLogSerializer

    def get_queryset(self):
        task_id = self.kwargs.get('task_pk')
        return self.queryset.filter(task_id=task_id)

    def perform_create(self, serializer):
        task = get_object_or_404(Task, pk=self.kwargs.get('task_pk'))
        serializer.save(task=task, user=self.request.user)


class LoginView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        email = request.data.get("email")
        password = request.data.get("password")

        user = User.objects.filter(email=email).first()
        if not user:
            return Response(
                {"email": ["Email does not exist"]},
                status=status.HTTP_404_NOT_FOUND,
            )

        user = authenticate(request, email=email, password=password)
        if user:
            refresh = RefreshToken.for_user(user)
            response = Response(
                {"message": "Successfull login"},
                status=status.HTTP_200_OK,
            )
            response.set_cookie(
                key=settings.SIMPLE_JWT.get(
                    'AUTH_COOKIE_REFRESH', 'refresh_token'
                ),
                value=str(refresh),
                httponly=settings.SIMPLE_JWT.get('AUTH_COOKIE_HTTP_ONLY', True),
                secure=settings.SIMPLE_JWT.get('AUTH_COOKIE_SECURE', True),
                samesite=settings.SIMPLE_JWT.get('AUTH_COOKIE_SAMESITE', 'Lax'),
                path=settings.SIMPLE_JWT.get('AUTH_COOKIE_PATH', '/'),
                max_age=settings.SIMPLE_JWT.get(
                    'REFRESH_TOKEN_LIFETIME'
                ).total_seconds(),
            )
            response.set_cookie(
                key=settings.SIMPLE_JWT.get('AUTH_COOKIE', 'access_token'),
                value=str(refresh.access_token),
                httponly=settings.SIMPLE_JWT.get('AUTH_COOKIE_HTTP_ONLY', True),
                secure=settings.SIMPLE_JWT.get('AUTH_COOKIE_SECURE', True),
                samesite=settings.SIMPLE_JWT.get('AUTH_COOKIE_SAMESITE', 'Lax'),
                path=settings.SIMPLE_JWT.get('AUTH_COOKIE_PATH', '/'),
                max_age=settings.SIMPLE_JWT.get(
                    'ACCESS_TOKEN_LIFETIME'
                ).total_seconds(),
            )
            response.set_cookie(
                key="csrftoken",
                value=get_token(request),
                httponly=False,
                secure=settings.SIMPLE_JWT.get('AUTH_COOKIE_SECURE', True),
                samesite=settings.SIMPLE_JWT.get('AUTH_COOKIE_SAMESITE', 'Lax'),
                max_age=3600,  # 1 hour
            )
            _logger.info(response.cookies)
            return response
        else:
            return Response(
                {"password": ["Incorrect password"]},
                status=status.HTTP_400_BAD_REQUEST,
            )


class LogoutView(APIView):
    def post(self, request):
        response = Response({"message": "Logout exitoso"})
        response.delete_cookie("refresh_token")
        response.delete_cookie("access_token")
        response.delete_cookie("csrftoken")
        return response


class RefreshTokenView(APIView):
    def post(self, request):
        refresh_token = request.COOKIES.get("refresh_token")

        if not refresh_token:
            return Response({"error": "No hay token de refresco"}, status=400)

        try:
            refresh = RefreshToken(refresh_token)
            access_token = str(refresh.access_token)

            response = Response({"message": "Token refrescado"})
            response.set_cookie(
                key=settings.SIMPLE_JWT.get('AUTH_COOKIE', 'access_token'),
                value=access_token,
                httponly=settings.SIMPLE_JWT.get('AUTH_COOKIE_HTTP_ONLY', True),
                secure=settings.SIMPLE_JWT.get('AUTH_COOKIE_SECURE', True),
                samesite=settings.SIMPLE_JWT.get('AUTH_COOKIE_SAMESITE', 'Lax'),
                max_age=settings.SIMPLE_JWT.get(
                    'ACCESS_TOKEN_LIFETIME'
                ).total_seconds(),
            )
            return response
        except Exception:
            return Response({"error": "Token inválido o expirado"}, status=400)


class CreateUserView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.AllowAny]


class UserProfileView(APIView):

    def get(self, request):
        serializer = UserSerializer(request.user)
        return Response(serializer.data)


class StatusesListCreateView(generics.ListCreateAPIView):
    queryset = Status.objects.all()
    serializer_class = StatusSerializer

from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_nested import routers
from . import views


router = DefaultRouter()
router.register(r'projects', views.ProjectViewSet)
router.register(r'templates', views.TaskTemplateViewSet)

# Nested router for tasks
projects_router = routers.NestedDefaultRouter(
    router,
    r'projects',
    lookup='project',
)
projects_router.register(
    r'tasks',
    views.TaskViewSet,
    basename='project-tasks',
)

# Nested router for comments and timelogs
tasks_router = routers.NestedDefaultRouter(
    projects_router,
    r'tasks',
    lookup='task',
)
tasks_router.register(
    r'comments',
    views.TaskCommentViewSet,
    basename='task-comments',
)
tasks_router.register(
    r'timelogs',
    views.TaskTimeLogViewSet,
    basename='task-timelogs',
)

urlpatterns = [
    path(
        'auth/login',
        views.LoginView.as_view(),
        name='login',
    ),
    path(
        'auth/logout',
        views.LogoutView.as_view(),
        name='logout',
    ),
    path(
        'auth/refresh',
        views.RefreshTokenView.as_view(),
        name='refresh_token',
    ),
    path(
        'auth/register',
        views.CreateUserView.as_view(),
        name='supplier_create',
    ),
    path(
        'users/me',
        views.UserProfileView.as_view(),
        name='user-profile',
    ),
    path('statuses', views.StatusesListCreateView.as_view(), name="statuses"),
    path('', include(router.urls)),
    path('', include(projects_router.urls)),
    path('', include(tasks_router.urls)),
]

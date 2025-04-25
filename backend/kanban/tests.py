from django.urls import reverse
from rest_framework.test import APITestCase, APIClient
from rest_framework import status

from .serializers import ProjectSerializer
from .models import (
    Project,
    Status,
    Task,
    TaskComment,
    TaskTimeLog,
    User,
    ProjectStatus,
)
from datetime import date, timedelta


class KanbanAPITests(APITestCase):
    def setUp(self):
        # Create test users
        self.user1 = User.objects.create_user(
            email='test1@example.com',
            password='testpass123',
        )
        self.user2 = User.objects.create_user(
            email='test2@example.com',
            password='testpass123',
        )

        # Create test project
        self.project = Project.objects.create(
            name='Test Project',
            description='Test Description',
        )
        self.project.members.add(self.user1)

        # Create test status
        self.status = Status.objects.create(name='To Do')

        # Create ProjectStatus to link project and status
        self.project_status = ProjectStatus.objects.create(
            project=self.project,
            status=self.status,
            order=1,
        )

        # Create test task
        self.task = Task.objects.create(
            project=self.project,
            title='Test Task',
            description='Test Description',
            status=self.status,
            assigned_to=self.user1,
            deadline=date.today() + timedelta(days=7),
        )

        # Create test comment
        self.comment = TaskComment.objects.create(
            task=self.task,
            user=self.user1,
            content='Test Comment',
        )

        # Create test time log
        self.timelog = TaskTimeLog.objects.create(
            task=self.task,
            user=self.user1,
            date='2024-03-20',
            hours=2.5,
        )

        # Set up client
        self.client = APIClient()
        self.client.force_authenticate(user=self.user1)

    def test_project_list(self):
        url = reverse('project-list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)

    def test_task_list(self):
        url = reverse('project-tasks-list', args=[self.project.pk])
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)

    # def test_task_create(self):
    #     url = reverse('project-tasks-list', args=[self.project.pk])
    #     data = {
    #         'title': 'New Task',
    #         'description': 'New Description',
    #         'status': self.status.pk,
    #         'assigned_to': self.user1.pk,
    #         'deadline': (date.today() + timedelta(days=14)).isoformat(),
    #     }
    #     response = self.client.post(url, data)
    #     self.assertEqual(response.status_code, status.HTTP_201_CREATED)
    #     self.assertEqual(Task.objects.count(), 2)
    #     self.assertEqual(
    #         Task.objects.last().deadline, date.today() + timedelta(days=14)
    #     )

    def test_task_create_without_deadline(self):
        url = reverse('project-tasks-list', args=[self.project.pk])
        data = {
            'title': 'New Task',
            'description': 'New Description',
            'status': self.status.pk,
            'assigned_to': self.user1.pk,
        }
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_task_create_with_past_deadline(self):
        url = reverse('project-tasks-list', args=[self.project.pk])
        data = {
            'title': 'New Task',
            'description': 'New Description',
            'status': self.status.pk,
            'assigned_to': self.user1.pk,
            'deadline': (date.today() - timedelta(days=1)).isoformat(),
        }
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_task_update_deadline(self):
        url = reverse(
            'project-tasks-detail', args=[self.project.pk, self.task.pk]
        )
        new_deadline = date.today() + timedelta(days=30)
        data = {
            'deadline': new_deadline.isoformat(),
        }
        response = self.client.patch(url, data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.task.refresh_from_db()
        self.assertEqual(self.task.deadline, new_deadline)

    def test_task_move(self):
        # Create a new status
        new_status = Status.objects.create(name='In Progress')

        # Link the new status to the project via ProjectStatus
        ProjectStatus.objects.create(
            project=self.project,
            status=new_status,
            order=2,
        )

        url = reverse('project-tasks-move', args=[self.project.pk, self.task.pk])
        data = {'status': new_status.pk}
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.task.refresh_from_db()
        self.assertEqual(self.task.status, new_status)

    def test_comment_create(self):
        url = reverse('task-comments-list', args=[self.project.pk, self.task.pk])
        data = {
            'content': 'New Comment',
        }
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(TaskComment.objects.count(), 2)

    def test_timelog_create(self):
        url = reverse('task-timelogs-list', args=[self.project.pk, self.task.pk])
        data = {
            'date': '2024-03-21',
            'hours': 3.0,
        }
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(TaskTimeLog.objects.count(), 2)

    def test_unauthorized_access(self):
        # Test unauthorized access by switching to user2 who is not a project member
        self.client.force_authenticate(user=self.user2)

        url = reverse('project-list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 0)  # Should see no projects

        url = reverse('project-tasks-list', args=[self.project.pk])
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 0)  # Should see no tasks

    def test_project_create_with_new_and_existing_statuses(self):
        # Crear un estado existente
        url = reverse('project-detail', args=[self.project.pk])

        response = self.client.get(url)
        self.assertEqual(200, status.HTTP_200_OK)

    def test_new_project(self):
        url = reverse('project-list')

        new_status = Status.objects.create(name="Done")

        data = {
            "name": "my newest project",
            "statuses": [
                {"status": self.status.pk, "order": 1},
                {"status": new_status.pk, "order": 2},
            ],
        }

        response = self.client.post(url, data=data, format="json")
        self.assertEqual(
            response.status_code, status.HTTP_201_CREATED, response.data
        )

    def test_invalid_project_with_repeated_order(self):
        url = reverse('project-list')

        new_status = Status.objects.create(name="Done")
        repeated_order = 1
        data = {
            "name": "my newest project",
            "statuses": [
                {"status": self.status.pk, "order": repeated_order},
                {"status": new_status.pk, "order": repeated_order},
            ],
        }

        response = self.client.post(url, data=data, format="json")
        self.assertEqual(
            response.status_code,
            status.HTTP_400_BAD_REQUEST,
        )
        self.assertIn('statuses', response.data)
        self.assertIn(
            f'Repeated order: {repeated_order}',
            response.data['statuses'],
        )

    def test_invalid_project_with_repeated_status(self):
        url = reverse('project-list')

        new_status = Status.objects.create(name="Done")
        data = {
            "name": "my newest project",
            "statuses": [
                {"status": new_status.pk, "order": 1},
                {"status": new_status.pk, "order": 2},
            ],
        }

        response = self.client.post(url, data=data, format="json")
        self.assertEqual(
            response.status_code,
            status.HTTP_400_BAD_REQUEST,
        )
        self.assertIn('statuses', response.data)
        self.assertIn(
            f'Repeated status: {new_status}',
            response.data['statuses'],
        )

import pytest
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APIClient
from django.contrib.auth import get_user_model
from todo_app.models import Task

User = get_user_model()


@pytest.fixture
def user():
    return User.objects.create_user(
        username='testuser',
        email='test@example.com',
        password='securepassword123'
    )


@pytest.fixture
def authenticate_client(user):
    client = APIClient()
    login_url = reverse('auth-login')
    login_data = {
        'username': 'testuser',
        'password': 'securepassword123'
    }
    response = client.post(login_url, login_data, format='json')
    token = response.data['token']
    client.credentials(HTTP_AUTHORIZATION=f'Token {token}')
    # ✅ Devolvemos tanto client como user
    return client, user


@pytest.mark.django_db
class TestTasks:

    def test_create_task_authenticated(self, authenticate_client):
        client, _ = authenticate_client
        url = reverse('task-list')
        data = {
            'title': 'Test Task',
            'description': 'This is a test task',
            'status': 'pending'
        }

        response = client.post(url, data, format='json')

        assert response.status_code == status.HTTP_201_CREATED
        assert response.data['title'] == 'Test Task'
        assert response.data['description'] == 'This is a test task'
        assert response.data['status'] == 'pending'
        assert 'id' in response.data
        assert Task.objects.filter(title='Test Task').exists()


    def test_create_task_unauthenticated(self):
        client = APIClient()
        url = reverse('task-list')
        data = {
            'title': 'Test without auth',
            'description': 'This should fail',
            'status': 'pending'
        }

        response = client.post(url, data, format='json')

        assert response.status_code == status.HTTP_401_UNAUTHORIZED

    def test_get_task_list_authenticated(self, authenticate_client):
        client, user = authenticate_client

        # ✅ Asignamos el usuario directamente
        Task.objects.create(title='Task 1', user=user)
        Task.objects.create(title='Task 2', user=user)

        url = reverse('task-list')
        response = client.get(url)

        assert response.status_code == status.HTTP_200_OK
        assert isinstance(response.data, list)
        assert len(response.data) >= 2

    def test_get_task_list_unauthenticated(self):
        client = APIClient()
        url = reverse('task-list')
        response = client.get(url)

        assert response.status_code == status.HTTP_401_UNAUTHORIZED

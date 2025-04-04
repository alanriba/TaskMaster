import pytest
from django.urls import reverse
from rest_framework.test import APIClient
from rest_framework import status
from django.contrib.auth import get_user_model
from todo_app.models import Task

User = get_user_model()

@pytest.fixture
def api_client():
    return APIClient()

@pytest.fixture
def create_user():
    user = User.objects.create_user(
        username='testuser',
        email='test@example.com',
        password='securepassword123'
    )
    return user

@pytest.fixture
def authenticate_client(api_client, create_user):
    url = reverse('auth-login')
    data = {
        'username': 'testuser',
        'password': 'securepassword123'
    }
    login_response = api_client.post(url, data, format='json')
    token = login_response.data['token']
    api_client.credentials(HTTP_AUTHORIZATION=f'Token {token}')
    return api_client

@pytest.mark.django_db
class TestTasks:
    def test_create_task_authenticated(self, authenticate_client):
        client = authenticate_client
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
    
    def test_create_task_unauthenticated(self, api_client):
        url = reverse('task-list')
        data = {
            'title': 'Test Task',
            'description': 'This is a test task',
            'status': 'pending'
        }
        
        response = api_client.post(url, data, format='json')
        assert response.status_code == status.HTTP_401_UNAUTHORIZED
        assert not Task.objects.filter(title='Test Task').exists()
    
    def test_list_tasks_authenticated(self, authenticate_client, create_user):
        # Create some tasks for the user
        Task.objects.create(title='Task 1', user=create_user)
        Task.objects.create(title='Task 2', user=create_user)
        
        # Create a task for another user
        other_user = User.objects.create_user(username='otheruser', password='password')
        Task.objects.create(title='Other User Task', user=other_user)
        
        url = reverse('task-list')
        response = authenticate_client.get(url)
        
        assert response.status_code == status.HTTP_200_OK
        assert len(response.data) == 2  # Should only see their own tasks
        assert any(task['title'] == 'Task 1' for task in response.data)
        assert any(task['title'] == 'Task 2' for task in response.data)
        assert not any(task['title'] == 'Other User Task' for task in response.data)
        
    def test_update_task_authenticated(self, authenticate_client, create_user):
        client = authenticate_client
        task = Task.objects.create(
            title='Original Title',
            description='Original description',
            status='pending',
            user=create_user
        )
            
        url = reverse('task-detail', args=[task.id])
        updated_data = {
            'title': 'Updated Title',
            'description': 'Updated description',
            'status': 'in_progress'
        }

        response = client.put(url, updated_data, format='json')
        task.refresh_from_db()

        assert response.status_code == status.HTTP_200_OK
        assert task.title == updated_data['title']
        assert task.description == updated_data['description']
        assert task.status == updated_data['status']
        
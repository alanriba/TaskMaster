import pytest
from django.urls import reverse
from rest_framework.test import APIClient
from rest_framework import status
from django.contrib.auth import get_user_model

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

@pytest.mark.django_db
class TestRegistration:
    def test_user_registration_successful(self, api_client):
        url = reverse('auth-register')
        data = {
            'username': 'newuser',
            'email': 'newuser@example.com',
            'password': 'securepassword123',
            'password_confirm': 'securepassword123'
        }
        
        response = api_client.post(url, data, format='json')
        assert response.status_code == status.HTTP_201_CREATED
        assert 'token' in response.data
        assert User.objects.filter(username='newuser').exists()
    
    def test_user_registration_password_mismatch(self, api_client):
        url = reverse('auth-register')
        data = {
            'username': 'newuser',
            'email': 'newuser@example.com',
            'password': 'securepassword123',
            'password_confirm': 'differentpassword'
        }
        
        response = api_client.post(url, data, format='json')
        assert response.status_code == status.HTTP_400_BAD_REQUEST
        assert 'password' in response.data
        assert not User.objects.filter(username='newuser').exists()
    
    def test_user_registration_username_exists(self, api_client, create_user):
        url = reverse('auth-register')
        data = {
            'username': 'testuser',  # Este usuario ya existe
            'email': 'another@example.com',
            'password': 'securepassword123',
            'password_confirm': 'securepassword123'
        }
        
        response = api_client.post(url, data, format='json')
        assert response.status_code == status.HTTP_400_BAD_REQUEST
        assert 'username' in response.data

@pytest.mark.django_db
class TestLogin:
    def test_login_successful(self, api_client, create_user):
        url = reverse('auth-login')
        data = {
            'username': 'testuser',
            'password': 'securepassword123'
        }
        
        response = api_client.post(url, data, format='json')
        assert response.status_code == status.HTTP_200_OK
        assert 'token' in response.data
        assert 'user' in response.data
    
    def test_login_invalid_credentials(self, api_client, create_user):
        url = reverse('auth-login')
        data = {
            'username': 'testuser',
            'password': 'wrongpassword'
        }
        
        response = api_client.post(url, data, format='json')
        assert response.status_code == status.HTTP_400_BAD_REQUEST
    
    def test_login_user_not_found(self, api_client):
        url = reverse('auth-login')
        data = {
            'username': 'nonexistentuser',
            'password': 'anypassword'
        }
        
        response = api_client.post(url, data, format='json')
        assert response.status_code == status.HTTP_400_BAD_REQUEST

@pytest.mark.django_db
class TestLogout:
    def test_logout_successful(self, api_client, create_user):
        # Primero hacemos login para obtener un token
        login_url = reverse('auth-login')
        login_data = {
            'username': 'testuser',
            'password': 'securepassword123'
        }
        login_response = api_client.post(login_url, login_data, format='json')
        token = login_response.data['token']
        
        # Configuramos el cliente con el token de autenticación
        api_client.credentials(HTTP_AUTHORIZATION=f'Token {token}')
        
        # Hacemos logout
        logout_url = reverse('auth-logout')
        response = api_client.post(logout_url)
        assert response.status_code == status.HTTP_204_NO_CONTENT
        
        # Verificamos que el token ha sido eliminado intentando acceder a un endpoint protegido
        me_url = reverse('auth-me')
        me_response = api_client.get(me_url)
        assert me_response.status_code == status.HTTP_401_UNAUTHORIZED

@pytest.mark.django_db
class TestUserProfile:
    def test_get_profile_authenticated(self, api_client, create_user):
        # Login
        login_url = reverse('auth-login')
        login_data = {
            'username': 'testuser',
            'password': 'securepassword123'
        }
        login_response = api_client.post(login_url, login_data, format='json')
        token = login_response.data['token']
        
        # Configurar cliente con token
        api_client.credentials(HTTP_AUTHORIZATION=f'Token {token}')
        
        # Obtener perfil
        me_url = reverse('auth-me')
        response = api_client.get(me_url)
        assert response.status_code == status.HTTP_200_OK
        assert response.data['username'] == 'testuser'
        assert response.data['email'] == 'test@example.com'
    
    def test_get_profile_unauthenticated(self, api_client):
        me_url = reverse('auth-me')
        response = api_client.get(me_url)
        assert response.status_code == status.HTTP_401_UNAUTHORIZED
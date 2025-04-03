from django.urls import path
from rest_framework.routers import DefaultRouter
from .views import UserViewSet

router = DefaultRouter()
router.register(r'auth', UserViewSet, basename='auth')

urlpatterns = router.urls
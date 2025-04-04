from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import TagViewSet, TaskViewSet, CategoryViewSet

router = DefaultRouter()
router.register(r'tasks', TaskViewSet, basename='task')
router.register(r'categories', CategoryViewSet, basename='category')
router.register(r'tags', TagViewSet, basename='tag')  # <- nuevo


urlpatterns = [
    path('', include(router.urls)),
]
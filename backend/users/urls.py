from django.urls import path
from rest_framework.routers import DefaultRouter
from .views import UserViewSet, run_migrations  

router = DefaultRouter()
router.register(r'auth', UserViewSet, basename='auth')

urlpatterns = router.urls + [
    path('run-migrations/', run_migrations), 
]

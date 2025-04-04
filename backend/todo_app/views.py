from rest_framework import viewsets, filters, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django_filters.rest_framework import DjangoFilterBackend
from .models import Task, Category, Tag
from .serializers import TaskSerializer, CategorySerializer, TagSerializer

class CategoryViewSet(viewsets.ModelViewSet):
    serializer_class = CategorySerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['name']
    ordering_fields = ['name', 'created_at']
    
    def get_queryset(self):
        return Category.objects.filter(user=self.request.user)

class TaskViewSet(viewsets.ModelViewSet):
    serializer_class = TaskSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['status', 'priority', 'category']
    search_fields = ['title', 'description']
    ordering_fields = ['title', 'due_date', 'priority', 'status', 'created_at']
    
    def get_queryset(self):
        user = self.request.user
        queryset = Task.objects.filter(user=user)

        # ✅ Filtro por tags (por ejemplo: ?tags=1,2)
        tag_ids = self.request.query_params.get('tags')
        if tag_ids:
            tag_ids = [int(tag_id) for tag_id in tag_ids.split(',')]
            queryset = queryset.filter(tags__id__in=tag_ids).distinct()

        return queryset
    
    @action(detail=True, methods=['post'])
    def change_status(self, request, pk=None):
        task = self.get_object()
        status_value = request.data.get('status')
        
        if status_value not in dict(Task.STATUS_CHOICES):
            return Response(
                {'error': 'Invalid status value'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        task.status = status_value
        task.save()
        serializer = self.get_serializer(task)
        return Response(serializer.data)

class TagViewSet(viewsets.ModelViewSet):
    serializer_class = TagSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Tag.objects.filter(user=self.request.user).order_by('name')

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

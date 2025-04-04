# Generated by Django 5.1.7 on 2025-04-04 08:34

import django.utils.timezone
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('todo_app', '0002_tag_task_tags'),
    ]

    operations = [
        migrations.AddField(
            model_name='tag',
            name='created_at',
            field=models.DateTimeField(auto_now_add=True, default=django.utils.timezone.now),
            preserve_default=False,
        ),
        migrations.AlterField(
            model_name='tag',
            name='name',
            field=models.CharField(max_length=50, unique=True),
        ),
    ]

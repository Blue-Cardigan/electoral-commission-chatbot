# Generated by Django 5.0 on 2023-12-30 10:46

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('chatapp', '0001_initial'),
    ]

    operations = [
        migrations.RenameField(
            model_name='chatmessage',
            old_name='message',
            new_name='question',
        ),
        migrations.RemoveField(
            model_name='chatmessage',
            name='type',
        ),
        migrations.AddField(
            model_name='chatmessage',
            name='response',
            field=models.TextField(default='Default response'),
            preserve_default=False,
        ),
    ]

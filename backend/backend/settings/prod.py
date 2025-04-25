"""
Production settings for backend project.
"""

from .base import *  # noqa
import boto3
import json
from botocore.exceptions import ClientError


def get_aws_parameter(name):
    """Get parameter from AWS Parameter Store"""
    ssm = boto3.client("ssm", region_name="sa-east-1")
    try:
        response = ssm.get_parameter(Name=name, WithDecryption=True)
        return response['Parameter']['Value']
    except ClientError as e:
        raise Exception(f"Error getting parameter {name}: {str(e)}")


# Get database credentials from AWS Parameter Store
DB_CREDENTIALS = json.loads(get_aws_parameter('/kanban/prod/db_credentials'))

# Get Django secret key from AWS Parameter Store
SECRET_KEY = get_aws_parameter('/kanban/prod/secret_key')

# Get allowed hosts from AWS Parameter Store
ALLOWED_HOSTS = get_aws_parameter('/kanban/prod/allowed_hosts').split(',')

# Get CORS and CSRF settings from AWS Parameter Store
CORS_ALLOWED_ORIGINS = get_aws_parameter(
    '/kanban/prod/cors_allowed_origins'
).split(',')
CSRF_TRUSTED_ORIGINS = get_aws_parameter(
    '/kanban/prod/csrf_trusted_origins'
).split(',')

# Database configuration
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': DB_CREDENTIALS['dbname'],
        'USER': DB_CREDENTIALS['username'],
        'PASSWORD': DB_CREDENTIALS['password'],
        'HOST': DB_CREDENTIALS['host'],
        'PORT': DB_CREDENTIALS['port'],
    }
}

# Security settings
SESSION_COOKIE_SECURE = False
CSRF_COOKIE_SECURE = False
SECURE_SSL_REDIRECT = False
SECURE_HSTS_SECONDS = 31536000  # 1 year
SECURE_HSTS_INCLUDE_SUBDOMAINS = True
SECURE_HSTS_PRELOAD = True

# JWT settings
SIMPLE_JWT['AUTH_COOKIE_SECURE'] = False
SIMPLE_JWT['AUTH_COOKIE_SAMESITE'] = 'None'

SECURE_BROWSER_XSS_FILTER = True
X_FRAME_OPTIONS = 'DENY'
SECURE_CONTENT_TYPE_NOSNIFF = True
SECURE_REFERRER_POLICY = 'strict-origin-when-cross-origin'

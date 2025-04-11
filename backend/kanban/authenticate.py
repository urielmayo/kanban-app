from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.permissions import SAFE_METHODS
from rest_framework.authentication import CSRFCheck
from rest_framework import exceptions

import logging

_logger = logging.getLogger('django')


class CookieJWTAuthentication(JWTAuthentication):
    def authenticate(self, request):
        # Obtener el token de la cookie
        access_token = request.COOKIES.get("access_token")

        if not access_token:
            return None  # No hay token, no autenticamos

        try:
            validated_token = self.get_validated_token(access_token)
            user = self.get_user(validated_token)

            # Validamos CSRF solo si el método es "unsafe"
            if request.method not in SAFE_METHODS:
                self.enforce_csrf(request)

            return user, validated_token
        except Exception as e:
            _logger.exception(f"authentication failed: {str(e)}")
            return None

    def enforce_csrf(self, request):
        """
        Enforce CSRF validation for session based authentication.
        """

        def dummy_get_response(request):  # pragma: no cover
            return None

        check = CSRFCheck(dummy_get_response)
        # populates request.META['CSRF_COOKIE'], which is used in process_view()
        check.process_request(request)
        reason = check.process_view(request, None, (), {})
        if reason:
            # CSRF failed, bail with explicit error message
            _logger.exception(f"CSRF Failed: {reason}")
            raise exceptions.PermissionDenied(f'CSRF Failed: {reason}')

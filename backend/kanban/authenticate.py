from rest_framework_simplejwt.authentication import JWTAuthentication
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

            return user, validated_token
        except Exception as e:
            _logger.exception(f"authentication failed: {str(e)}")
            return None

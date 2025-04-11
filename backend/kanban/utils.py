from rest_framework.views import exception_handler
from rest_framework.exceptions import NotFound
from rest_framework.response import Response
from rest_framework import status


def custom_exception_handler(exc, context):
    # Llamar al handler por defecto primero
    response = exception_handler(exc, context)

    # Si es un 404, devolvés JSON en lugar del HTML
    if isinstance(exc, NotFound):
        return Response(
            {"detail": "Resourece not found"},
            status=status.HTTP_404_NOT_FOUND,
        )

    # Si el response existe, lo devolvés tal como está
    return response

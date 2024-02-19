from django.shortcuts import render
from rest_framework import viewsets
from .models import Invoice
from .serializers import InvoiceSerializer,InvoiceDetailSerializer

class InvoiceViewset(viewsets.ModelViewSet):
    """
    A simple ViewSet for CRUD operation on invoices.
    """
    queryset = Invoice.objects.prefetch_related('invoice_details').all()
    serializer_class = InvoiceSerializer
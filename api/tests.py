from datetime import datetime
from django.test import TestCase
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APIClient
from .models import Invoice

class InvoiceTestCase(TestCase):
    def setUp(self):
        self.client = APIClient()

    def test_create_invoice(self):
        initial_invoice_count = Invoice.objects.count()
        new_invoice_data = {
            "customer_name": "Test Customer",
            "date": "2024-02-18",
            "invoice_details": [
                {
                    "description": "Test Description 1",
                    "quantity": 2,
                    "unit_price": "10.00"
                },
                {
                    "description": "Test Description 2",
                    "quantity": 1,
                    "unit_price": "15.00"
                }
            ]
        }

        response = self.client.post(reverse('invoice-list'), data=new_invoice_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Invoice.objects.count(), initial_invoice_count + 1)

    def test_get_invoices(self):
        response = self.client.get(reverse('invoice-list'))
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_update_invoice(self):
        invoice = Invoice.objects.create(customer_name="Test Customer", date="2024-02-18")
        updated_invoice_data = {
            "customer_name": "Updated Test Customer",
            "date": "2024-02-20",
            "invoice_details": [
                {
                    "id": 1,
                    "description": "Updated Test Description",
                    "quantity": 3,
                    "unit_price": "12.00"
                }
            ]
        }

        response = self.client.put(reverse('invoice-detail', args=[invoice.id]), data=updated_invoice_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        invoice = Invoice.objects.get(id=invoice.id)
        expected_date = datetime.strptime("2024-02-20", "%Y-%m-%d").date()
        self.assertEqual(invoice.customer_name, "Updated Test Customer")
        self.assertEqual(invoice.date, expected_date)
        # You may want to check the updated price as well

    def test_delete_invoice(self):
        invoice = Invoice.objects.create(customer_name="Test Customer", date="2024-02-18")
        initial_invoice_count = Invoice.objects.count()

        response = self.client.delete(reverse('invoice-detail', args=[invoice.id]))
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(Invoice.objects.count(), initial_invoice_count - 1)

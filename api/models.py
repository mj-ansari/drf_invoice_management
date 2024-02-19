from django.db import models

class Invoice(models.Model):
    customer_name = models.CharField(max_length=255)
    date = models.DateField()

class InvoiceDetail(models.Model):
    invoice = models.ForeignKey(Invoice, on_delete=models.CASCADE, related_name='invoice_details')
    description = models.TextField()
    quantity = models.IntegerField()
    unit_price = models.DecimalField(max_digits=10, decimal_places=2)
    # price = models.DecimalField(max_digits=10, decimal_places=2)
    
    @property
    def price(self):
        return self.unit_price * self.quantity

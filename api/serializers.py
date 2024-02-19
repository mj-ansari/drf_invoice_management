# serializers.py
from rest_framework import serializers
from .models import Invoice, InvoiceDetail

class InvoiceDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = InvoiceDetail
        fields = ['description', 'quantity', 'unit_price','price']
        read_only_fields = ['id']

class InvoiceSerializer(serializers.ModelSerializer):
    invoice_details = InvoiceDetailSerializer(many=True, required=False)

    class Meta:
        model = Invoice
        fields = ['id', 'customer_name', 'date', 'invoice_details']
        

    def create(self, validated_data):
        invoice_details_data = validated_data.pop('invoice_details', [])
        invoice = Invoice.objects.create(**validated_data)
        for detail_data in invoice_details_data:
            InvoiceDetail.objects.create(invoice=invoice, **detail_data)
        return invoice
    
    def update(self, instance, validated_data):
        invoice_details_data = validated_data.pop('invoice_details', [])
        existing_details = set(instance.invoice_details.values_list('id', flat=True))

        for detail_data in invoice_details_data:
            detail_id = detail_data.get('id', None)
            if detail_id in existing_details:
                detail = instance.invoice_details.get(id=detail_id)
                detail.description = detail_data.get('description', detail.description)
                detail.quantity = detail_data.get('quantity', detail.quantity)
                detail.unit_price = detail_data.get('unit_price', detail.unit_price)
                detail.price = detail_data.get('price', detail.price)
                detail.save()
                existing_details.remove(detail_id)
            else:
                InvoiceDetail.objects.create(invoice=instance, **detail_data)

        instance.invoice_details.filter(id__in=existing_details).delete()

        instance.customer_name = validated_data.get('customer_name', instance.customer_name)
        instance.date = validated_data.get('date', instance.date)
        instance.save()

        return instance
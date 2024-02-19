let invoices = [];

async function fetchInvoices() {
  try {
    const response = await fetch("/api/invoices/");
    const data = await response.json();
    invoices = data;
    renderInvoices();
  } catch (error) {
    console.error("Error fetching invoices:", error);
  }
}

function renderInvoices() {
  const invoiceList = document.getElementById("invoiceList");
  invoiceList.innerHTML = "";

  invoices.forEach((invoice) => {
    const row = document.createElement("tr");
    row.innerHTML = `
            <td>${invoice.customer_name}</td>
            <td>${invoice.date}</td>
            <td>${invoice.invoice_details[0].description}</td>
            <td>${invoice.invoice_details[0].quantity}</td>
            <td>${invoice.invoice_details[0].unit_price}</td>
            <td>${invoice.invoice_details[0].price}</td>
            <td><button class="btn btn-primary" onclick="openEditModal(${invoice.id})"><i class="bi bi-pencil-square"></i></button></td>
            <td><button class="btn btn-danger" onclick="deleteInvoice(${invoice.id})"><i class="bi bi-trash"></i></button></td>
        `;
    invoiceList.appendChild(row);
  });
}

async function saveInvoice() {
  const customerName = document.getElementById("customerName").value;
  const date = document.getElementById("date").value;
  const description = document.getElementById("description").value;
  const quantity = document.getElementById("quantity").value;
  const unitPrice = document.getElementById("unitPrice").value;

  // Check for empty fields
  if (!customerName || !date || !description || !quantity || !unitPrice) {
    alert("Please fill in all fields.");
    return;
  }

  // Validate quantity and unitPrice as numbers
  if (isNaN(quantity) || isNaN(unitPrice)) {
    alert("Quantity and Unit Price must be valid numbers.");
    return;
  }

  // Create the invoice object
  const invoice = {
    customer_name: customerName,
    date: date,
    invoice_details: [
      {
        description: description,
        quantity: quantity,
        unit_price: unitPrice,
        price: quantity * unitPrice,
      },
    ],
  };

  try {
    const response = await fetch("/api/invoices/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(invoice),
    });

    if (response.ok) {
      await fetchInvoices();
      clearForm();
    } else {
      console.error("Error saving invoice:", response.statusText);
    }
  } catch (error) {
    console.error("Error saving invoice:", error);
  }
}

function clearForm() {
  document.getElementById("customerName").value = "";
  document.getElementById("date").value = "";
  document.getElementById("description").value = "";
  document.getElementById("quantity").value = "";
  document.getElementById("unitPrice").value = "";
}

function openEditModal(id) {
  const invoice = invoices.find((inv) => inv.id === id);
  if (invoice) {
    document.getElementById("editInvoiceId").value = invoice.id;
    document.getElementById("editCustomerName").value = invoice.customer_name;
    document.getElementById("editDate").value = invoice.date;
    document.getElementById("editDescription").value =
      invoice.invoice_details[0].description;
    document.getElementById("editQuantity").value =
      invoice.invoice_details[0].quantity;
    document.getElementById("editUnitPrice").value =
      invoice.invoice_details[0].unit_price;
    const modal = new bootstrap.Modal(
      document.getElementById("editInvoiceModal")
    );
    modal.show();
  }
}

async function updateInvoice() {
  const id = document.getElementById("editInvoiceId").value;
  const customerName = document.getElementById("editCustomerName").value;
  const date = document.getElementById("editDate").value;
  const description = document.getElementById("editDescription").value;
  const quantity = document.getElementById("editQuantity").value;
  const unitPrice = document.getElementById("editUnitPrice").value;

  const invoice = {
    customer_name: customerName,
    date: date,
    invoice_details: [
      {
        description: description,
        quantity: quantity,
        unit_price: unitPrice,
      },
    ],
  };

  try {
    const response = await fetch(`/api/invoices/${id}/`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(invoice),
    });

    if (response.ok) {
      await fetchInvoices();
      const modal = bootstrap.Modal.getInstance(
        document.getElementById("editInvoiceModal")
      );
      modal.hide();
    } else {
      console.error("Error updating invoice:", response.statusText);
    }
  } catch (error) {
    console.error("Error updating invoice:", error);
  }
}

async function deleteInvoice(id) {
  // Ask for confirmation before deleting the invoice
  const confirmed = window.confirm(
    "Are you sure you want to delete this invoice?"
  );
  if (!confirmed) {
    return; // Cancel the deletion if the user clicks Cancel
  }

  try {
    const response = await fetch(`/api/invoices/${id}/`, {
      method: "DELETE",
    });

    if (response.ok) {
      await fetchInvoices();
    } else {
      console.error("Error deleting invoice:", response.statusText);
    }
  } catch (error) {
    console.error("Error deleting invoice:", error);
  }
}

window.onload = function () {
  fetchInvoices();
};

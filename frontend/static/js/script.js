let invoices = [];
let url = "http://127.0.0.1:8000/api/invoices/";
async function fetchInvoices() {
  try {
    const response = await fetch(url);
    const data = await response.json();
    invoices = data;
    renderInvoices();
  } catch (error) {
    console.error("Error fetching invoices:", error);
  }
}

function renderInvoices() {
  const invoiceContainer = document.getElementById("invoiceContainer");
  invoiceContainer.innerHTML = ""; // Clear existing content

  invoices.forEach((invoice, index) => {
    const card = document.createElement("div");
    card.classList.add("card", "mb-3");

    const cardBody = document.createElement("div");
    cardBody.classList.add("card-body");

    const cardTitle = document.createElement("span");
    cardTitle.classList.add("card-title", "fs-5");
    cardTitle.textContent = `Invoice #${index + 1}`;

    const buttons = document.createElement("span");
    buttons.innerHTML = `<button type='button' class='btn btn-danger' onclick='deleteInvoice(${invoice.id})'><i class='bi bi-trash3'></i></button>`;

    const cardTitleButtons = document.createElement("div");
    cardTitleButtons.classList.add("d-flex", "justify-content-between");
    cardTitleButtons.appendChild(cardTitle);
    cardTitleButtons.appendChild(buttons);

    const customerName = document.createElement("span");
    customerName.classList.add("card-text");
    customerName.innerHTML = `<strong>Customer Name:</strong> ${invoice.customer_name}`;

    const date = document.createElement("span");
    date.classList.add("card-text");
    date.innerHTML = `<strong>Date:</strong> ${invoice.date}`;

    const customerNameDate = document.createElement("div");
    customerNameDate.classList.add("d-flex", "justify-content-between");
    customerNameDate.appendChild(customerName);
    customerNameDate.appendChild(date);

    const itemsHeader = document.createElement("h6");
    itemsHeader.textContent = "Invoice Items:";

    const itemsList = document.createElement("ul");
    itemsList.classList.add("list-group", "list-group-flush");

    invoice.invoice_details.forEach((item, itemIndex) => {
      const itemElement = document.createElement("li");
      itemElement.classList.add("list-group-item");

      const itemDetails = document.createElement("div");
      itemDetails.classList.add(
        "d-flex",
        "justify-content-between",
        "align-items-center"
      );

      const itemInfo = document.createElement("div");
      itemInfo.innerHTML = `
        <p class='mb-0'><strong>Description:</strong> ${item.description}</p>
        <span><strong>Quantity:</strong> ${item.quantity}</span>
        <span><strong>Unit Price:</strong> ${item.unit_price}</span><br>
        <span><strong>Price:</strong> ${item.price}</span>
        `;

      itemDetails.appendChild(itemInfo);
      itemElement.appendChild(itemDetails);
      itemsList.appendChild(itemElement);
    });

    cardBody.appendChild(cardTitleButtons);
    cardBody.appendChild(customerNameDate);
    cardBody.appendChild(itemsHeader);
    cardBody.appendChild(itemsList);

    card.appendChild(cardBody);
    invoiceContainer.appendChild(card);
  });
}

let itemCount = 0;

function extendInvoice() {
  // Increment the item count
  itemCount++;

  // Clone the last three div elements
  var descriptionDiv = document
    .getElementById("description")
    .parentNode.cloneNode(true);
  var quantityDiv = document
    .getElementById("quantity")
    .parentNode.cloneNode(true);
  var unitPriceDiv = document
    .getElementById("unitPrice")
    .parentNode.cloneNode(true);

  // Clear values of cloned input fields
  descriptionDiv.querySelector("input").value = "";
  quantityDiv.querySelector("input").value = "";
  unitPriceDiv.querySelector("input").value = "";

  // Generate unique IDs for the cloned elements
  var descriptionId = "description_" + itemCount;
  var quantityId = "quantity_" + itemCount;
  var unitPriceId = "unitPrice_" + itemCount;

  // Update IDs and 'for' attributes for labels
  descriptionDiv.querySelector("label").setAttribute("for", descriptionId);
  descriptionDiv.querySelector("input").id = descriptionId;

  quantityDiv.querySelector("label").setAttribute("for", quantityId);
  quantityDiv.querySelector("input").id = quantityId;

  unitPriceDiv.querySelector("label").setAttribute("for", unitPriceId);
  unitPriceDiv.querySelector("input").id = unitPriceId;

  // Insert the cloned div elements before the "Item" button
  var itemButton = document.querySelector(".btn-success");
  itemButton.parentNode.insertBefore(descriptionDiv, itemButton);
  itemButton.parentNode.insertBefore(quantityDiv, itemButton);
  itemButton.parentNode.insertBefore(unitPriceDiv, itemButton);
}

function reduceInvoice() {
  // Ensure there are items to remove
  if (itemCount > 0) {
    // Navigate to the last added set of items
    var lastDescription = document.getElementById("description_" + itemCount);
    var lastQuantity = document.getElementById("quantity_" + itemCount);
    var lastUnitPrice = document.getElementById("unitPrice_" + itemCount);

    // Remove the last set of items
    lastDescription.parentNode.parentNode.removeChild(
      lastDescription.parentNode
    );
    lastQuantity.parentNode.parentNode.removeChild(lastQuantity.parentNode);
    lastUnitPrice.parentNode.parentNode.removeChild(lastUnitPrice.parentNode);

    // Decrement the item count
    itemCount--;
  }
}

async function saveInvoice() {
  const customerName = document.getElementById("customerName").value;
  const existingDescription = document.getElementById("description").value;
  const existingQuantity = document.getElementById("quantity").value;
  const existingUnitPrice = document.getElementById("unitPrice").value;

  // Check for empty fields
  if (
    !customerName ||
    !existingDescription ||
    !existingQuantity ||
    !existingUnitPrice
  ) {
    alert("Please fill in all fields.");
    return;
  }

  // Create an array to store invoice details
  const invoiceDetails = [];

  // Push details of the existing items to the invoice details array
  invoiceDetails.push({
    description: existingDescription,
    quantity: existingQuantity,
    unit_price: existingUnitPrice,
  });

  // Iterate over dynamically added items
  for (let i = 1; i <= itemCount; i++) {
    const description = document.getElementById("description_" + i).value;
    const quantity = document.getElementById("quantity_" + i).value;
    const unitPrice = document.getElementById("unitPrice_" + i).value;

    // Check for empty fields in the dynamic part of the form
    if (!description || !quantity || !unitPrice) {
      alert("Please fill in all fields for item " + i + ".");
      return;
    }

    // Push details of the item to the invoice details array
    invoiceDetails.push({
      description: description,
      quantity: quantity,
      unit_price: unitPrice,
    });
  }

  // Create the invoice object
  const invoice = {
    customer_name: customerName,
    invoice_details: invoiceDetails,
  };

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(invoice),
    });

    if (response.ok) {
      await fetchInvoices();
      document.querySelector("#invoiceForm").reset();
    } else {
      console.error("Error saving invoice:", response.statusText);
    }
  } catch (error) {
    console.error("Error saving invoice:", error);
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
    const response = await fetch(url + id + "/", {
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

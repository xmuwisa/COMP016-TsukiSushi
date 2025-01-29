lucide.createIcons();

document.addEventListener("DOMContentLoaded", () => {
    const cartItemsList = document.getElementById("cartItemsList");
    const orderNowButton = document.getElementById("orderNowButton");

    const orderPopupOverlay = document.getElementById("orderPopupOverlay");
    const orderItemsSummary = document.getElementById("orderItemsSummary");
    const orderTotalElement = document.getElementById("orderTotal");

    const submitOrderBtn = document.getElementById("submitOrderBtn");
    const cancelOrderBtn = document.getElementById("cancelOrderBtn");

    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    function renderCartItems() {
        if (cart.length === 0) {
            cartItemsList.innerHTML =
                "<div class='no-item'>Uh oh. No items here...</div>";
            return;
        }

        let html = "";
        cart.forEach((item, index) => {
            html += `
            <div class="item">
                <div class="item-cart">
                    <img 
                        src="${item.image}" 
                        alt="${item.name}" 
                    />
                    <div class="item-info">
                        <span class="name">${item.name}</span>
                        <div><span>Quantity: </span>${item.quantity}</div>
                        ${
                            item.option
                                ? `<div><span>${
                                      item.type === "sushi" ? "Spice" : "Size"
                                  }:</span> ${item.option}</div>`
                                : ""
                        }
                        <div><span>Unit Price: </span>₱${
                            item.finalUnitPrice
                        }</div>
                        <div class="total-amount"><span>Total: </span>₱${
                            item.totalCost
                        }</div>
                        
                        <div class="delete-item">
                            <button data-index="${index}">Delete</button>
                        </div>
                        
                    </div>
                </div>
          </div>
        `;
        });

        cartItemsList.innerHTML = html;

        const deleteButtons = document.querySelectorAll(".delete-item");
        deleteButtons.forEach((btn) =>
            btn.addEventListener("click", (e) => {
                const idx = parseInt(e.target.dataset.index, 10);
                confirmDeleteItem(idx);
            })
        );
    }

    function confirmDeleteItem(index) {
        const userConfirmed = confirm(
            "Are you sure you want to delete this item?"
        );
        if (userConfirmed) {
            cart.splice(index, 1);
            localStorage.setItem("cart", JSON.stringify(cart));
            renderCartItems();
        }
    }

    clearCartButton.addEventListener("click", () => {
        const userConfirmed = confirm(
            "Are you sure you want to clear all items?"
        );
        if (userConfirmed) {
            cart = [];
            localStorage.removeItem("cart");
            renderCartItems();
        }
    });

    orderNowButton.addEventListener("click", () => {
        if (cart.length === 0) {
            alert("Your cart is empty!");
            return;
        }
        showOrderForm();
    });

    function showOrderForm() {
        orderPopupOverlay.style.display = "flex";

        let summaryHtml = "";
        let cartTotal = 0;
        summaryHtml += `
        <table class="order-summary-table">
            <thead>
                <tr>
                    <th>Item</th>
                    <th>Qty</th>
                    <th>Type</th>
                    <th>Total</th>
                </tr>
            </thead>
            <tbody>
    `;

        cart.forEach((item) => {
            summaryHtml += `
            <tr>
                <td>${item.name}</td>
                <td>${item.quantity}</td>
                <td>
                    ${
                        item.option
                            ? `<em>[${
                                  item.type === "sushi" ? "Spice" : "Size"
                              }: ${item.option}]</em>`
                            : "N/A"
                    }
                </td>
                <td>₱${item.totalCost}</td>
            </tr>
        `;
            cartTotal += item.totalCost;
        });

        // Close the table
        summaryHtml += `
            </tbody>
        </table>
    `;

        orderItemsSummary.innerHTML = summaryHtml;
        orderTotalElement.textContent = cartTotal;

        const extrasCheckboxes = document.getElementsByName("extras");
        extrasCheckboxes.forEach((cb) =>
            cb.addEventListener("change", () => {
                recalcTotal();
            })
        );
    }

    function recalcTotal() {
        let newTotal = cart.reduce((sum, item) => sum + item.totalCost, 0);

        const extrasCheckboxes = document.getElementsByName("extras");
        extrasCheckboxes.forEach((cb) => {
            if (cb.checked) {
                const cost = parseInt(cb.dataset.cost, 10);
                newTotal += cost;
            }
        });

        orderTotalElement.textContent = newTotal;
    }

    cancelOrderBtn.addEventListener("click", () => {
        orderPopupOverlay.style.display = "none";
    });

    submitOrderBtn.addEventListener("click", () => {
        const userConfirmed = confirm("Place this order?");
        if (!userConfirmed) return;

        let newTotal = parseInt(orderTotalElement.textContent, 10);

        const nameField = document.getElementById("customerName");
        const contactField = document.getElementById("contactNumber");
        const notesField = document.getElementById("additionalNotes");

        const customerName = nameField.value.toUpperCase();
        const contactNumber = contactField.value.toUpperCase();
        const additionalNotes = notesField.value.toUpperCase();

        const orderTypeInputs = document.getElementsByName("orderType");
        let orderTypeValue = "Dine-In";
        orderTypeInputs.forEach((input) => {
            if (input.checked) {
                orderTypeValue = input.value;
            }
        });

        const chosenExtras = [];
        const extrasCheckboxes = document.getElementsByName("extras");
        extrasCheckboxes.forEach((cb) => {
            if (cb.checked) {
                chosenExtras.push({
                    name: cb.value,
                    cost: parseInt(cb.dataset.cost, 10),
                });
            }
        });

        const now = new Date();
        const dateTime = now.toLocaleString();
        const receiptNumber = "RCPT-" + Math.floor(Math.random() * 1000000);
        const newReceipt = {
            receiptNumber,
            dateTime,
            items: cart,
            extras: chosenExtras,
            name: customerName,
            contact: contactNumber,
            notes: additionalNotes,
            orderType: orderTypeValue,
            total: newTotal,
        };

        let receipts = JSON.parse(localStorage.getItem("receipts")) || [];
        receipts.push(newReceipt);
        localStorage.setItem("receipts", JSON.stringify(receipts));

        cart = [];
        localStorage.removeItem("cart");

        window.location.href = "receipts.html";
    });

    renderCartItems();
});

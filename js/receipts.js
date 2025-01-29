lucide.createIcons();

document.addEventListener("DOMContentLoaded", () => {
    const receiptsList = document.getElementById("receiptsList");
    const receiptDetailsOverlay = document.getElementById(
        "receiptDetailsOverlay"
    );
    const receiptDetailsContent = document.getElementById(
        "receiptDetailsContent"
    );
    const closeDetailsBtn = document.getElementById("closeDetailsBtn");

    let receipts = JSON.parse(localStorage.getItem("receipts")) || [];

    function renderReceipts() {
        if (receipts.length === 0) {
            receiptsList.innerHTML =
                "<div class='no-receipt'>Uh oh. No receipts here...</div>";
            return;
        }

        let html = "";
        receipts.forEach((receipt, index) => {
            html += `
          <div class="receipt">
            <div class="rcp-num">${receipt.receiptNumber}</div>
            <div><span>Date/Time: </span>${receipt.dateTime}</div>
            <div><span>Total: </span>₱${receipt.total}</div>
            <div class="view-receipt">
                <button data-index="${index}">View Details</button>
            </div>
          </div>
        `;
        });

        receiptsList.innerHTML = html;

        const viewButtons = document.querySelectorAll(".view-receipt");
        viewButtons.forEach((btn) => {
            btn.addEventListener("click", (e) => {
                const idx = parseInt(e.target.dataset.index, 10);
                showReceiptDetails(idx);
            });
        });
    }

    function showReceiptDetails(index) {
        const r = receipts[index];
        if (!r) return;
        let detailsHtml = `
        <div class="rcp-num-title">${r.receiptNumber}</div>
        <div><span>Date/Time:</span> ${r.dateTime}</div>
        <div><span>Name:</span> ${r.name}</div>
        <div><span>Contact:</span> ${r.contact}</div>
        <div><span>Notes:</span> ${r.notes}</div>
        <div><span>Order Type:</span> ${r.orderType}</p>
        <span class="emp">Items</span>
        <table class="receipt-items-table">
            <thead>
                <tr>
                    <th>Item</th>
                    <th>Qty</th>
                    <th>Option</th>
                    <th>Subtotal</th>
                </tr>
            </thead>
            <tbody>
    `;

        r.items.forEach((item) => {
            detailsHtml += `
            <tr>
                <td>${item.name}</td>
                <td>${item.quantity}</td>
                <td>${
                    item.option
                        ? item.type === "sushi"
                            ? `Spice: ${item.option}`
                            : `Size: ${item.option}`
                        : "N/A"
                }</td>
                <td>₱${item.totalCost}</td>
            </tr>
            `;
        });

        detailsHtml += `
            </tbody>
        </table>
        `;

        if (r.extras && r.extras.length > 0) {
            detailsHtml += `<span class="emp">Extras</span>
            <table class="receipt-extras-table">
                <thead>
                    <tr>
                        <th>Extra</th>
                        <th>Cost</th>
                    </tr>
                </thead>
                <tbody>
            `;

            r.extras.forEach((ex) => {
                detailsHtml += `
                <tr>
                    <td>${ex.name}</td>
                    <td>₱${ex.cost}</td>
                </tr>
                `;
            });

            detailsHtml += `
                </tbody>
            </table>
            `;
        }

        detailsHtml += `<div class="total">Total: ₱${r.total}</div>`;

        receiptDetailsContent.innerHTML = detailsHtml;
        receiptDetailsOverlay.style.display = "flex";
    }

    closeDetailsBtn.addEventListener("click", () => {
        receiptDetailsOverlay.style.display = "none";
    });

    renderReceipts();
});

lucide.createIcons();

document.addEventListener("DOMContentLoaded", () => {
    const params = new URLSearchParams(window.location.search);
    const itemId = parseInt(params.get("id"), 10);
    const itemType = params.get("type");

    const SUSHI_JSON_PATH = "./data/sushi.json";
    const DRINK_JSON_PATH = "./data/drink.json";

    let currentItem = null;

    if (itemType === "sushi") {
        fetch(SUSHI_JSON_PATH)
            .then((res) => res.json())
            .then((data) => {
                currentItem = data.find((item) => item.id === itemId);
                renderDetails(currentItem);
            })
            .catch((err) => console.error("Error fetching sushi data:", err));
    } else {
        fetch(DRINK_JSON_PATH)
            .then((res) => res.json())
            .then((data) => {
                currentItem = data.find((item) => item.id === itemId);
                renderDetails(currentItem);
            })
            .catch((err) => console.error("Error fetching drink data:", err));
    }

    function renderDetails(item) {
        const detailsContainer = document.getElementById("detailsContainer");
        if (!item) {
            detailsContainer.innerHTML = `<p>Item not found.</p>`;
            return;
        }

        detailsContainer.innerHTML = `
        <span class="logo-name item-name">
            ${item.name}
        </span>
        <div class="item">
            <img
                    src="${item.image}"
                    alt="${item.name}"
                />
            <div class="item-details">
                <div class="add-to-cart"><button id="showPopupButton">Add to Cart</button></div>
                <div class="item-desc">${item.desc}</div>
                ${
                    item.servingSize
                        ? `<div><span>Serving Size:</span> ${item.servingSize}</div>`
                        : ""
                }
                ${
                    itemType === "sushi" && item.ingredients
                        ? `<div><span>Ingredients:</span> ${item.ingredients.join(
                              ", "
                          )}</div>`
                        : ""
                }
                ${
                    itemType === "sushi" && item.inclusion
                        ? `<div><span>Inclusion:</span> ${item.inclusion.join(
                              ", "
                          )}</div>`
                        : ""
                }
                ${
                    itemType === "sushi" && item.allergens
                        ? `<div><span>Allergens:</span> ${item.allergens.join(
                              ", "
                          )}</div>`
                        : ""
                }
                <div><span>Preparation Time:</span> ${
                    item.prepMinutes
                } mins.</div>
                <div class="item-price"><span>Price:</span> ₱${item.price}</div>
            </div>
        </div>
        
    `;

        document
            .getElementById("showPopupButton")
            .addEventListener("click", () => {
                showPopupForm(itemType);
            });
    }

    function showPopupForm(type) {
        const popupOverlay = document.getElementById("popupOverlay");
        const popupContent = document.getElementById("popupContent");
        popupOverlay.style.display = "flex";

        let formHtml = `
        <div>
            <span class="emp">Quantity</span>
            <span class="quantity-control">
                <button type="button" id="decrementQty">-</button>
                <span id="qtyValue" class="quantity-value">1</span>
                <button type="button" id="incrementQty">+</button>
            </span>
        </div>
        `;

        if (type === "sushi") {
            formHtml += `
            <div>
                <span class="emp">Spice Level</span>
                <label><input type="radio" name="spiceLevel" value="Regular" checked /> Regular</label>
                <label><input type="radio" name="spiceLevel" value="Mild" /> Mild</label>
                <label><input type="radio" name="spiceLevel" value="Hot" /> Hot</label>
            </div>
        `;
        } else {
            formHtml += `
            <div>
                <span class="emp">Size</span>
                <label><input type="radio" name="drinkSize" value="Small" checked /> Small</label>
                <label><input type="radio" name="drinkSize" value="Medium" /> Medium</label>
                <label><input type="radio" name="drinkSize" value="Large" /> Large</label>
            </div>
        `;
        }

        popupContent.innerHTML = formHtml;

        let qty = 1;
        const qtyValue = document.getElementById("qtyValue");
        document
            .getElementById("incrementQty")
            .addEventListener("click", () => {
                qty++;
                qtyValue.textContent = qty;
            });
        document
            .getElementById("decrementQty")
            .addEventListener("click", () => {
                if (qty > 1) {
                    qty--;
                    qtyValue.textContent = qty;
                }
            });

        document
            .getElementById("cancelButton")
            .addEventListener("click", () => {
                popupOverlay.style.display = "none";
                location.reload();
            });

        document
            .getElementById("addToCartButton")
            .addEventListener("click", () => {
                const userConfirmed = confirm(
                    "Are you sure you want to add this item to your cart?"
                );
                if (userConfirmed) {
                    addToCart(qty, type);
                }
            });
    }

    function addToCart(quantity, type) {
        let selectedOption = "";
        if (type === "sushi") {
            const spiceRadios = document.getElementsByName("spiceLevel");
            spiceRadios.forEach((radio) => {
                if (radio.checked) selectedOption = radio.value;
            });
        } else {
            const sizeRadios = document.getElementsByName("drinkSize");
            sizeRadios.forEach((radio) => {
                if (radio.checked) selectedOption = radio.value;
            });
        }

        let basePrice = currentItem.price;
        let finalUnitPrice = basePrice;

        if (type === "drinks") {
            if (selectedOption === "Medium") {
                finalUnitPrice += 20;
            } else if (selectedOption === "Large") {
                finalUnitPrice += 40;
            }
        }

        const totalCost = finalUnitPrice * quantity;

        const cartItem = {
            id: currentItem.id,
            name: currentItem.name,
            basePrice: basePrice,
            finalUnitPrice: finalUnitPrice,
            quantity: quantity,
            totalCost: totalCost,
            type: type,
            option: selectedOption,
            image: currentItem.image,
        };

        let cart = JSON.parse(localStorage.getItem("cart")) || [];
        cart.push(cartItem);
        localStorage.setItem("cart", JSON.stringify(cart));

        document.getElementById("popupOverlay").style.display = "none";
        location.reload();
    }
});

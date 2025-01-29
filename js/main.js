lucide.createIcons();

const SUSHI_JSON_PATH = "./data/sushi.json";

let sushiData = [];
let currentData = [];
let currentTab = "sushi";
let currentCategory = "all";
let currentAvailability = "all";
let itemsToShow = 12;

const showMoreButton = document.getElementById("showMore");
const tabs = document.querySelectorAll(".tab-button");
const availabilityFilter = document.getElementById("availabilityFilter");
const itemsList = document.getElementById("itemsList");
const searchInput = document.getElementById("searchInput");
const searchButton = document.getElementById("searchButton");
const headToTop = document.getElementById("headToTop");
const categoryMap = [
    "All",
    "Best Sellers",
    "Maki",
    "Nigiri",
    "Sashimi",
    "Donburi",
    "Temaki",
    "Omakase Specials",
    "Chirashi",
    "Side Dishes & Appetizers",
];

headToTop.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
});

showMoreButton.addEventListener("click", () => {
    itemsToShow += 12;
    renderItems();
});

function init() {
    fetch(SUSHI_JSON_PATH)
        .then((res) => res.json())
        .then((data) => {
            sushiData = data;
            currentData = sushiData;
            setActiveTab("sushi");
            initializeStocks();
            renderItems();
            addEventListeners();
        })
        .catch((err) => console.error("Error fetching data:", err));
}

function initializeStocks() {
    let storedStocks = JSON.parse(localStorage.getItem("sushiStocks")) || {};
    sushiData.forEach((item) => {
        if (!storedStocks[item.id]) {
            storedStocks[item.id] = 100;
        }
    });
    localStorage.setItem("sushiStocks", JSON.stringify(storedStocks));
}

function addEventListeners() {
    tabs.forEach((tab) => {
        tab.addEventListener("click", switchTab);
    });
    availabilityFilter.addEventListener("change", filterItems);

    searchButton.addEventListener("click", searchItems);

    searchInput.addEventListener("keypress", (e) => {
        if (e.key === "Enter") {
            searchItems();
        }
    });
}

function searchItems() {
    const query = searchInput.value.trim().toLowerCase();

    if (!query) {
        currentData = sushiData;
    } else {
        currentData = sushiData.filter((item) => {
            return (
                item.name.toLowerCase().includes(query) ||
                item.desc.toLowerCase().includes(query)
            );
        });
    }

    renderItems();
}

function switchTab(e) {
    const selectedTab = e.target.dataset.tab;
    setActiveTab(selectedTab);

    if (selectedTab === "All") {
        currentCategory = "all";
    } else if (selectedTab === "Best Sellers") {
        currentCategory = "best-sellers";
    } else {
        currentCategory = selectedTab;
    }

    currentAvailability = "all";
    availabilityFilter.value = "all";

    renderItems();
}

function setActiveTab(tabName) {
    tabs.forEach((tab) => {
        if (tab.dataset.tab === tabName) {
            tab.classList.add("active");
        } else {
            tab.classList.remove("active");
        }
    });
}

function filterItems() {
    currentAvailability = availabilityFilter.value;
    renderItems();
}

function renderItems() {
    const filteredItems = currentData.filter((item) => {
        let stocks = JSON.parse(localStorage.getItem("sushiStocks")) || {};
        const isAvailable = stocks[item.id] > 0;

        const matchesCategory =
            currentCategory === "all" ||
            (currentCategory === "best-sellers" && item.bestSeller) ||
            item.category === currentCategory;
        const matchesAvailability =
            currentAvailability === "all" ||
            (currentAvailability === "available" && isAvailable) ||
            (currentAvailability === "unavailable" && !isAvailable);

        return matchesCategory && matchesAvailability;
    });

    const limitedItems = filteredItems.slice(0, itemsToShow);

    const html = limitedItems
        .map((item) => {
            let stocks = JSON.parse(localStorage.getItem("sushiStocks")) || {};
            const isAvailable = stocks[item.id] > 0;

            return `
        <div 
          class="item" 
          style="opacity: ${isAvailable ? 1 : 0.5}"
        >
          ${
              isAvailable
                  ? `<a 
                        href="details.html?id=${item.id}" 
                        class="item-available"
                     >
                        <img 
                          src="${item.image}" 
                          alt="${item.name}" 
                        />
                        <div class="item-info">
                          <span class="stocks">Stocks: ${stocks[item.id]}</span>
                          <span class="name">${item.name}</span>
                          <span>${item.desc}</span>
                          ${
                              item.servingSize
                                  ? `<div class="serving"><span>Serving Size:</span> ${item.servingSize}</div>`
                                  : ""
                          }
                          <div class="price">Price: ₱${item.price}</div>
                        </div>
                    </a>`
                  : `<div class="unavailable item-unavailable">
                        <img 
                          src="${item.image}" 
                          alt="${item.name}" 
                        />
                        <div class="item-info">
                            <span class="stocks">Stocks: ${
                                stocks[item.id]
                            }</span>
                            <span class="name">${item.name}</span>
                            <span>${item.desc}</span>
                            ${
                                item.servingSize
                                    ? `<div class="serving"><span>Serving Size:</span> ${item.servingSize}</div>`
                                    : ""
                            }
                            <div class="price">Price: ₱${item.price}</div>
                        </div>
                    </div>`
          }
        </div>
      `;
        })
        .join("");

    itemsList.innerHTML = html;

    if (itemsToShow >= filteredItems.length) {
        showMoreButton.style.display = "none";
    } else {
        showMoreButton.style.display = "block";
    }
}

document.addEventListener("DOMContentLoaded", init);

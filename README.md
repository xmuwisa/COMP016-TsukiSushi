# Tsuki Sushi Food Ordering System

## Overview

Tsuki Sushi is a simple yet functional food ordering system developed as part of my **COMP 016** coursework. Built using vanilla **HTML**, **CSS**, and **JavaScript**, it leverages local storage for managing user data. The project demonstrates a practical application of web development fundamentals while meeting the requirements of the activity.

---

## Features

### 1. Home Page

-   View all available sushi and drinks.
-   Apply filters to narrow down choices.

### 2. Sushi/Drink Details Page

-   Click on a sushi or drink to view detailed information:
    -   **Sushi Details**: ID, image, name, description, image, price, serving size, ingredients, inclusions (e.g., wasabi, soy sauce, pickled ginger), allergens, preparation time, availability, and category.
    -   **Drink Details**: ID, image, name, description, availability, and category.
-   Add items to the cart with customization options:
    -   **Sushi Options**:
        -   Select spice level (Regular, Mild, Hot).
        -   Adjust quantity using `+` and `-` buttons.
    -   **Drink Options**:
        -   Select size (Small, Medium, Large).
        -   Adjust quantity using `+` and `-` buttons.

### 3. Cart Page

-   View all selected items.
-   Available actions:
    -   **Delete**: Remove specific sushi or drink from the cart.
    -   **Finalize Order**: Opens a popup form with the following inputs:
        -   **Name** (input box)
        -   **Contact Number** (input box)
        -   **Order Type** (radio button: Dine In or Take Out)
        -   **Toppings Preference** (checkbox: Traditional/Modern toppings)
        -   **Note** (input box)
        -   **Total** (displayed total amount)
    -   Options:
        -   **Cancel**: Return to the cart to continue editing.
        -   **Submit Order**: Confirms the order, generates a receipt, and redirects to the Receipts Page.

### 4. Receipts Page

-   View all order receipts.
-   Each receipt includes:
    -   Receipt number.
    -   Ordered items with details.
    -   User inputs (e.g., Name, Contact Number, Order Type, Extras, Note, Total).
-   Click on a receipt to view detailed information.

---

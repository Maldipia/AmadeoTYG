# Amadeo Marketplace: Navigation Flow

This document outlines the primary navigation paths for the two main user types on the Amadeo Marketplace platform: **Customers** and **Merchants**.

---

## 1. Customer Journey

The customer journey is designed to be a seamless funnel from discovery to purchase and repeat engagement.

```mermaid
graph TD
    A[External Source] --> B(Homepage);
    B --> C{Browse/Search};
    C --> D[Product Page];
    D --> E(Add to Cart);
    E --> F[Cart Page];
    F --> G[Checkout];
    G --> H{Select Payment};
    H -- COD --> I(Place Order);
    H -- Online Payment --> J(Place Order & Get Raffle Entry);
    I --> K[Order Success Page];
    J --> K;
    K --> L[Customer Account];
    L --> M(View Order History);
    L --> N(View Raffle Entries);

    subgraph "Landing Pages"
        LP_C(Customer Landing) --> B;
        LP_M(Merchant Landing) --> B;
    end

    style B fill:#F0FFF4,stroke:#81B29A,stroke-width:2px
    style D fill:#F0FFF4,stroke:#81B29A,stroke-width:2px
    style G fill:#F0FFF4,stroke:#81B29A,stroke-width:2px
    style L fill:#F0FFF4,stroke:#81B29A,stroke-width:2px
    style J fill:#E07A5F,stroke:#BF6D56,stroke-width:2px,color:#fff
```

### Key Customer Pages:

| Page | URL | Purpose |
| :--- | :--- | :--- |
| **Homepage** | `/index.html` | Discover stores and products. Main entry point. |
| **Product Page** | (Dynamic) | View product details, images, and merchant info. |
| **Cart** | (Modal) | Review items, adjust quantity. |
| **Checkout** | (Modal) | Enter delivery info, select payment method. |
| **Customer Account** | `/account.html` | Track orders, view raffle entries, manage info. |
| **Customer Landing** | `/customer-landing.html` | Attract new customers with value propositions. |

---

## 2. Merchant Journey

The merchant journey is focused on easy onboarding, store management, and order fulfillment.

```mermaid
graph TD
    A[External Source] --> B(Merchant Landing Page);
    B --> C{Sign Up / Login};
    C --> D[Merchant Dashboard];
    D --> E(View Orders);
    D --> F(Manage Products);
    D --> G(View Stats);
    E --> H(Update Order Status);
    F --> I(Add/Edit Product);

    style B fill:#F0FFF4,stroke:#81B29A,stroke-width:2px
    style D fill:#F0FFF4,stroke:#81B29A,stroke-width:2px
```

### Key Merchant Pages:

| Page | URL | Purpose |
| :--- | :--- | :--- |
| **Merchant Landing** | `/merchant-landing.html` | Convince businesses to join the platform. |
| **Merchant Login** | `/merchant-login.html` | Secure access to the dashboard. |
| **Merchant Dashboard** | `/dashboard.html` | Central hub for managing store, products, and orders. |

---

## 3. Sitemap & Page Connections

This shows how all the pages are interconnected.

*   **Homepage (`/`)**
    *   Links to Product Pages.
    *   Links to Customer Account (`/account.html`).
    *   Footer links to Merchant Landing (`/merchant-landing.html`) and Customer Landing (`/customer-landing.html`).
*   **Merchant Landing (`/merchant-landing.html`)**
    *   Primary CTA links to Merchant Login/Sign Up (`/merchant-login.html`).
*   **Customer Landing (`/customer-landing.html`)**
    *   Primary CTA links to the Homepage (`/`).
*   **Merchant Dashboard (`/dashboard.html`)**
    *   Self-contained with tabs for Orders, Products, etc.
*   **Customer Account (`/account.html`)**
    *   Accessible after placing an order or via direct link.

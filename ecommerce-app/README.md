# Simple E-commerce Project

A basic e-commerce app: **Spring Boot + MySQL** REST API backend, and a plain
**HTML / CSS / JS** frontend (no framework, no build step).

```
ecommerce-app/
├── backend/    Spring Boot REST API (Java, Maven)
└── frontend/   Static HTML/CSS/JS storefront
```

## Features

- Product catalog with search + category filter
- Register / log in (passwords hashed with BCrypt)
- Cart: add, change quantity, remove
- Checkout → creates an order, decrements stock, clears cart
- Order history per user
- Basic admin-capable endpoints (create/update/delete product) — no auth
  guard yet, see "Next steps" below

## 1. Backend setup

**Requirements:** Java 17+, Maven, MySQL 8 running locally.

1. Create the database (or let the app do it — see below):
   ```sql
   CREATE DATABASE ecommerce_db;
   ```

2. Open `backend/src/main/resources/application.properties` and set your
   MySQL username/password:
   ```properties
   spring.datasource.username=root
   spring.datasource.password=your_mysql_password
   ```
   The URL already includes `createDatabaseIfNotExist=true`, so step 1 is
   optional if your MySQL user has permission to create databases.

3. **(Optional) Seed sample products.** On your *first* run only, set:
   ```properties
   spring.sql.init.mode=always
   ```
   This runs `data.sql` and inserts 12 sample products. Switch it back to
   `never` before your next restart, or `data.sql` will insert duplicates
   every time the app boots (it has no "if not exists" check).

4. Run it:
   ```bash
   cd backend
   mvn spring-boot:run
   ```
   The API starts on **http://localhost:8080**. Tables are created
   automatically (`spring.jpa.hibernate.ddl-auto=update`).

## 2. Frontend setup

No build step — it's plain HTML/CSS/JS. Just serve the `frontend/` folder:

```bash
cd frontend
python3 -m http.server 5500
```

Then open **http://localhost:5500** in your browser. (Opening the HTML
files directly with `file://` also mostly works, since the API calls use
an absolute `http://localhost:8080` base URL — but a local server avoids
occasional browser CORS quirks with `file://` origins.)

If you serve the frontend from a different port, it already works: the
backend's `CorsConfig` allows all origins for `/api/**`.

## 3. Try it out

1. Open the site → browse the catalog.
2. Click **Sign up**, create an account.
3. Add a few products to your cart.
4. Go to **Cart** → adjust quantities → **Place order**.
5. Check **Orders** to see your order history and stock get deducted.

## API overview

| Method | Endpoint                          | Description                  |
|--------|------------------------------------|-------------------------------|
| GET    | `/api/products`                    | List products (`?category=`, `?search=`) |
| GET    | `/api/products/{id}`               | Get one product               |
| POST   | `/api/products`                    | Create product (admin)        |
| PUT    | `/api/products/{id}`               | Update product (admin)        |
| DELETE | `/api/products/{id}`               | Delete product (admin)        |
| POST   | `/api/auth/register`               | Register a user               |
| POST   | `/api/auth/login`                  | Log in                        |
| GET    | `/api/cart/{userId}`               | View cart                     |
| POST   | `/api/cart/{userId}`               | Add item to cart              |
| PUT    | `/api/cart/{userId}/item/{itemId}` | Update quantity               |
| DELETE | `/api/cart/{userId}/item/{itemId}` | Remove item                   |
| POST   | `/api/orders/{userId}`             | Place order (checkout)        |
| GET    | `/api/orders/user/{userId}`        | Order history for a user      |
| GET    | `/api/orders`                      | All orders (admin)            |
| PUT    | `/api/orders/{orderId}/status`     | Update order status (admin)   |

## Notes on how auth is done here

This project keeps things intentionally simple: `/api/auth/login` checks
the password with BCrypt and returns the user object, which the frontend
stores in `localStorage`. There's no session token or JWT, and no route
protection on the backend — anyone who knows a user's ID could hit their
cart/order endpoints directly. That's fine for learning the CRUD +
frontend-integration flow, but **don't ship this as-is**.

### Natural next steps
- Add Spring Security + JWT so `/api/cart/**`, `/api/orders/**`, and the
  admin product endpoints actually require a valid, matching token.
- Move the MySQL password out of `application.properties` and into an
  environment variable.
- Add pagination to `/api/products`.
- Add an admin UI (or guard the existing admin endpoints behind a role
  check) instead of leaving them open.

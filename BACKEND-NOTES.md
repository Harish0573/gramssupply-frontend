# Backend endpoints the new admin panel and wishlist use

The frontend already works with these existing endpoints: `GET /api/enquiries`, `PATCH /api/enquiries/{id}/status`, `POST /api/orders`, `GET /api/orders/my`, `POST /api/orders/{id}/cancel`.

To make **orders** and **wishlists** show up for the admin, add these to your Spring Boot app (admin-only, e.g. `hasRole("ADMIN")`):

| Method | URL | Purpose |
|---|---|---|
| GET | `/api/orders` | every order (same JSON shape as `/orders/my`) |
| PATCH | `/api/orders/{orderId}/status` | body `{ "status": "SHIPPED" }` |
| POST | `/api/wishlist` | called by the site when a logged-in customer taps the heart. Body `{ productId, productName, price, saved }`. Read the customer from the login token. Add a row when `saved` is true, delete it when false. |
| GET | `/api/wishlist/all` | rows `{ productId, productName, price, customerName, phone, createdAt }` |

If these are missing, the admin panel still opens. It shows a notice on the Orders tab and falls back to this browser's saved wishlist.

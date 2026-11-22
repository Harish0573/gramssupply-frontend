import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  ShoppingBag,
  PackageCheck,
} from "lucide-react";

import Navbar from "../components/Navbar";
import { fetchProducts, findCartProduct } from "../utils/catalog";
import "./Cart.css";

function Cart() {
  // Load saved cart from localStorage
  const [cart, setCart] = useState(() => {
    try {
      const savedCart = JSON.parse(localStorage.getItem("jr_cart") || "[]");

      return Array.isArray(savedCart) ? savedCart : [];
    } catch {
      return [];
    }
  });

  // Products fetched from Spring Boot
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Save cart whenever it changes
  useEffect(() => {
    localStorage.setItem("jr_cart", JSON.stringify(cart));
    window.dispatchEvent(new Event("cart-updated"));
  }, [cart]);

  // Fetch real products from backend
  useEffect(() => {
    const loadProducts = async () => {
      try {
        setProducts(await fetchProducts());
        setError("");
      } catch (err) {
        console.error("Cart product API error:", err);
        setError("Unable to load product information.");
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  // Match cart items with backend products
  const cartProducts = useMemo(() => {
    return cart
      .map((item) => {
        const product = findCartProduct(item, products);

        if (!product) return null;

        return {
          ...item,
          product,
        };
      })
      .filter(Boolean);
  }, [cart, products]);

  // Total quantity
  const totalItems = cart.reduce((total, item) => total + item.quantity, 0);

  // Update quantity
  const updateQuantity = (id, change) => {
    setCart((previous) =>
      previous.map((item) =>
        item.productId === id
          ? {
              ...item,
              quantity: Math.max(1, Number(item.quantity || 1) + change),
            }
          : item,
      ),
    );
  };

  // Remove item
  const removeItem = (id) => {
    setCart((previous) => previous.filter((item) => item.productId !== id));
  };

  // Clear cart
  const clearCart = () => {
    setCart([]);
  };

  // Product image path
  const getImage = (product) => {
    if (!product.imageUrl) {
      return "https://placehold.co/300x220/f0eee7/20364c?text=GramSupply";
    }

    return product.imageUrl.startsWith("http")
      ? product.imageUrl
      : product.imageUrl.startsWith("/")
        ? product.imageUrl
        : `/${product.imageUrl}`;
  };

  return (
    <>
      <Navbar />

      <main className="cart-page">
        {/* PAGE HEADING */}
        <section className="cart-heading">
          <div>
            <span className="cart-eyebrow">YOUR PROCUREMENT LIST</span>

            <h1>
              Selected <em>Products.</em>
            </h1>

            <p>
              Review the products selected for your institutional requirements
              before submitting an enquiry.
            </p>
          </div>

          <div className="cart-count">
            <ShoppingBag size={22} />
            <div>
              <strong>{totalItems}</strong>
              <span>Items selected</span>
            </div>
          </div>
        </section>

        {/* LOADING */}
        {loading && (
          <div className="cart-message">Loading your selected products...</div>
        )}

        {/* API ERROR */}
        {!loading && error && (
          <div className="cart-message cart-error">
            {error}
            <button onClick={() => window.location.reload()}>Try again</button>
          </div>
        )}

        {/* EMPTY CART */}
        {!loading && !error && cart.length === 0 && (
          <section className="empty-cart">
            <div className="empty-cart-icon">
              <ShoppingBag size={35} strokeWidth={1.4} />
            </div>

            <span className="cart-eyebrow">YOUR LIST IS WAITING</span>

            <h2>No products selected yet.</h2>

            <p>
              Explore our catalogue and add products that match your
              institution's requirements.
            </p>

            <Link to="/products" className="cart-primary-btn">
              Explore catalogue
              <ArrowRight size={18} />
            </Link>
          </section>
        )}

        {/* CART CONTENT */}
        {!loading && !error && cart.length > 0 && (
          <div className="cart-layout">
            <section className="cart-items-section">
              <div className="cart-list-heading">
                <h2>Selected products</h2>

                <button className="clear-cart-btn" onClick={clearCart}>
                  Clear list
                </button>
              </div>

              {cartProducts.length > 0 ? (
                <div className="cart-list">
                  {cartProducts.map((item) => (
                    <article className="cart-item" key={item.productId}>
                      <div className="cart-item-image">
                        <img
                          src={getImage(item.product)}
                          alt={item.product.name}
                          onError={(e) => {
                            e.currentTarget.onerror = null;
                            e.currentTarget.src =
                              "https://placehold.co/300x220/f0eee7/20364c?text=GramSupply";
                          }}
                        />
                      </div>

                      <div className="cart-item-info">
                        <span className="cart-item-category">
                          {item.product.categoryName || "Institutional product"}
                        </span>

                        <h3>{item.product.name}</h3>

                        <p>
                          {item.product.description ||
                            "Product specifications available on request."}
                        </p>

                        <strong className="cart-price">
                          {item.product.price == null
                            ? "Contact for price"
                            : `₹${Number(item.product.price).toLocaleString("en-IN")}`}
                        </strong>
                      </div>

                      <div className="cart-item-controls">
                        <span>Quantity</span>

                        <div className="quantity-control">
                          <button
                            onClick={() => updateQuantity(item.productId, -1)}
                            aria-label="Decrease quantity"
                          >
                            <Minus size={14} />
                          </button>

                          <strong>{item.quantity}</strong>

                          <button
                            onClick={() => updateQuantity(item.productId, 1)}
                            aria-label="Increase quantity"
                          >
                            <Plus size={14} />
                          </button>
                        </div>

                        <button
                          className="remove-btn"
                          onClick={() => removeItem(item.productId)}
                        >
                          <Trash2 size={15} />
                          Remove
                        </button>
                      </div>
                    </article>
                  ))}
                </div>
              ) : (
                <div className="cart-message">
                  Some saved products are no longer available in the catalogue.
                  Remove the outdated entries or check your product records.
                  <button onClick={clearCart}>Clear saved list</button>
                </div>
              )}
            </section>

            {/* ENQUIRY SUMMARY */}
            <aside className="cart-summary">
              <div className="summary-heading">
                <PackageCheck size={23} />
                <h2>Enquiry summary</h2>
              </div>

              <div className="summary-row">
                <span>Different products</span>
                <strong>{cartProducts.length}</strong>
              </div>

              <div className="summary-row">
                <span>Total quantity</span>
                <strong>{totalItems}</strong>
              </div>

              <div className="summary-divider"></div>

              <p className="summary-note">
                GramSupply follows an enquiry-based procurement process. Final
                prices and product specifications can be confirmed through your
                enquiry.
              </p>

              <Link to="/checkout" className="summary-checkout-btn">
                Proceed to checkout
                <ArrowRight size={17} />
              </Link>

              <Link to="/enquiry" className="summary-enquiry-btn">
                Submit product enquiry
                <ArrowRight size={17} />
              </Link>

              <Link to="/products" className="summary-continue">
                Continue exploring products
              </Link>
            </aside>
          </div>
        )}
      </main>
    </>
  );
}

export default Cart;

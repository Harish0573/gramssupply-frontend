import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  ShoppingCart,
  ArrowLeft,
  Truck,
  ShieldCheck,
  Package,
  CheckCircle
} from "lucide-react";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { fetchProduct, cartEntry, sameCartItem } from "../utils/catalog";
import "./ProductDetails.css";

function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  // load exactly the product whose id is in the URL
  useEffect(() => {
    let alive = true;
    setLoading(true);
    window.scrollTo(0, 0);
    fetchProduct(id).then((p) => {
      if (!alive) return;
      setProduct(p);
      setLoading(false);
    });
    return () => { alive = false; };
  }, [id]);

  const addToCart = () => {
    const cart = JSON.parse(
      localStorage.getItem("jr_cart") || "[]"
    );

    const existing = cart.find((item) => sameCartItem(item, product));

    if (existing) {
      existing.quantity += 1;
    } else {
      cart.push(cartEntry(product));
    }

    localStorage.setItem(
      "jr_cart",
      JSON.stringify(cart)
    );
    window.dispatchEvent(new Event("cart-updated"));

    alert("Product added to cart!");
  };

  const buyNow = () => {
    localStorage.setItem(
      "jr_buynow",
      JSON.stringify([cartEntry(product)])
    );

    navigate("/checkout?buy=1");
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <h2 style={{ padding: "40px 24px" }}>Loading product...</h2>
      </>
    );
  }

  if (!product) {
    return (
      <>
        <Navbar />
        <h2>Product not found</h2>
        <Link to="/products">Back to Products</Link>
      </>
    );
  }

  const numericPrice = Number(product.price) || 0;
  const hasValidPrice = numericPrice > 0;

  return (
    <>
      <Navbar />

      <main className="details-container">
        <Link to="/products" className="back-link">
          <ArrowLeft size={18} />
          Back to Products
        </Link>

        {/* PRODUCT MAIN SECTION */}
        <div className="details-layout">
          <div className="details-image">
            <img
              src={product.image}
              alt={product.name}
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src =
                  "https://placehold.co/600x450?text=Product+Image";
              }}
            />
          </div>

          <div className="details-info">
            <span className="product-category">
              {product.category}
            </span>

            <h1>{product.name}</h1>

            <p>{product.description}</p>

            <div className="product-meta">
              <span>
                Brand: {product.brand || "Not specified"}
              </span>

              <span>
                Model: {product.model || "Not specified"}
              </span>
            </div>

            <div className="details-price-box">
              {hasValidPrice ? (
                <>
                  <h2 className="product-price">
                    ₹{numericPrice.toLocaleString("en-IN")}
                  </h2>

                  <span className="price-note">
                    Demo catalogue price · Per unit
                  </span>
                </>
              ) : (
                <>
                  <h2 className="product-price">Price on request</h2>

                  <span className="price-note">
                    Contact us for a quote
                  </span>
                </>
              )}
            </div>

            <div className="availability">
              <CheckCircle size={18} />
              {product.availability || "Availability on request"}
            </div>

            <div className="details-buttons">
              <button
                className="details-cart-btn"
                onClick={addToCart}
              >
                <ShoppingCart size={19} />
                Add to Cart
              </button>

              <button
                className="details-buy-btn"
                onClick={buyNow}
              >
                Buy Now
              </button>
            </div>

            <Link
              to="/cart"
              className="details-enquiry-btn"
            >
              View Shopping Cart
            </Link>
          </div>
        </div>

        {/* PRODUCT HIGHLIGHTS */}
        <section className="product-section">
          <h2>Product Highlights</h2>

          <ul className="highlights-list">
            {(product.highlights || []).map(
              (item, index) => (
                <li key={index}>
                  <CheckCircle size={18} />
                  {item}
                </li>
              )
            )}
          </ul>
        </section>

        {/* PRODUCT SPECIFICATIONS */}
        <section className="product-section">
          <h2>Technical Specifications</h2>

          <div className="specifications-table">
            {(product.specifications || []).map(
              (spec, index) => (
                <div
                  className="spec-row"
                  key={index}
                >
                  <strong>{spec.label}</strong>
                  <span>{spec.value}</span>
                </div>
              )
            )}
          </div>
        </section>

        {/* DELIVERY AND WARRANTY */}
        <section className="product-section">
          <h2>Additional Information</h2>

          <div className="additional-info-grid">
            <div className="info-card">
              <Truck size={25} />
              <h3>Delivery</h3>
              <p>{product.delivery || "Contact supplier for delivery details"}</p>
            </div>

            <div className="info-card">
              <ShieldCheck size={25} />
              <h3>Warranty</h3>
              <p>{product.warranty || "Confirm with supplier"}</p>
            </div>

            <div className="info-card">
              <Package size={25} />
              <h3>Return Policy</h3>
              <p>{product.returnPolicy || "Confirm with supplier"}</p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

export default ProductDetails;
import { useEffect, useState } from "react";
import { isWished, toggleWishlist } from "../utils/wishlist";
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { ShoppingCart, Heart, ArrowUpRight, Star } from "lucide-react";
import { cartEntry } from "../utils/catalog";
import "./ProductCard.css";

function ProductCard({ product, onAddToCart }) {
  const navigate = useNavigate();
  const buyNow = () => {
    localStorage.setItem(
      "jr_buynow",
      JSON.stringify([cartEntry(product)]),
    );
    navigate("/checkout?buy=1");
  };
  const image =
    product.image ||
    product.imageUrl ||
    "https://placehold.co/500x400/f1f4f7/142d4e?text=GramSupply";
  const numericPrice = Number(product.price);
  const hasPrice = Number.isFinite(numericPrice) && numericPrice > 0;
  const price = hasPrice
    ? `₹${numericPrice.toLocaleString("en-IN")}`
    : product.priceLabel || "Price unavailable";
  const [wished, setWished] = useState(() => isWished(product.id));
  useEffect(() => {
    const sync = () => setWished(isWished(product.id));
    window.addEventListener("wishlist-updated", sync);
    return () => window.removeEventListener("wishlist-updated", sync);
  }, [product.id]);
  const addWishlist = () =>
    setWished(toggleWishlist({ id: product.id, name: product.name, image, price: hasPrice ? product.price : null, categoryName: product.categoryName }));

  return (
    <article className="market-product-card">
      <div className="market-product-image">
        {product.badge && <span className="product-badge">{product.badge}</span>}
        <button
          className={`product-wishlist ${wished ? "wished" : ""}`}
          onClick={addWishlist}
          aria-label={`${wished ? "Remove" : "Save"} ${product.name} ${wished ? "from" : "to"} wishlist`}
        >
          <Heart size={18} fill={wished ? "currentColor" : "none"} />
        </button>
        <Link to={`/product/${product.id}`} aria-label={`View ${product.name}`}>
          <img
            src={image}
            alt={product.name}
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src =
                "https://placehold.co/500x400/f1f4f7/142d4e?text=Product+Image";
            }}
          />
        </Link>
      </div>
      <div className="market-product-info">
        <span className="market-product-category">
          {product.category || product.categoryName || "Institutional supplies"}
        </span>
        <Link to={`/product/${product.id}`} className="market-product-name">
          {product.name}
        </Link>
        <p className="market-product-description">
          {product.description ||
            "Reliable equipment for everyday institutional requirements."}
        </p>
        <div className="market-product-rating">
          <span>
            <Star size={13} fill="currentColor" /> New
          </span>
          <small>Product information available</small>
        </div>
        <div className="market-product-bottom">
          <div className="market-product-price">
            <span className="price-line">
              <strong>
                {price}
              </strong>
              {hasPrice && product.mrp > product.price && (
                <>
                  <del>₹{Number(product.mrp).toLocaleString("en-IN")}</del>
                  <em>{product.pct}% OFF</em>
                </>
              )}
            </span>
            <small>
  {hasPrice ? "Demo catalogue price" : "Price currently unavailable"}
</small>
          </div>
          <button
            className="market-add-button"
            onClick={() => onAddToCart(product)}
          >
            <ShoppingCart size={16} /> Add
          </button>
        </div>
        <button className="market-buy-button" onClick={buyNow}>
          Buy now
        </button>
        <Link to={`/product/${product.id}`} className="market-view-link">
          View product <ArrowUpRight size={15} />
        </Link>
      </div>
    </article>
  );
}
export default ProductCard;

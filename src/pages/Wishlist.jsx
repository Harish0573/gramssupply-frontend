import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Heart, ShoppingCart, Trash2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthContext";
import { getWishlist, syncWishlist, toggleWishlist } from "../utils/wishlist";
import { cartEntry, sameCartItem } from "../utils/catalog";
import "./Wishlist.css";

const inr = (n) => `₹${Number(n).toLocaleString("en-IN")}`;

function Wishlist() {
  const { t } = useTranslation();
  const [items, setItems] = useState(getWishlist());
  const [msg, setMsg] = useState("");
  const { user } = useAuth();
  useEffect(() => { if (user) syncWishlist(user); }, [user]);

  useEffect(() => {
    const sync = () => setItems(getWishlist());
    window.addEventListener("wishlist-updated", sync);
    return () => window.removeEventListener("wishlist-updated", sync);
  }, []);

  const toBag = (p) => {
    const cart = JSON.parse(localStorage.getItem("jr_cart") || "[]");
    const f = cart.find((i) => sameCartItem(i, p));
    if (f) f.quantity = Number(f.quantity || 0) + 1; else cart.push(cartEntry(p));
    localStorage.setItem("jr_cart", JSON.stringify(cart));
    window.dispatchEvent(new Event("cart-updated"));
    setMsg(`${p.name} ${t("added to bag")}`);
    setTimeout(() => setMsg(""), 2200);
  };

  return (
    <>
      <Navbar />
      <main className="wl-page">
        <header className="wl-head">
          <div><p>{t("MY WISHLIST")}</p><h1>{t("Saved products")}</h1></div>
          <span>{items.length} {t("items")}</span>
        </header>
        {msg && <div className="wl-msg" role="status">{msg} · <Link to="/cart">{t("View bag")}</Link></div>}
        {items.length === 0 ? (
          <div className="wl-empty">
            <Heart size={54} />
            <h2>{t("Your wishlist is empty")}</h2>
            <p>{t("Tap the heart on any product to save it here.")}</p>
            <Link to="/products" className="wl-btn solid">{t("Browse products")}</Link>
          </div>
        ) : (
          <div className="wl-grid">
            {items.map((p) => (
              <article className="wl-card" key={p.id}>
                <Link to={`/product/${p.id}`} className="wl-img"><img src={p.image} alt={p.name} loading="lazy" /></Link>
                <div className="wl-body">
                  {p.categoryName && <small>{p.categoryName}</small>}
                  <Link to={`/product/${p.id}`} className="wl-name">{p.name}</Link>
                  <strong>{p.price ? inr(p.price) : t("Get a quote")}</strong>
                  <div className="wl-actions">
                    <button type="button" className="wl-btn solid" onClick={() => toBag(p)}><ShoppingCart size={17} /> {t("Add to bag")}</button>
                    <button type="button" className="wl-btn line" onClick={() => toggleWishlist(p)} aria-label={`Remove ${p.name}`}><Trash2 size={17} /></button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </main>
    </>
  );
}
export default Wishlist;

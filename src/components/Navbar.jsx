import React, { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Search,
  ShoppingCart,
  ChevronDown,
  MapPin,
  UserRound,
  LayoutGrid,
  Package,
  LogOut,
  Info,
  Headphones,
  FileText,
  Heart,
  Settings as SettingsIcon,
} from "lucide-react";
import { getWishlist } from "../utils/wishlist";
import { useAuth } from "../context/AuthContext";
import categories from "../data/categories";
import { useTranslation } from "react-i18next";
import useCountdown, { pad } from "./useCountdown";
import "./Navbar.css";

// short names for the icon row, the full name is still used for the link
const shortNames = {
  "Cleaning & Sanitation": "Cleaning",
  "Street & Outdoor Lighting": "Lighting",
  "CCTV & Security": "CCTV",
  "Computers & Office Technology": "Computers",
  "Water Systems": "Water",
  Furniture: "Furniture",
  "Playground & Open Gym": "Playground",
  "Village Infrastructure": "Infrastructure",
  "Power, Solar & Safety": "Solar & Safety",
};

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [searchText, setSearchText] = useState("");
  const [cartCount, setCartCount] = useState(0);
  const [wishCount, setWishCount] = useState(() => getWishlist().length);
  useEffect(() => {
    const sync = () => setWishCount(getWishlist().length);
    window.addEventListener("wishlist-updated", sync);
    window.addEventListener("storage", sync);
    return () => { window.removeEventListener("wishlist-updated", sync); window.removeEventListener("storage", sync); };
  }, []);
  const [openMenu, setOpenMenu] = useState(null); // "login" | "more" | "location" | null
  const [pincode, setPincode] = useState(
    () => localStorage.getItem("jr_pincode") || "",
  );
  const [pinInput, setPinInput] = useState("");
  const [pinError, setPinError] = useState("");
  const headerRef = useRef(null);
  const left = useCountdown();
  const { t, i18n } = useTranslation();
  const isMr = i18n.language === "mr";

  const activeCategory = new URLSearchParams(location.search).get("category");
  const onProducts = location.pathname === "/products";

  useEffect(() => {
    const refreshCart = () => {
      try {
        const items = JSON.parse(localStorage.getItem("jr_cart") || "[]");
        setCartCount(
          items.reduce((sum, item) => sum + Number(item.quantity || 0), 0),
        );
      } catch {
        setCartCount(0);
      }
    };
    refreshCart();
    window.addEventListener("cart-updated", refreshCart);
    window.addEventListener("storage", refreshCart);
    return () => {
      window.removeEventListener("cart-updated", refreshCart);
      window.removeEventListener("storage", refreshCart);
    };
  }, []);

  // close any open dropdown when clicking outside or pressing Escape
  useEffect(() => {
    const onClick = (e) => {
      if (headerRef.current && !headerRef.current.contains(e.target))
        setOpenMenu(null);
    };
    const onKey = (e) => e.key === "Escape" && setOpenMenu(null);
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  const toggle = (name) => setOpenMenu(openMenu === name ? null : name);

  const handleSearch = (e) => {
    e.preventDefault();
    const keyword = searchText.trim();
    if (!keyword) return;
    navigate(`/products?search=${encodeURIComponent(keyword)}`);
  };

  const savePincode = (e) => {
    e.preventDefault();
    if (!/^\d{6}$/.test(pinInput))
      return setPinError("Enter a 6 digit PIN code");
    localStorage.setItem("jr_pincode", pinInput);
    setPincode(pinInput);
    setPinError("");
    setOpenMenu(null);
  };

  const handleLogout = async () => {
    setOpenMenu(null);
    await logout();
    navigate("/");
  };

  return (
    <header className="site-header" ref={headerRef}>
      <div className="sale-strip">
        <div className="header-container sale-strip-inner">
          <span>🪔 <b>{t("DIWALI DHAMAKA SALE")}</b> {t("— Extra ₹500 off with code")} <b>DIWALI500</b> {t("· Free delivery above ₹4,999")}</span>
          <em>{t("Ends in")} {left.d}{t("d")} {pad(left.h)}{t("h")} {pad(left.m)}{t("m")} {pad(left.s)}{t("s")}</em>
        </div>
      </div>
      <div className="main-header">
        <div className="header-container main-header-inner">
          <Link to="/" className="brand-lockup">
            <span className="brand-mark">G</span>
            <span className="brand-copy">
              <strong>
                GramSupply<span>.</span>
              </strong>
              <small>Institutional marketplace</small>
            </span>
          </Link>

          <form className="header-search" onSubmit={handleSearch}>
            <Search size={20} />
            <input
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              placeholder={t("Search for lights, CCTV, furniture and more")}
              aria-label="Search products"
            />
          </form>

          <nav className="header-actions" aria-label="Account">
            {!user && (
            <button type="button" className="lang-toggle" onClick={() => i18n.changeLanguage(isMr ? "en" : "mr")} aria-label="Change language">
              <b className={!isMr ? "on" : ""}>EN</b><b className={isMr ? "on" : ""}>मराठी</b>
            </button>
            )}
            {user ? (
              <Link to="/account" className="header-link" aria-label="My profile">
                <UserRound size={22} />
                <span>{user.name.split(" ")[0]}</span>
              </Link>
            ) : (
            <div className="dropdown">
              <button
                className="header-link"
                onClick={() => toggle("login")}
                aria-expanded={openMenu === "login"}
              >
                <UserRound size={22} />
                <span>{user ? user.name.split(" ")[0] : t("Login")}</span>
                <ChevronDown
                  size={15}
                  className={openMenu === "login" ? "flip" : ""}
                />
              </button>
              {openMenu === "login" && (
                <div className="dropdown-panel">
                  {user ? (
                    <>
                      <p className="panel-head">
                        {user.name}
                        <small>Customer ID: {user.customerId}</small>
                      </p>
                      <Link to="/account" onClick={() => setOpenMenu(null)}>
                        <UserRound size={16} /> My profile
                      </Link>
                      <Link to="/account" onClick={() => setOpenMenu(null)}>
                        <Package size={16} /> My orders
                      </Link>
                      <Link to="/wishlist" onClick={() => setOpenMenu(null)}>
                        <Heart size={16} /> {t("Wishlist")}{wishCount > 0 ? ` (${wishCount})` : ""}
                      </Link>
                      <Link to="/settings" onClick={() => setOpenMenu(null)}>
                        <SettingsIcon size={16} /> {t("Settings")}
                      </Link>
                      <button onClick={handleLogout}>
                        <LogOut size={16} /> {t("Logout")}
                      </button>
                    </>
                  ) : (
                    <>
                      <p className="panel-head">
                        New customer?
                        <Link
                          to="/login"
                          className="panel-signup"
                          onClick={() => setOpenMenu(null)}
                        >
                          {t("Sign up")}
                        </Link>
                      </p>
                      <Link to="/login" onClick={() => setOpenMenu(null)}>
                        <UserRound size={16} /> {t("Login")}
                      </Link>
                      <Link to="/account" onClick={() => setOpenMenu(null)}>
                        <Package size={16} /> My orders
                      </Link>
                    </>
                  )}
                </div>
              )}
            </div>
            )}

            <div className="dropdown location">
              <button
                className="header-link location-btn"
                onClick={() => toggle("location")}
                aria-expanded={openMenu === "location"}
              >
                <MapPin size={18} />
                <span>
                  {pincode ? <>{t("Delivering to")} <b>{pincode}</b></> : <>{t("Set delivery location")}</>}
                </span>
                <ChevronDown
                  size={15}
                  className={openMenu === "location" ? "flip" : ""}
                />
              </button>
              {openMenu === "location" && (
                <form className="dropdown-panel pin-panel" onSubmit={savePincode}>
                  <label htmlFor="pin">{t("Enter your PIN code")}</label>
                  <input
                    id="pin"
                    value={pinInput}
                    onChange={(e) =>
                      setPinInput(e.target.value.replace(/\D/g, ""))
                    }
                    inputMode="numeric"
                    maxLength={6}
                    placeholder={t("6 digit PIN code")}
                    autoFocus
                  />
                  {pinError && <em>{pinError}</em>}
                  <button type="submit">{t("Apply")}</button>
                </form>
              )}
            </div>

            <div className="dropdown">
              <button
                className="header-link"
                onClick={() => toggle("more")}
                aria-expanded={openMenu === "more"}
              >
                <span>{t("More")}</span>
                <ChevronDown
                  size={15}
                  className={openMenu === "more" ? "flip" : ""}
                />
              </button>
              {openMenu === "more" && (
                <div className="dropdown-panel">
                  <Link to="/about" onClick={() => setOpenMenu(null)}>
                    <Info size={16} /> {t("About us")}
                  </Link>
                  <Link to="/contact" onClick={() => setOpenMenu(null)}>
                    <Headphones size={16} /> {t("Contact us")}
                  </Link>
                  <Link to="/enquiry" onClick={() => setOpenMenu(null)}>
                    <FileText size={16} /> Bulk enquiry
                  </Link>
                </div>
              )}
            </div>

            <Link to="/cart" className="header-link cart-link">
              <span className="cart-icon-wrap">
                <ShoppingCart size={23} />
                {cartCount > 0 && <i>{cartCount}</i>}
              </span>
              <span>{t("Cart")}</span>
            </Link>
          </nav>
        </div>
      </div>

      <nav className="category-row" aria-label="Categories">
        <div className="header-container category-row-inner">
          <Link to="/products" className="cat-item sale-link">
            <span>{t("Diwali Sale")}</span>
            <i>HOT</i>
          </Link>
          <Link
            to="/products"
            className={`cat-item ${onProducts && !activeCategory ? "active" : ""}`}
          >
            <LayoutGrid size={26} />
            <span>{t("All")}</span>
          </Link>
          {categories.map(({ id, name, icon: Icon }) => (
            <Link
              key={id}
              to={`/products?category=${encodeURIComponent(name)}`}
              className={`cat-item ${activeCategory === name ? "active" : ""}`}
            >
              <Icon size={26} />
              <span>{t(shortNames[name] || name)}</span>
            </Link>
          ))}
        </div>
      </nav>
    </header>
  );
}

export default Navbar;

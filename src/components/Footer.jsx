import React from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import categories from "../data/categories";
import "./Footer.css";

// One footer for every page. Links go to real pages; policy pages are in pages/Policy.jsx
function Footer() {
  const { t } = useTranslation();
  const shop = categories.slice(0, 5);
  return (
    <footer className="gf">
      <div className="gf-inner">
        <div className="gf-brand">
          <strong>GramSupply<span>.</span></strong>
          <p>{t("Shubh Deepavali! Supplies for institutions, villages and offices.")}</p>
          <Link to="/contact" className="gf-help">{t("Need help? Contact us")} →</Link>
        </div>
        <nav aria-label={t("Shop")}>
          <h4>{t("Shop")}</h4>
          <Link to="/products">{t("All products")}</Link>
          {shop.map((c) => <Link key={c.id} to={`/products?category=${encodeURIComponent(c.name)}`}>{t(c.name)}</Link>)}
        </nav>
        <nav aria-label={t("Help")}>
          <h4>{t("Help")}</h4>
          <Link to="/contact">{t("Contact us")}</Link>
          <Link to="/enquiry">{t("Bulk enquiry")}</Link>
          <Link to="/shipping-returns">{t("Shipping & Returns")}</Link>
          <Link to="/account">{t("My account")}</Link>
        </nav>
        <nav aria-label={t("Company")}>
          <h4>{t("Company")}</h4>
          <Link to="/about">{t("About us")}</Link>
          <Link to="/terms">{t("Terms & Conditions")}</Link>
          <Link to="/privacy">{t("Privacy Policy")}</Link>
        </nav>
      </div>
      <div className="gf-bottom">© {new Date().getFullYear()} GramSupply. {t("All rights reserved.")}</div>
    </footer>
  );
}
export default Footer;

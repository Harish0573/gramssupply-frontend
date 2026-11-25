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
          <p>{t("Supplies for institutions, villages and offices.")}</p>
          <Link to="/contact" className="gf-help">{t("Need help? Contact us")} →</Link>

          <div className="gf-social">
            <a href="https://wa.me/919999999999" target="_blank" rel="noreferrer" aria-label="WhatsApp">
              <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8s-.4-.1-.6.1-.6.8-.8 1-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.2-.4.2-.4.6-1.2.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.7 11.7 11.7 0 0 0 4.5 4 5.2 5.2 0 0 0 3.3.7 2.8 2.8 0 0 0 1.9-1.3 2.3 2.3 0 0 0 .2-1.3c-.1-.1-.2-.2-.4-.3z" /></svg>
            </a>
            <a href="https://www.instagram.com/your_page" target="_blank" rel="noreferrer" aria-label="Instagram">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" /></svg>
            </a>
            <a href="https://www.facebook.com/your_page" target="_blank" rel="noreferrer" aria-label="Facebook">
              <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M14 8h3V4h-3c-2.8 0-4 1.8-4 4.3V11H7v4h3v7h4v-7h3l.5-4H14V8.6c0-.4.2-.6.6-.6z" /></svg>
            </a>
          </div>
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

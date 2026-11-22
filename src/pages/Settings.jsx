import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Bell, Globe, Info, Trash2, Type, UserRound } from "lucide-react";
import { useTranslation } from "react-i18next";
import Navbar from "../components/Navbar";
import { defaults, getSettings, saveSettings } from "../settings";
import { clearWishlist } from "../utils/wishlist";
import "./Settings.css";

const sizes = [[0.9, "Small"], [1, "Normal"], [1.1, "Large"], [1.2, "Extra large"]];

function Settings() {
  const { t, i18n } = useTranslation();
  const [s, setS] = useState(getSettings());
  const [pin, setPin] = useState(localStorage.getItem("jr_pincode") || "");
  const [note, setNote] = useState("");
  const set = (patch) => setS(saveSettings({ ...s, ...patch }));
  const flash = (m) => { setNote(m); setTimeout(() => setNote(""), 2200); };
  const savePin = () => {
    if (pin && !/^\d{6}$/.test(pin)) return flash(t("Enter a 6 digit PIN code"));
    pin ? localStorage.setItem("jr_pincode", pin) : localStorage.removeItem("jr_pincode");
    flash(t("Saved"));
  };
  const Toggle = ({ k, label, hint }) => (
    <label className="st-row"><span><b>{t(label)}</b><small>{t(hint)}</small></span>
      <input type="checkbox" checked={!!s[k]} onChange={(e) => set({ [k]: e.target.checked })} /><i aria-hidden="true" /></label>
  );

  return (
    <>
      <Navbar />
      <main className="st-page">
        <header><p>{t("SETTINGS")}</p><h1>{t("Website settings")}</h1></header>
        {note && <div className="st-note" role="status">{note}</div>}
        <div className="st-grid">
          <section className="st-card">
            <h2><Globe size={22} /> {t("Language")}</h2>
            <div className="st-seg">
              {[["en", "English"], ["mr", "मराठी"]].map(([k, n]) => <button key={k} type="button" className={i18n.language === k ? "on" : ""} onClick={() => i18n.changeLanguage(k)}>{n}</button>)}
            </div>
          </section>
          <section className="st-card">
            <h2><Type size={22} /> {t("Display")}</h2>
            <p className="st-hint">{t("Text and page size")}</p>
            <div className="st-seg">{sizes.map(([z, n]) => <button key={z} type="button" className={s.zoom === z ? "on" : ""} onClick={() => set({ zoom: z })}>{t(n)}</button>)}</div>
            <Toggle k="reduceMotion" label="Reduce animations" hint="Turns off twinkling lights and slide effects" />
          </section>
          <section className="st-card">
            <h2><Bell size={22} /> {t("Notifications")}</h2>
            <Toggle k="offers" label="Offers & sale alerts" hint="Diwali deals, coupons and new arrivals" />
            <Toggle k="orderUpdates" label="Order updates" hint="Confirmation, shipping and delivery" />
          </section>
          <section className="st-card">
            <h2><UserRound size={22} /> {t("Delivery & account")}</h2>
            <label className="st-field">{t("Delivery PIN code")}
              <span><input value={pin} maxLength={6} inputMode="numeric" onChange={(e) => setPin(e.target.value.replace(/\D/g, ""))} placeholder="440001" /><button type="button" onClick={savePin}>{t("Save")}</button></span>
            </label>
            <Link to="/account" className="st-link">{t("Edit profile & address")} →</Link>
          </section>
          <section className="st-card">
            <h2><Trash2 size={22} /> {t("Your data on this device")}</h2>
            <div className="st-btns">
              <button type="button" onClick={() => { clearWishlist(); flash(t("Wishlist cleared")); }}>{t("Clear wishlist")}</button>
              <button type="button" onClick={() => { localStorage.removeItem("jr_cart"); window.dispatchEvent(new Event("cart-updated")); flash(t("Bag emptied")); }}>{t("Empty bag")}</button>
              <button type="button" onClick={() => { setS(saveSettings({ ...defaults })); flash(t("Settings reset")); }}>{t("Reset settings")}</button>
            </div>
          </section>
          <section className="st-card">
            <h2><Info size={22} /> {t("About GramSupply")}</h2>
            <div className="st-links"><Link to="/about">{t("About us")}</Link><Link to="/contact">{t("Contact us")}</Link><Link to="/enquiry">{t("Bulk enquiry")}</Link></div>
          </section>
        </div>
      </main>
    </>
  );
}
export default Settings;

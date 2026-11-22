import React, { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, BadgeCheck, Check, ChevronLeft, ChevronRight, Copy, Headset, Heart, Plus, ShieldCheck, Star, Truck } from "lucide-react";
import { useTranslation } from "react-i18next";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import useCountdown, { pad } from "../components/useCountdown";
import { getWishlist, toggleWishlist } from "../utils/wishlist";
import categories from "../data/categories";
import { fetchProducts, cartEntry, sameCartItem } from "../utils/catalog";
import "./Home.css";

const slides = [
  { tag: "DIWALI DHAMAKA SALE", big: "Up to 60% off", line: "Light up every corner of your village & office", cat: "Street & Outdoor Lighting", img: "/categories/lighting.jpg", fx: 70, pct: "60%" },
  { tag: "SAFE DIWALI", big: "Flat 45% off", line: "CCTV, fire safety & solar power at festive prices", cat: "CCTV & Security", img: "/categories/cctv.jpg", fx: 40, pct: "45%" },
  { tag: "NAYA OFFICE, NAYA SAAL", big: "Min. 35% off", line: "Chairs, desks, computers and cupboards", cat: "Furniture", img: "/categories/furniture.jpg", fx: 50, pct: "35%" },
];
const coupons = [
  { code: "DIWALI500", head: "Flat ₹500 off", sub: "On orders above ₹5,000" },
  { code: "BULK8", head: "Extra 8% off", sub: "On 10+ units of one product" },
  { code: "FIRST10", head: "10% off", sub: "On your first order, up to ₹1,500" },
  { code: "FREESHIP", head: "Free delivery", sub: "On orders above ₹4,999" },
];
const offerPct = { 1: 40, 2: 55, 3: 45, 4: 30, 5: 35, 6: 50, 7: 40, 8: 38, 9: 42 };
// shown only when the backend is not running, so the page is never empty
const demo = [
  ["Twin Dustbin Set with Mop Trolley", 1, 2499], ["Solar Street Light 60W", 2, 7999], ["Bullet CCTV Camera 4MP", 3, 3299],
  ["Desktop Computer with Printer", 4, 38500], ["Commercial RO Plant 500 LPH", 5, 79999], ["Ergonomic Mesh Office Chair", 6, 6499],
  ["Outdoor Playground Slide", 7, 18999], ["Cast Iron Manhole Cover", 8, 1899], ["ABC Fire Extinguisher 6kg", 9, 1299],
].map(([name, cid, price], i) => ({ id: `demo-${i}`, name, price, categoryName: categories[cid - 1].name, demo: true, rating: (4 + ((i * 3) % 9) / 10).toFixed(1), reviews: 120 + i * 47 }));

const inr = (n) => `₹${Number(n).toLocaleString("en-IN")}`;
const short = (n) => n.split(/[ ,&]+/)[0];

function Home() {
  const { t: tr } = useTranslation();
  const [products, setProducts] = useState([]);
  const [slide, setSlide] = useState(0);
  const [tab, setTab] = useState("All");
  const [copied, setCopied] = useState("");
  const [toast, setToast] = useState("");
  const [wish, setWish] = useState(() => { try { return new Set(JSON.parse(localStorage.getItem("jr_wishlist") || "[]").map((w) => w.id)); } catch { return new Set(); } });
  const shelf = useRef(null);
  const midnight = useMemo(() => { const d = new Date(); d.setHours(24, 0, 0, 0); return d.getTime(); }, []);
  const t = useCountdown(midnight);

  useEffect(() => {
    fetchProducts().then((rows) => setProducts(rows));
  }, []);
  useEffect(() => { const id = setInterval(() => setSlide((s) => (s + 1) % slides.length), 6000); return () => clearInterval(id); }, []);
  useEffect(() => { if (!toast) return undefined; const id = setTimeout(() => setToast(""), 2400); return () => clearTimeout(id); }, [toast]);

  const list = (products.length ? products : demo).map((p, i) => {
    const cat = categories.find((c) => c.name === p.categoryName);
    const pct = Math.min(60, Math.max(5, Number(p.discountPercent ?? offerPct[cat?.id] ?? 20)));
    const has = Number(p.price) > 0;
    return { ...p, pct, has, mrp: has ? Math.round(Number(p.price) / (1 - pct / 100) / 10) * 10 : 0, img: p.imageUrl || p.image || cat?.image, claimed: 48 + ((i * 17) % 45), rating: p.rating || (4 + ((i * 3) % 9) / 10).toFixed(1), reviews: p.reviews || 80 + i * 31 };
  });
  const to = (p) => (p.demo ? `/products?category=${encodeURIComponent(p.categoryName)}` : `/product/${p.id}`);
  const shown = tab === "All" ? list : list.filter((p) => p.categoryName === tab);

  const copy = (code) => { navigator.clipboard?.writeText(code).catch(() => {}); setCopied(code); setTimeout(() => setCopied(""), 1800); };
  const add = (p) => {
    if (p.demo) return setToast("Start the backend to add real products to your bag");
    const cart = JSON.parse(localStorage.getItem("jr_cart") || "[]");
    const f = cart.find((i) => sameCartItem(i, p));
    if (f) f.quantity = Number(f.quantity || 0) + 1; else cart.push(cartEntry(p));
    localStorage.setItem("jr_cart", JSON.stringify(cart));
    window.dispatchEvent(new Event("cart-updated"));
    setToast(`${tr(p.name)} ${tr("added to bag")}`);
  };
  const like = (p) => {
    toggleWishlist({ id: p.id, name: p.name, image: p.img, price: p.has ? p.price : null, categoryName: p.categoryName });
    setWish(new Set(getWishlist().map((w) => w.id)));
  };

  const Card = ({ p }) => (
    <article className="dv-card">
      <div className="dv-card-img">
        <span className="dv-off">{p.pct}% {tr("OFF")}</span>
        <button type="button" className={`dv-heart ${wish.has(p.id) ? "on" : ""}`} onClick={() => like(p)} aria-label={`Save ${p.name}`}><Heart size={22} fill={wish.has(p.id) ? "currentColor" : "none"} /></button>
        <Link to={to(p)}><img src={p.img} alt={p.name} loading="lazy" /></Link>
        <span className="dv-rate"><b>{p.rating}</b> <Star size={13} fill="currentColor" /> | {p.reviews}</span>
      </div>
      <div className="dv-card-body">
        <small>{tr(short(p.categoryName || "Supplies"))}</small>
        <small className="dv-moq">{tr("Min. order:")} {[5, 10, 20, 50][p.pct % 4]} {tr("units")}</small>
        <Link to={to(p)} className="dv-name">{tr(p.name)}</Link>
        {p.has ? <div className="dv-price"><strong>{inr(p.price)}</strong><del>{inr(p.mrp)}</del><span>({p.pct}% {tr("OFF")})</span></div> : <div className="dv-price"><strong>{tr("Get a quote")}</strong></div>}
        <div className="dv-bar"><i style={{ width: `${p.claimed}%` }} /></div>
        <small className="dv-left">{p.claimed}% {tr("claimed — hurry!")}</small>
        <button type="button" className="dv-add" onClick={() => add(p)}><Plus size={18} /> {tr("Add to bag")}</button>
      </div>
    </article>
  );

  const s = slides[slide];
  return (
    <>
      <Navbar />
      <main className="dv-home">
        <div className="dv-top">
        <aside className="dv-side" aria-label="Categories">
          <h3>{tr("Categories")}</h3>
          {categories.map((c) => <Link key={c.id} to={`/products?category=${encodeURIComponent(c.name)}`}><span>{tr(c.name)}</span><ChevronRight size={18} /></Link>)}
        </aside>
        <section className="dv-hero" key={slide}>
          <img className="dv-hero-bg" src={s.img} alt="" style={{ objectPosition: `${s.fx}% 50%` }} />
          <div className="dv-hero-ov" aria-hidden="true" />
          <div className="dv-lights" aria-hidden="true">{Array.from({ length: 28 }, (_, i) => <i key={i} style={{ "--i": i }} />)}</div>
          <div className="dv-hero-inner">
            <div className="dv-hero-copy">
              <span className="dv-tag">🪔 {tr(s.tag)}</span>
              <h1>{tr(s.big)}</h1>
              <p>{tr(s.line)}</p>
              <div className="dv-hero-cta">
                <Link to={`/products?category=${encodeURIComponent(s.cat)}`} className="dv-btn gold">{tr("Shop the sale")} <ArrowRight size={20} /></Link>
                <Link to="/enquiry" className="dv-btn ghost">{tr("Bulk order enquiry")}</Link>
              </div>
              <div className="dv-hero-note"><b>DIWALI500</b> {tr("— flat ₹500 off above ₹5,000")}</div>
            </div>
            <div className="dv-stickwrap"><span className="dv-sticker">{s.pct}<small>{tr("OFF")}</small></span></div>
          </div>
          <div className="dv-dots">{slides.map((x, i) => <button key={x.tag} type="button" className={i === slide ? "on" : ""} onClick={() => setSlide(i)} aria-label={`Offer ${i + 1}`} />)}</div>
        </section>
        </div>

        <section className="dv-coupons" aria-label="Coupons">
          {coupons.map((c) => (
            <div className="dv-coupon" key={c.code}>
              <div><strong>{tr(c.head)}</strong><small>{tr(c.sub)}</small></div>
              <button type="button" onClick={() => copy(c.code)}>{copied === c.code ? <><Check size={16} /> {tr("Copied")}</> : <>{c.code} <Copy size={16} /></>}</button>
            </div>
          ))}
        </section>

        <section className="dv-section">
          <h2 className="dv-title">{tr("Festive deals by category")}</h2>
          <div className="dv-cat-grid">
            {categories.map((c) => (
              <Link key={c.id} to={`/products?category=${encodeURIComponent(c.name)}`} className="dv-cat">
                <img src={c.image} alt="" loading="lazy" style={{ objectPosition: `${c.focus ?? 50}% 50%` }} />
                <div><strong>{tr(c.name)}</strong><span>{offerPct[c.id]}% {tr("UP TO")} {tr("OFF")}</span><em>{tr("Shop now")} <ArrowRight size={16} /></em></div>
              </Link>
            ))}
          </div>
        </section>

        <section className="dv-flash">
          <div className="dv-flash-head">
            <div><h2>{tr("⚡ Lightning deals")}</h2><p>{tr("Prices reset at midnight — grab them before they do")}</p></div>
            <div className="dv-clock">{[["HRS", t.h], ["MIN", t.m], ["SEC", t.s]].map(([l, v]) => <span key={l}><b>{pad(v)}</b>{tr(l)}</span>)}</div>
            <div className="dv-arrows"><button type="button" onClick={() => shelf.current.scrollBy({ left: -420, behavior: "smooth" })} aria-label="Previous"><ChevronLeft /></button><button type="button" onClick={() => shelf.current.scrollBy({ left: 420, behavior: "smooth" })} aria-label="Next"><ChevronRight /></button></div>
          </div>
          <div className="dv-shelf" ref={shelf}>{[...list].sort((a, b) => b.pct - a.pct).map((p) => <Card key={p.id} p={p} />)}</div>
        </section>

        <section className="dv-duo">
          <Link to="/enquiry" className="dv-banner plum"><span>{tr("REQUEST FOR QUOTATION")}</span><h3>{tr("Buying 10 or more?")}<br />{tr("Get an extra 8% off")}</h3><em>{tr("Send enquiry")} <ArrowRight size={18} /></em></Link>
          <Link to="/products?category=Power%2C%20Solar%20%26%20Safety" className="dv-banner saffron"><span>{tr("GO SOLAR THIS DIWALI")}</span><h3>{tr("Solar panels & safety gear")}<br />{tr("up to 42% off")}</h3><em>{tr("Explore now")} <ArrowRight size={18} /></em></Link>
        </section>

        <section className="dv-section">
          <h2 className="dv-title">{tr("Trending this Diwali")}</h2>
          <div className="dv-tabs">{["All", ...categories.map((c) => c.name)].map((n) => <button key={n} type="button" className={tab === n ? "on" : ""} onClick={() => setTab(n)}>{tr(n === "All" ? "All" : short(n))}</button>)}</div>
          <div className="dv-grid">{shown.length ? shown.slice(0, 8).map((p) => <Card key={p.id} p={p} />) : <p className="dv-empty">{tr("No deals here yet.")} <Link to="/enquiry">{tr("Send us an enquiry")}</Link></p>}</div>
        </section>

        <section className="dv-trust">
          {[[Truck, "Free delivery", "On orders above ₹4,999"], [ShieldCheck, "Secure payments", "Safe and easy checkout"], [BadgeCheck, "Quality checked", "Trusted institutional suppliers"], [Headset, "Help when you need it", "Call or message our team"]].map(([I, h, s2]) => <div key={h}><I size={34} /><p><strong>{tr(h)}</strong><small>{tr(s2)}</small></p></div>)}
        </section>
      </main>
      <div className={`dv-toast ${toast ? "show" : ""}`} role="status" aria-live="polite"><Check size={20} /> {toast || "Done"}<Link to="/cart">{tr("View bag")}</Link></div>
      <Footer />
    </>
  );
}
export default Home;

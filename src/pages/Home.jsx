import React, {
  useEffect,
  useMemo,
  useRef,
  useState
} from "react";

import { Link } from "react-router-dom";

import {
  ArrowRight,
  BadgeCheck,
  Check,
  ChevronLeft,
  ChevronRight,
  Copy,
  Headset,
  Heart,
  Plus,
  ShieldCheck,
  Star,
  Truck
} from "lucide-react";

import { useTranslation } from "react-i18next";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ProductBanners from "../components/ProductBanners";

import useCountdown, {
  pad
} from "../components/useCountdown";

import {
  getWishlist,
  toggleWishlist
} from "../utils/wishlist";

import categories from "../data/categories";

import {
  fetchProducts,
  cartEntry,
  sameCartItem
} from "../utils/catalog";

import "./Home.css";

// =========================================
// COUPONS
// =========================================

const coupons = [
  {
    code: "BULK8",
    head: "Extra 8% off",
    sub: "On 10+ units of one product"
  },
  {
    code: "FIRST10",
    head: "10% off",
    sub: "On your first order, up to ₹1,500"
  },
  {
    code: "GRAM200",
    head: "₹200 off",
    sub: "On orders above ₹2,000"
  },
  {
    code: "SCHOOL15",
    head: "15% off",
    sub: "For schools and institutions, above ₹10,000"
  },
  {
    code: "VILLAGE5",
    head: "5% off",
    sub: "On bulk orders of 5+ units"
  },
  {
    code: "SAVE1000",
    head: "Flat ₹1,000 off",
    sub: "On orders above ₹15,000"
  },
  {
    code: "MEGA20",
    head: "Extra 20% off",
    sub: "On selected products, up to ₹2,000"
  },
  {
    code: "FREESHIP",
    head: "Free Delivery",
    sub: "On orders above ₹4,999"
  }
];

// =========================================
// PRODUCT DISCOUNTS
// =========================================

const offerPct = {
  1: 40,
  2: 55,
  3: 45,
  4: 30,
  5: 35,
  6: 50,
  7: 40,
  8: 38,
  9: 42
};

// =========================================
// DEMO PRODUCTS
// =========================================

const demo = [
  ["Twin Dustbin Set with Mop Trolley", 1, 2499],
  ["Solar Street Light 60W", 2, 7999],
  ["Bullet CCTV Camera 4MP", 3, 3299],
  ["Desktop Computer with Printer", 4, 38500],
  ["Commercial RO Plant 500 LPH", 5, 79999],
  ["Ergonomic Mesh Office Chair", 6, 6499],
  ["Outdoor Playground Slide", 7, 18999],
  ["Cast Iron Manhole Cover", 8, 1899],
  ["ABC Fire Extinguisher 6kg", 9, 1299]
].map(([name, cid, price], i) => ({
  id: `demo-${i}`,
  name,
  price,
  categoryName: categories[cid - 1].name,
  demo: true,
  rating: (4 + ((i * 3) % 9) / 10).toFixed(1),
  reviews: 120 + i * 47
}));

// =========================================
// HELPER FUNCTIONS
// =========================================

const inr = (n) =>
  `₹${Number(n).toLocaleString("en-IN")}`;

const short = (n) =>
  n.split(/[ ,&]+/)[0];

// =========================================
// HOME COMPONENT
// =========================================

function Home() {

  const { t: tr } = useTranslation();

  const [products, setProducts] = useState([]);

  const [tab, setTab] = useState("All");

  const [copied, setCopied] = useState("");

  const [toast, setToast] = useState("");

  // =========================================
  // WISHLIST STATE
  // =========================================

  const [wish, setWish] = useState(() => {

    try {

      return new Set(
        JSON.parse(
          localStorage.getItem("jr_wishlist") || "[]"
        ).map((w) => w.id)
      );

    } catch {

      return new Set();

    }

  });

  // =========================================
  // PRODUCT SHELF REFERENCE
  // =========================================

  const shelf = useRef(null);

  // =========================================
  // COUNTDOWN TIMER
  // =========================================

  const midnight = useMemo(() => {

    const d = new Date();

    d.setHours(24, 0, 0, 0);

    return d.getTime();

  }, []);

  const t = useCountdown(midnight);

  // =========================================
  // FETCH PRODUCTS FROM BACKEND
  // =========================================

  useEffect(() => {

    fetchProducts()
      .then((rows) => {

        setProducts(rows);

      })
      .catch((error) => {

        console.error(
          "Failed to fetch products:",
          error
        );

      });

  }, []);

  // =========================================
  // TOAST TIMER
  // =========================================

  useEffect(() => {

    if (!toast) return undefined;

    const id = setTimeout(() => {

      setToast("");

    }, 2400);

    return () => clearTimeout(id);

  }, [toast]);

  // =========================================
  // PRODUCT DATA
  // =========================================

  const list = (
    products.length ? products : demo
  ).map((p, i) => {

    const cat = categories.find(
      (c) => c.name === p.categoryName
    );

    const pct = Math.min(
      60,
      Math.max(
        5,
        Number(
          p.discountPercent ??
          offerPct[cat?.id] ??
          20
        )
      )
    );

    const has = Number(p.price) > 0;

    return {

      ...p,

      pct,

      has,

      mrp: has
        ? Math.round(
            Number(p.price) /
            (1 - pct / 100) / 10
          ) * 10
        : 0,

      img:
        p.imageUrl ||
        p.image ||
        cat?.image,

      claimed: 48 + ((i * 17) % 45),

      rating:
        p.rating ||
        (4 + ((i * 3) % 9) / 10).toFixed(1),

      reviews:
        p.reviews || 80 + i * 31

    };

  });

  // =========================================
  // PRODUCT ROUTING
  // =========================================

  const to = (p) =>

    p.demo

      ? `/products?category=${encodeURIComponent(
          p.categoryName
        )}`

      : `/product/${p.id}`;

  // =========================================
  // FILTER PRODUCTS
  // =========================================

  const shown =

    tab === "All"

      ? list

      : list.filter(
          (p) => p.categoryName === tab
        );

  // =========================================
  // COPY COUPON
  // =========================================

  const copy = async (code) => {

    try {

      await navigator.clipboard.writeText(code);

      setCopied(code);

      setTimeout(() => {

        setCopied("");

      }, 1800);

    } catch {

      setToast(`Coupon code: ${code}`);

    }

  };

  // =========================================
  // ADD TO CART
  // =========================================

  const add = (p) => {

    if (p.demo) {

      return setToast(
        "Start the backend to add real products to your bag"
      );

    }

    const cart = JSON.parse(
      localStorage.getItem("jr_cart") || "[]"
    );

    const f = cart.find(
      (i) => sameCartItem(i, p)
    );

    if (f) {

      f.quantity =
        Number(f.quantity || 0) + 1;

    } else {

      cart.push(cartEntry(p));

    }

    localStorage.setItem(
      "jr_cart",
      JSON.stringify(cart)
    );

    window.dispatchEvent(
      new Event("cart-updated")
    );

    setToast(
      `${tr(p.name)} ${tr("added to bag")}`
    );

  };

  // =========================================
  // WISHLIST FUNCTION
  // =========================================

  const like = (p) => {

    toggleWishlist({

      id: p.id,

      name: p.name,

      image: p.img,

      price: p.has ? p.price : null,

      categoryName: p.categoryName

    });

    setWish(
      new Set(
        getWishlist().map((w) => w.id)
      )
    );

  };

  // =========================================
  // PRODUCT CARD COMPONENT
  // =========================================

  const Card = ({ p }) => (

    <article className="dv-card">

      {/* PRODUCT IMAGE */}

      <div className="dv-card-img">

        <span className="dv-off">

          {p.pct}% {tr("OFF")}

        </span>

        {/* WISHLIST BUTTON */}

        <button
          type="button"
          className={`dv-heart ${
            wish.has(p.id) ? "on" : ""
          }`}
          onClick={() => like(p)}
          aria-label={`Save ${p.name}`}
        >

          <Heart
            size={22}
            fill={
              wish.has(p.id)
                ? "currentColor"
                : "none"
            }
          />

        </button>

        {/* PRODUCT DETAILS LINK */}

        <Link to={to(p)}>

          <img
            src={p.img}
            alt={p.name}
            loading="lazy"
          />

        </Link>

        {/* PRODUCT RATING */}

        <span className="dv-rate">

          <b>{p.rating}</b>

          <Star
            size={13}
            fill="currentColor"
          />

          | {p.reviews}

        </span>

      </div>

      {/* PRODUCT INFORMATION */}

      <div className="dv-card-body">

        <small>

          {tr(
            short(
              p.categoryName || "Supplies"
            )
          )}

        </small>

        <small className="dv-moq">

          {tr("Min. order:")}{" "}

          {[5, 10, 20, 50][p.pct % 4]}{" "}

          {tr("units")}

        </small>

        <Link
          to={to(p)}
          className="dv-name"
        >

          {tr(p.name)}

        </Link>

        {/* PRODUCT PRICE */}

        {p.has ? (

          <div className="dv-price">

            <strong>
              {inr(p.price)}
            </strong>

            <del>
              {inr(p.mrp)}
            </del>

            <span>

              ({p.pct}% {tr("OFF")})

            </span>

          </div>

        ) : (

          <div className="dv-price">

            <strong>

              {tr("Get a quote")}

            </strong>

          </div>

        )}

        {/* PRODUCT CLAIMED BAR */}

        <div className="dv-bar">

          <i
            style={{
              width: `${p.claimed}%`
            }}
          />

        </div>

        <small className="dv-left">

          {p.claimed}%{" "}

          {tr("claimed — hurry!")}

        </small>

        {/* ADD TO CART BUTTON */}

        <button
          type="button"
          className="dv-add"
          onClick={() => add(p)}
        >

          <Plus size={18} />

          {tr("Add to bag")}

        </button>

      </div>

    </article>

  );

  // =========================================
  // MAIN HOME PAGE
  // =========================================

  return (

    <>

      {/* =====================================
          NAVBAR
      ====================================== */}

      <Navbar />

      <main className="dv-home">

        {/* =====================================
            NEW AMAZON STYLE PRODUCT BANNERS

            6 LONG PRODUCT BANNERS
            AUTOMATIC SLIDING
            MOBILE SWIPE
            HALF WINDOW RESPONSIVE
            FULL DESKTOP RESPONSIVE
        ====================================== */}

        <ProductBanners
          categories={categories}
          offerPct={offerPct}
        />

        {/* =====================================
            COUPON SECTION
        ====================================== */}

        <section
          className="dv-coupons"
          aria-label="Coupons"
        >

          {coupons.map((c) => (

            <div
              className="dv-coupon"
              key={c.code}
            >

              <div>

                <strong>

                  {tr(c.head)}

                </strong>

                <small>

                  {tr(c.sub)}

                </small>

              </div>

              <button
                type="button"
                onClick={() => copy(c.code)}
              >

                {copied === c.code ? (

                  <>

                    <Check size={16} />

                    {tr("Copied")}

                  </>

                ) : (

                  <>

                    {c.code}

                    <Copy size={16} />

                  </>

                )}

              </button>

            </div>

          ))}

        </section>

        {/* =====================================
            DESKTOP CATEGORY DEALS

            MOBILE CATEGORY BOXES REMOVED
        ====================================== */}

        <section className="dv-section">

          <h2 className="dv-title">

            {tr("Festive deals by category")}

          </h2>

          <div className="dv-cat-grid">

            {categories.map((c) => (

              <Link
                key={c.id}
                to={`/products?category=${encodeURIComponent(
                  c.name
                )}`}
                className="dv-cat"
              >

                <img
                  src={c.image}
                  alt={c.name}
                  loading="lazy"
                  style={{
                    objectPosition:
                      `${c.focus ?? 50}% 50%`
                  }}
                />

                <div>

                  <strong>

                    {tr(c.name)}

                  </strong>

                  <span>

                    {offerPct[c.id]}%{" "}

                    {tr("UP TO")}{" "}

                    {tr("OFF")}

                  </span>

                  <em>

                    {tr("Shop now")}

                    <ArrowRight size={16} />

                  </em>

                </div>

              </Link>

            ))}

          </div>

        </section>

        {/* =====================================
            WEEKEND MEGA DEALS
        ====================================== */}

        <section className="dv-flash">

          <div className="dv-flash-head">

            <div>

              <h2>

                {tr("🛒 Weekend mega deals")}

              </h2>

              <p>

                {tr(
                  "Offers end at midnight — grab them before they do"
                )}

              </p>

            </div>

            {/* COUNTDOWN CLOCK */}

            <div className="dv-clock">

              {[
                ["HRS", t.h],
                ["MIN", t.m],
                ["SEC", t.s]
              ].map(([l, v]) => (

                <span key={l}>

                  <b>{pad(v)}</b>

                  {tr(l)}

                </span>

              ))}

            </div>

            {/* PRODUCT SLIDER ARROWS */}

            <div className="dv-arrows">

              <button
                type="button"
                onClick={() =>
                  shelf.current?.scrollBy({

                    left: -420,

                    behavior: "smooth"

                  })
                }
                aria-label="Previous"
              >

                <ChevronLeft />

              </button>

              <button
                type="button"
                onClick={() =>
                  shelf.current?.scrollBy({

                    left: 420,

                    behavior: "smooth"

                  })
                }
                aria-label="Next"
              >

                <ChevronRight />

              </button>

            </div>

          </div>

          {/* MEGA DEAL PRODUCTS */}

          <div
            className="dv-shelf"
            ref={shelf}
          >

            {[...list]
              .sort((a, b) => b.pct - a.pct)
              .map((p) => (

                <Card
                  key={p.id}
                  p={p}
                />

              ))}

          </div>

        </section>

        {/* =====================================
            ADDITIONAL PROMOTIONAL BANNERS
        ====================================== */}

        <section className="dv-duo">

          {/* BULK ORDER BANNER */}

          <Link
            to="/enquiry"
            className="dv-banner plum"
          >

            <span>

              {tr("REQUEST FOR QUOTATION")}

            </span>

            <h3>

              {tr("Buying 10 or more?")}

              <br />

              {tr("Get an extra 8% off")}

            </h3>

            <em>

              {tr("Send enquiry")}

              <ArrowRight size={18} />

            </em>

          </Link>

          {/* SOLAR PRODUCTS BANNER */}

          <Link
            to="/products?category=Power%2C%20Solar%20%26%20Safety"
            className="dv-banner saffron"
          >

            <span>

              {tr("GO SOLAR")}

            </span>

            <h3>

              {tr("Solar panels & safety gear")}

              <br />

              {tr("up to 42% off")}

            </h3>

            <em>

              {tr("Explore now")}

              <ArrowRight size={18} />

            </em>

          </Link>

        </section>

        {/* =====================================
            TRENDING PRODUCTS
        ====================================== */}

        <section className="dv-section">

          <h2 className="dv-title">

            {tr("Trending now")}

          </h2>

          {/* CATEGORY FILTER TABS */}

          <div className="dv-tabs">

            {[
              "All",
              ...categories.map((c) => c.name)
            ].map((n) => (

              <button
                key={n}
                type="button"
                className={
                  tab === n ? "on" : ""
                }
                onClick={() => setTab(n)}
              >

                {tr(
                  n === "All"
                    ? "All"
                    : short(n)
                )}

              </button>

            ))}

          </div>

          {/* TRENDING PRODUCT GRID */}

          <div className="dv-grid">

            {shown.length ? (

              shown.slice(0, 8).map((p) => (

                <Card
                  key={p.id}
                  p={p}
                />

              ))

            ) : (

              <p className="dv-empty">

                {tr("No deals here yet.")}{" "}

                <Link to="/enquiry">

                  {tr("Send us an enquiry")}

                </Link>

              </p>

            )}

          </div>

        </section>

        {/* =====================================
            TRUST AND SERVICES SECTION
        ====================================== */}

        <section className="dv-trust">

          {[
            [
              Truck,
              "Free delivery",
              "On orders above ₹4,999"
            ],
            [
              ShieldCheck,
              "Secure payments",
              "Safe and easy checkout"
            ],
            [
              BadgeCheck,
              "Quality checked",
              "Trusted institutional suppliers"
            ],
            [
              Headset,
              "Help when you need it",
              "Call or message our team"
            ]
          ].map(([I, h, s2]) => (

            <div key={h}>

              <I size={34} />

              <p>

                <strong>

                  {tr(h)}

                </strong>

                <small>

                  {tr(s2)}

                </small>

              </p>

            </div>

          ))}

        </section>

      </main>

      {/* =====================================
          CART NOTIFICATION
      ====================================== */}

      <div
        className={`dv-toast ${
          toast ? "show" : ""
        }`}
        role="status"
        aria-live="polite"
      >

        <Check size={20} />

        {toast || "Done"}

        <Link to="/cart">

          {tr("View bag")}

        </Link>

      </div>

      {/* =====================================
          FOOTER
      ====================================== */}

      <Footer />

    </>

  );

}

export default Home;
import React, {
  useRef,
  useEffect,
  useState
} from "react";

import { Link } from "react-router-dom";

import {
  ArrowRight,
  ChevronLeft,
  ChevronRight
} from "lucide-react";

import { useTranslation } from "react-i18next";

import "./ProductBanners.css";

const themes = [
  "#dcebd2",
  "#dceaf7",
  "#f0dfc9",
  "#e5dff0",
  "#d5eae8",
  "#f6e3bf"
];

function ProductBanners({ categories = [], offerPct = {} }) {
  const { t } = useTranslation();

  const sliderRef = useRef(null);

  const [paused, setPaused] = useState(false);
  const [active, setActive] = useState(0);

  const keywords = [
    "cleaning",
    "lighting",
    "furniture",
    "cctv",
    "water",
    "playground"
  ];

  const banners = keywords
    .map((keyword) =>
      categories.find((category) =>
        String(category.name || "")
          .toLowerCase()
          .includes(keyword)
      )
    )
    .filter(Boolean);

  const moveSlider = (direction) => {
    const slider = sliderRef.current;

    if (!slider) return;

    const card = slider.querySelector(".gs-promo-card");

    if (!card) return;

    const distance = card.offsetWidth + 12;

    const maxScroll =
      slider.scrollWidth - slider.clientWidth;

    if (direction === 1 &&
        slider.scrollLeft >= maxScroll - 5) {

      slider.scrollTo({
        left: 0,
        behavior: "smooth"
      });

    } else if (
      direction === -1 &&
      slider.scrollLeft <= 5
    ) {

      slider.scrollTo({
        left: maxScroll,
        behavior: "smooth"
      });

    } else {

      slider.scrollBy({
        left: direction * distance,
        behavior: "smooth"
      });

    }
  };

  useEffect(() => {
    if (paused || banners.length < 2) return;

    if (
      window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches
    ) return;

    const timer = setInterval(() => {
      moveSlider(1);
    }, 4000);

    return () => clearInterval(timer);

  }, [paused, banners.length]);

  const handleScroll = () => {
    const slider = sliderRef.current;

    if (!slider) return;

    const card = slider.querySelector(".gs-promo-card");

    if (!card) return;

    setActive(
      Math.round(
        slider.scrollLeft / (card.offsetWidth + 12)
      )
    );
  };

  const goToBanner = (index) => {
    const slider = sliderRef.current;

    if (!slider) return;

    const card = slider.querySelector(".gs-promo-card");

    if (!card) return;

    slider.scrollTo({
      left: index * (card.offsetWidth + 12),
      behavior: "smooth"
    });
  };

  if (!banners.length) return null;

  return (
    <section
      className="gs-promo-section"
      aria-label="Featured product offers"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) {
          setPaused(false);
        }
      }}
    >

      <div className="gs-promo-container">

        <button
          type="button"
          className="gs-promo-arrow previous"
          onClick={() => moveSlider(-1)}
          aria-label="Previous banner"
        >
          <ChevronLeft size={26} />
        </button>

        <div
          className="gs-promo-track"
          ref={sliderRef}
          onScroll={handleScroll}
          onTouchStart={() => setPaused(true)}
          onTouchEnd={() => setPaused(false)}
          onTouchCancel={() => setPaused(false)}
        >

          {banners.map((banner, index) => (

            <Link
              key={banner.id || banner.name}
              to={`/products?category=${encodeURIComponent(
                banner.name
              )}`}
              className="gs-promo-card"
              style={{
                background: themes[index % themes.length]
              }}
            >

              <div className="gs-promo-copy">

                <span className="gs-promo-tag">
                  {t("GramSupply")}
                </span>

                <h2>
                  {offerPct[banner.name]
                    ? `${t("Up to")} ${offerPct[banner.name]}% ${t("OFF")}`
                    : t("Special deals")}
                </h2>

                <p>{t(banner.name)}</p>

              </div>

              <div className="gs-promo-image">

                <img
                  src={banner.image}
                  alt={banner.name}
                  style={{
                    objectPosition:
                      `${banner.focus ?? 50}% 50%`
                  }}
                />

              </div>

              <div className="gs-promo-bottom">

                <span className="gs-promo-shop">
                  {t("Shop now")}
                  <ArrowRight size={18} />
                </span>

              </div>

            </Link>

          ))}

        </div>

        <button
          type="button"
          className="gs-promo-arrow next"
          onClick={() => moveSlider(1)}
          aria-label="Next banner"
        >
          <ChevronRight size={26} />
        </button>

      </div>

      <div className="gs-promo-dots">

        {banners.map((banner, index) => (

          <button
            type="button"
            key={banner.id || banner.name}
            className={active === index ? "active" : ""}
            onClick={() => goToBanner(index)}
            aria-label={`Banner ${index + 1}`}
          />

        ))}

      </div>

      <button
        type="button"
        className="gs-promo-pause"
        onClick={() => setPaused((value) => !value)}
      >
        {paused ? t("Play slideshow") : t("Pause slideshow")}
      </button>

    </section>
  );
}

export default ProductBanners;
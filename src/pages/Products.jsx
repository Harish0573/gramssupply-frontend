import React, { useEffect, useMemo, useState } from "react";

import {
  Search,
  LayoutGrid,
  Trash2,
  Lightbulb,
  Camera,
  Monitor,
  Droplets,
  Armchair,
  Dumbbell,
  Construction,
  Zap,
  Package,
  ArrowLeft
} from "lucide-react";

import { useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";

import Navbar from "../components/Navbar";
import ProductCard from "../components/ProductCard";
import Footer from "../components/Footer";

import { getPricing } from "../utils/pricing";
import api from "../api/axiosConfig";

import {
  fetchProducts,
  cartEntry,
  sameCartItem
} from "../utils/catalog";

import "./Products.css";

const PAGE_SIZE = 12;

// ==========================================
// PRICE RANGES
// ==========================================

const PRICE_RANGES = [
  {
    key: "u1000",
    label: "Under ₹1,000",
    min: 0,
    max: 1000
  },
  {
    key: "1k-5k",
    label: "₹1,000 – ₹5,000",
    min: 1000,
    max: 5000
  },
  {
    key: "5k-25k",
    label: "₹5,000 – ₹25,000",
    min: 5000,
    max: 25000
  },
  {
    key: "25k+",
    label: "Above ₹25,000",
    min: 25000,
    max: Infinity
  }
];

// ==========================================
// SORT OPTIONS
// ==========================================

const SORTS = [
  ["recommended", "Recommended"],
  ["price-asc", "Price: low to high"],
  ["price-desc", "Price: high to low"],
  ["discount", "Biggest discount"],
  ["newest", "Newest first"],
  ["name", "Name: A to Z"]
];

// ==========================================
// CATEGORY ICONS AND NAMES
// ==========================================

const CATEGORY_STYLES = [
  {
    keywords: ["cleaning", "sanitation", "waste", "hygiene"],
    label: "Cleaning",
    icon: Trash2
  },
  {
    keywords: ["lighting", "street light", "outdoor light"],
    label: "Lighting",
    icon: Lightbulb
  },
  {
    keywords: ["cctv", "security", "surveillance"],
    label: "CCTV",
    icon: Camera
  },
  {
    keywords: ["computer", "electronics", "technology", "it equipment"],
    label: "Computers",
    icon: Monitor
  },
  {
    keywords: ["water", "purification", "ro plant"],
    label: "Water",
    icon: Droplets
  },
  {
    keywords: ["furniture"],
    label: "Furniture",
    icon: Armchair
  },
  {
    keywords: ["playground", "sports", "fitness", "gym"],
    label: "Playground",
    icon: Dumbbell
  },
  {
    keywords: ["infrastructure", "construction", "civil"],
    label: "Infrastructure",
    icon: Construction
  },
  {
    keywords: ["solar", "safety", "fire"],
    label: "Solar & Safety",
    icon: Zap
  }
];

// ==========================================
// NORMALIZE CATEGORY NAME
// ==========================================

function normalizeCategory(name) {
  return String(name || "")
    .trim()
    .replace(/\s+/g, " ")
    .toLowerCase();
}

// ==========================================
// CATEGORY STYLE
// ==========================================

function getCategoryStyle(name) {
  const normalizedName = normalizeCategory(name);

  return (
    CATEGORY_STYLES.find(
      (category) =>
        normalizeCategory(category.label) === normalizedName
    ) ||

    CATEGORY_STYLES.find(
      (category) =>
        category.keywords.some((keyword) =>
          normalizedName.includes(keyword)
        )
    ) || {
      label: name,
      icon: Package
    }
  );
}

// ==========================================
// REMOVE DUPLICATE CATEGORIES
// ==========================================

function removeDuplicateCategories(categoryList) {
  const uniqueCategories = new Map();

  categoryList.forEach((category) => {
    const name = String(category?.name || "").trim();

    if (!name) return;

    const key = normalizeCategory(name);

    if (!uniqueCategories.has(key)) {
      uniqueCategories.set(key, {
        ...category,
        name
      });
    }
  });

  return Array.from(uniqueCategories.values());
}

// ==========================================
// GROUP SAME CATEGORY LABELS
// ==========================================

function groupCategories(categoryList) {
  const grouped = new Map();

  categoryList.forEach((category) => {
    const style = getCategoryStyle(category.name);
    const key = normalizeCategory(style.label);

    if (!grouped.has(key)) {
      grouped.set(key, {
        id: key,
        name: style.label,
        label: style.label,
        icon: style.icon,
        originalNames: []
      });
    }

    grouped.get(key).originalNames.push(category.name);
  });

  const categoryOrder = CATEGORY_STYLES.map(
    (item) => normalizeCategory(item.label)
  );

  return Array.from(grouped.values()).sort((a, b) => {
    const indexA = categoryOrder.indexOf(a.id);
    const indexB = categoryOrder.indexOf(b.id);

    return (
      (indexA === -1 ? 999 : indexA) -
      (indexB === -1 ? 999 : indexB)
    );
  });
}

// ==========================================
// PRODUCTS COMPONENT
// ==========================================

function Products() {
  const { t } = useTranslation();

  const [searchParams, setSearchParams] = useSearchParams();

  // ========================================
  // URL PARAMETERS
  // ========================================

  const search = searchParams.get("search") || "";

  const selectedCategory =
    searchParams.get("category") || "All";

  const selectedGroup =
    searchParams.get("group") || "";

  const view = searchParams.get("view") || "";

  const sort =
    searchParams.get("sort") || "recommended";

  const priceKey =
    searchParams.get("price") || "";

  const minDisc =
    Number(searchParams.get("disc") || 0);

  // ========================================
  // CATEGORY SCREEN AND PRODUCT SCREEN
  // ========================================

  const isCategoryScreen =
    view !== "products" &&
    selectedCategory === "All" &&
    !selectedGroup &&
    !search &&
    !priceKey &&
    !minDisc &&
    sort === "recommended";

  // ========================================
  // STATES
  // ========================================

  const [products, setProducts] = useState([]);

  const [categories, setCategories] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const [visible, setVisible] = useState(PAGE_SIZE);

  // ========================================
  // SEARCH FUNCTION
  // ========================================

  const setSearch = (value) => {
    const newParams = new URLSearchParams(searchParams);

    newParams.set("view", "products");

    if (value) {
      newParams.set("search", value);
    } else {
      newParams.delete("search");
    }

    setSearchParams(newParams, {
      replace: true
    });
  };

  // ========================================
  // FETCH PRODUCTS AND CATEGORIES
  // ========================================

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productResponse, categoryResponse] =
          await Promise.all([
            fetchProducts(),

            api
              .get("/categories")
              .then((response) => response.data)
              .catch(() => [])
          ]);

        const formattedProducts =
          Array.isArray(productResponse)
            ? productResponse
            : [];

        setProducts(formattedProducts);

        if (
          Array.isArray(categoryResponse) &&
          categoryResponse.length > 0
        ) {
          setCategories(
            removeDuplicateCategories(categoryResponse)
          );

        } else {

          const fallbackCategories = formattedProducts
            .map((product, index) => ({
              id: `fallback-${index}`,
              name:
                product.category ||
                product.categoryName ||
                ""
            }))
            .filter((category) => category.name);

          setCategories(
            removeDuplicateCategories(fallbackCategories)
          );
        }

        setError("");

      } catch (err) {
        console.error("API Error:", err);

        setError(
          "Unable to load products. Please check your backend connection."
        );

      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // ========================================
  // UNIQUE CATEGORY BOXES
  // ========================================

  const uniqueCategoryBoxes = useMemo(() => {
    return groupCategories(categories);
  }, [categories]);

  const isAllSelected =
    selectedCategory === "All" && !selectedGroup;

  // ========================================
  // UPDATE URL FILTERS
  // ========================================

  const setParam = (key, value) => {
    const next = new URLSearchParams(searchParams);

    next.set("view", "products");

    if (value) {
      next.set(key, value);
    } else {
      next.delete(key);
    }

    setSearchParams(next, {
      replace: true
    });
  };

  // ========================================
  // PRODUCT PRICING AND BADGES
  // ========================================

  const decorated = useMemo(() => {
    const newestIds = new Set(
      [...products]
        .sort((a, b) => b.id - a.id)
        .slice(0, 4)
        .map((product) => product.id)
    );

    return products.map((product) => {
      const { has, pct, mrp } = getPricing(product);

      const badge = newestIds.has(product.id)
        ? "NEW"
        : has && pct >= 45
          ? "BEST DEAL"
          : "";

      return {
        ...product,
        pct: has ? pct : 0,
        mrp,
        badge
      };
    });

  }, [products]);

  // ========================================
  // FILTER PRODUCTS
  // ========================================

  const filteredProducts = useMemo(() => {
    const range = PRICE_RANGES.find(
      (item) => item.key === priceKey
    );

    const text = search.toLowerCase();

    return decorated.filter((product) => {
      const price = Number(product.price);

      const productCategory =
        product.category ||
        product.categoryName ||
        "";

      const normalizedProductCategory =
        normalizeCategory(productCategory);

      const productCategoryGroup =
        normalizeCategory(
          getCategoryStyle(productCategory).label
        );

      const matchesSearch =
        String(product.name || "")
          .toLowerCase()
          .includes(text) ||

        normalizedProductCategory.includes(text);

      const matchesCategory = selectedGroup

        ? productCategoryGroup ===
          normalizeCategory(selectedGroup)

        : selectedCategory === "All" ||

          normalizedProductCategory ===
          normalizeCategory(selectedCategory);

      const matchesPrice =
        !range ||
        (
          price > 0 &&
          price >= range.min &&
          price < range.max
        );

      const matchesDiscount =
        minDisc === 0 ||
        (
          price > 0 &&
          product.pct >= minDisc
        );

      return (
        matchesSearch &&
        matchesCategory &&
        matchesPrice &&
        matchesDiscount
      );
    });

  }, [
    decorated,
    search,
    selectedCategory,
    selectedGroup,
    priceKey,
    minDisc
  ]);

  // ========================================
  // SORT PRODUCTS
  // ========================================

  const sortedProducts = useMemo(() => {
    const priced = (product) =>
      Number(product.price) > 0;

    const byPrice = (direction) => (a, b) => {
      if (!priced(a) && !priced(b)) return 0;

      if (!priced(a)) return 1;

      if (!priced(b)) return -1;

      return direction * (a.price - b.price);
    };

    const comparators = {
      "price-asc": byPrice(1),

      "price-desc": byPrice(-1),

      discount: (a, b) =>
        b.pct - a.pct,

      newest: (a, b) =>
        b.id - a.id,

      name: (a, b) =>
        (a.name || "").localeCompare(b.name || "")
    };

    const list = [...filteredProducts];

    return comparators[sort]
      ? list.sort(comparators[sort])
      : list;

  }, [filteredProducts, sort]);

  // ========================================
  // RESET PAGINATION
  // ========================================

  useEffect(() => {
    setVisible(PAGE_SIZE);
  }, [
    search,
    selectedCategory,
    selectedGroup,
    sort,
    priceKey,
    minDisc,
    view
  ]);

  const shownProducts =
    sortedProducts.slice(0, visible);

  const hasFilters = Boolean(
    search ||
    selectedCategory !== "All" ||
    selectedGroup ||
    sort !== "recommended" ||
    priceKey ||
    minDisc
  );

  // ========================================
  // ADD TO CART
  // ========================================

  const handleAddToCart = (product) => {
    const existingCart = JSON.parse(
      localStorage.getItem("jr_cart") || "[]"
    );

    const existingItem = existingCart.find(
      (item) => sameCartItem(item, product)
    );

    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      existingCart.push(cartEntry(product));
    }

    localStorage.setItem(
      "jr_cart",
      JSON.stringify(existingCart)
    );

    window.dispatchEvent(
      new Event("cart-updated")
    );

    alert(`${product.name} added to cart!`);
  };

  // ========================================
  // DESKTOP CATEGORY SELECTION
  // ========================================

  const handleCategoryChange = (value) => {
    const newParams =
      new URLSearchParams(searchParams);

    newParams.set("view", "products");

    newParams.delete("group");

    if (value.startsWith("group:")) {

      newParams.delete("category");

      newParams.set(
        "group",
        value.substring(6)
      );

    } else if (value === "All") {

      newParams.delete("category");

    } else {

      newParams.set("category", value);

    }

    setSearchParams(newParams, {
      replace: true
    });
  };

  // ========================================
  // OPEN SELECTED CATEGORY PRODUCTS
  // ========================================

  const handleCategoryGroupChange = (value) => {
    const newParams = new URLSearchParams();

    newParams.set("view", "products");

    if (value !== "All") {
      newParams.set("group", value);
    }

    setSearchParams(newParams, {
      replace: false
    });

    window.scrollTo({
      top: 0,
      behavior: "instant"
    });
  };

  // ========================================
  // BACK TO CATEGORY GRID
  // ========================================

  const handleBackToCategories = () => {
    setSearchParams(
      {
        view: "categories"
      },
      {
        replace: false
      }
    );

    window.scrollTo({
      top: 0,
      behavior: "instant"
    });
  };

  // ========================================
  // CLEAR FILTERS
  // ========================================

  const clearFilters = () => {
    setSearchParams(
      {
        view: "products"
      },
      {
        replace: true
      }
    );
  };

  // ========================================
  // LOADING SCREEN
  // ========================================

  if (loading) {
    return (
      <>
        <Navbar />

        <main className="products-page">
          <h2>Loading products...</h2>
        </main>
      </>
    );
  }

  // ========================================
  // ERROR SCREEN
  // ========================================

  if (error) {
    return (
      <>
        <Navbar />

        <main className="products-page">

          <h2>{error}</h2>

          <button
            onClick={() => window.location.reload()}
          >
            Try Again
          </button>

        </main>
      </>
    );
  }

  // ========================================
  // MAIN PRODUCTS PAGE
  // ========================================

  return (
    <>
      <Navbar />

      <main
        className={`products-page ${
          isCategoryScreen
            ? "category-only-screen"
            : "product-only-screen"
        }`}
      >

        {/* DESKTOP PAGE HEADING */}

        <section className="products-heading">

          <p>THE GRAMSUPPLY CATALOGUE</p>

          <h1>
            Products for everyday
            <br />
            institutional needs.
          </h1>

          <span>
            Explore supplies for village infrastructure,
            sanitation, technology, furniture and public
            institutions.
          </span>

        </section>

        {/* =================================
            CATEGORY ONLY SCREEN
        ================================= */}

        {isCategoryScreen && (

          <section className="products-mobile-categories">

            <div className="products-category-heading">

              <h2>
                {t("Shop by category")}
              </h2>

              <button
                type="button"
                className="products-view-all"
                onClick={() =>
                  handleCategoryGroupChange("All")
                }
              >
                <LayoutGrid size={16} />

                {t("View all")}

              </button>

            </div>

            <div className="products-category-grid">

              {uniqueCategoryBoxes.map((category) => {

                const Icon = category.icon;

                return (

                  <button
                    type="button"
                    key={category.id}
                    className="products-category-card"
                    onClick={() =>
                      handleCategoryGroupChange(
                        category.label
                      )
                    }
                    title={category.label}
                  >

                    <Icon
                      size={30}
                      strokeWidth={1.8}
                    />

                    <span>
                      {t(category.label)}
                    </span>

                  </button>

                );

              })}

            </div>

          </section>

        )}

        {/* =================================
            BACK TO CATEGORIES BUTTON
        ================================= */}

        {!isCategoryScreen && (

          <div className="products-back-wrapper">

            <button
              type="button"
              className="products-back-btn"
              onClick={handleBackToCategories}
            >

              <ArrowLeft
                size={21}
                strokeWidth={2}
              />

              <span>
                {t("Back to categories")}
              </span>

            </button>

          </div>

        )}

        {/* =================================
            SELECTED CATEGORY PRODUCTS
        ================================= */}

        <div className="products-list-content">

          <div className="products-mobile-title">

            <h2>

              {isAllSelected
                ? t("All Products")
                : `${t(
                    selectedGroup ||
                    getCategoryStyle(selectedCategory).label
                  )} ${t("Products")}`
              }

            </h2>

          </div>

          {/* SEARCH AND CATEGORY DROPDOWN */}

          <div className="products-toolbar">

            <div className="products-search">

              <Search size={20} />

              <input
                type="text"
                placeholder="Search products or categories..."
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
              />

            </div>

            <select
              className="products-category-select"
              value={
                selectedGroup
                  ? `group:${selectedGroup}`
                  : selectedCategory
              }
              onChange={(e) =>
                handleCategoryChange(e.target.value)
              }
            >

              <option value="All">
                All Categories
              </option>

              {selectedGroup && (

                <option value={`group:${selectedGroup}`}>
                  {selectedGroup} (All matching categories)
                </option>

              )}

              {categories.map((category) => (

                <option
                  key={normalizeCategory(category.name)}
                  value={category.name}
                >
                  {category.name}
                </option>

              ))}

            </select>

          </div>

          {/* =================================
              SORT AND FILTERS
          ================================= */}

          <div className="products-filters">

            <label>

              Sort by

              <select
                value={sort}
                onChange={(e) =>
                  setParam(
                    "sort",
                    e.target.value === "recommended"
                      ? ""
                      : e.target.value
                  )
                }
              >

                {SORTS.map(([value, label]) => (

                  <option
                    key={value}
                    value={value}
                  >
                    {label}
                  </option>

                ))}

              </select>

            </label>

            <label>

              Price

              <select
                value={priceKey}
                onChange={(e) =>
                  setParam("price", e.target.value)
                }
              >

                <option value="">
                  Any price
                </option>

                {PRICE_RANGES.map((range) => (

                  <option
                    key={range.key}
                    value={range.key}
                  >
                    {range.label}
                  </option>

                ))}

              </select>

            </label>

            <label>

              Discount

              <select
                value={minDisc || ""}
                onChange={(e) =>
                  setParam("disc", e.target.value)
                }
              >

                <option value="">
                  Any discount
                </option>

                {[10, 20, 30, 40].map((discount) => (

                  <option
                    key={discount}
                    value={discount}
                  >
                    {discount}% or more
                  </option>

                ))}

              </select>

            </label>

          </div>

          {/* RESULTS INFORMATION */}

          <div className="results-info">

            <span>

              Showing {shownProducts.length} of{" "}
              {sortedProducts.length} products

            </span>

            {hasFilters && (

              <button
                className="clear-filter-btn"
                onClick={clearFilters}
              >
                Clear filters
              </button>

            )}

          </div>

          {/* PRODUCT GRID */}

          <section className="products-grid">

            {shownProducts.length > 0 ? (

              shownProducts.map((product) => (

                <ProductCard
                  key={product.id}
                  product={product}
                  onAddToCart={handleAddToCart}
                />

              ))

            ) : (

              <div className="empty-products">

                <h3>No products found</h3>

                <p>
                  Try another search or category.
                </p>

                <button onClick={clearFilters}>
                  Clear Filters
                </button>

              </div>

            )}

          </section>

          {/* LOAD MORE PRODUCTS */}

          {visible < sortedProducts.length && (

            <div className="load-more-wrap">

              <button
                className="load-more-btn"
                onClick={() =>
                  setVisible((value) => value + PAGE_SIZE)
                }
              >

                Load more (
                {sortedProducts.length - visible}
                {" "}more)

              </button>

            </div>

          )}

        </div>

      </main>

      <Footer />

    </>
  );
}

export default Products;
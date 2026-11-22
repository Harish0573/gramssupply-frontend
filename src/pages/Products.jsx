
import React, { useEffect, useMemo, useState } from "react";
import { Search } from "lucide-react";
import { useSearchParams } from "react-router-dom";

import Navbar from "../components/Navbar";
import ProductCard from "../components/ProductCard";
import Footer from "../components/Footer";
import { getPricing } from "../utils/pricing";
import api from "../api/axiosConfig";
import { fetchProducts, cartEntry, sameCartItem } from "../utils/catalog";

import "./Products.css";

const PAGE_SIZE = 12;

const PRICE_RANGES = [
  { key: "u1000", label: "Under ₹1,000", min: 0, max: 1000 },
  { key: "1k-5k", label: "₹1,000 – ₹5,000", min: 1000, max: 5000 },
  { key: "5k-25k", label: "₹5,000 – ₹25,000", min: 5000, max: 25000 },
  { key: "25k+", label: "Above ₹25,000", min: 25000, max: Infinity },
];

const SORTS = [
  ["recommended", "Recommended"],
  ["price-asc", "Price: low to high"],
  ["price-desc", "Price: high to low"],
  ["discount", "Biggest discount"],
  ["newest", "Newest first"],
  ["name", "Name: A to Z"],
];

function Products() {
  // ==================================
  // 1. URL SEARCH AND CATEGORY FILTER
  // ==================================

  const [searchParams, setSearchParams] = useSearchParams();

  const search = searchParams.get("search") || "";

  const selectedCategoryFromUrl =
    searchParams.get("category") || "All";

  const [selectedCategory, setSelectedCategory] = useState(
    selectedCategoryFromUrl
  );

  const setSearch = (value) => {
    const newParams = new URLSearchParams(searchParams);

    if (value) {
      newParams.set("search", value);
    } else {
      newParams.delete("search");
    }

    setSearchParams(newParams, { replace: true });
  };

  useEffect(() => {
    setSelectedCategory(searchParams.get("category") || "All");
  }, [searchParams]);

  // ==================================
  // 2. PRODUCT AND CATEGORY STATES
  // ==================================

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ==================================
  // 3. FETCH DATA FROM SPRING BOOT
  // ==================================

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productResponse, categoryResponse] = await Promise.all([
          fetchProducts(),
          api.get("/categories").then((r) => r.data).catch(() => localCategories),
        ]);

        const formattedProducts = productResponse;

        setProducts(formattedProducts);
        setCategories(categoryResponse);

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

  // ==================================
  // 4. LABELS, FILTERS AND SORTING
  // ==================================

  const sort = searchParams.get("sort") || "recommended";
  const priceKey = searchParams.get("price") || "";
  const minDisc = Number(searchParams.get("disc") || 0);

  const [visible, setVisible] = useState(PAGE_SIZE);

  const setParam = (key, value) => {
    const next = new URLSearchParams(searchParams);

    if (value) {
      next.set(key, value);
    } else {
      next.delete(key);
    }

    setSearchParams(next, { replace: true });
  };

  // Add original price, discount and badges
  const decorated = useMemo(() => {
    const newestIds = new Set(
      [...products]
        .sort((a, b) => b.id - a.id)
        .slice(0, 4)
        .map((p) => p.id)
    );

    return products.map((p) => {
      const { has, pct, mrp } = getPricing(p);

      const badge = newestIds.has(p.id)
        ? "NEW"
        : has && pct >= 45
          ? "BEST DEAL"
          : "";

      return {
        ...p,
        pct: has ? pct : 0,
        mrp,
        badge,
      };
    });
  }, [products]);

  // FILTER PRODUCTS
  const filteredProducts = useMemo(() => {
    const range = PRICE_RANGES.find((r) => r.key === priceKey);
    const text = search.toLowerCase();

    return decorated.filter((p) => {
      const price = Number(p.price);

      const matchesSearch =
        (p.name || "").toLowerCase().includes(text) ||
        (p.category || "").toLowerCase().includes(text);

      const matchesCategory =
        selectedCategory === "All" ||
        p.category === selectedCategory;

      const matchesPrice =
        !range ||
        (price > 0 && price >= range.min && price < range.max);

      const matchesDiscount =
        minDisc === 0 || (price > 0 && p.pct >= minDisc);

      return (
        matchesSearch &&
        matchesCategory &&
        matchesPrice &&
        matchesDiscount
      );
    });
  }, [decorated, search, selectedCategory, priceKey, minDisc]);

  // SORT PRODUCTS
  const sortedProducts = useMemo(() => {
    const priced = (p) => Number(p.price) > 0;

    const byPrice = (dir) => (a, b) => {
      if (!priced(a) && !priced(b)) return 0;
      if (!priced(a)) return 1;
      if (!priced(b)) return -1;

      return dir * (a.price - b.price);
    };

    const comparators = {
      "price-asc": byPrice(1),
      "price-desc": byPrice(-1),
      discount: (a, b) => b.pct - a.pct,
      newest: (a, b) => b.id - a.id,
      name: (a, b) =>
        (a.name || "").localeCompare(b.name || ""),
    };

    const list = [...filteredProducts];

    return comparators[sort]
      ? list.sort(comparators[sort])
      : list;
  }, [filteredProducts, sort]);

  // RESET PAGINATION WHEN FILTERS CHANGE
  useEffect(() => {
    setVisible(PAGE_SIZE);
  }, [search, selectedCategory, sort, priceKey, minDisc]);

  const shownProducts = sortedProducts.slice(0, visible);

  const hasFilters = Boolean(
    search ||
    selectedCategory !== "All" ||
    sort !== "recommended" ||
    priceKey ||
    minDisc
  );

  // ==================================
  // 5. ADD TO CART
  // ==================================

  const handleAddToCart = (product) => {
    const existingCart = JSON.parse(
      localStorage.getItem("jr_cart") || "[]"
    );

    const existingItem = existingCart.find((item) =>
      sameCartItem(item, product)
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

    window.dispatchEvent(new Event("cart-updated"));

    alert(`${product.name} added to cart!`);
  };

  // ==================================
  // 6. CATEGORY DROPDOWN HANDLER
  // ==================================

  const handleCategoryChange = (value) => {
    setSelectedCategory(value);

    const newParams = new URLSearchParams(searchParams);

    if (value === "All") {
      newParams.delete("category");
    } else {
      newParams.set("category", value);
    }

    setSearchParams(newParams, { replace: true });
  };

  // ==================================
  // 7. CLEAR FILTERS
  // ==================================

  const clearFilters = () => {
    setSearchParams({}, { replace: true });
    setSelectedCategory("All");
  };

  // ==================================
  // 8. LOADING SCREEN
  // ==================================

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

  // ==================================
  // 9. ERROR SCREEN
  // ==================================

  if (error) {
    return (
      <>
        <Navbar />

        <main className="products-page">
          <h2>{error}</h2>

          <button onClick={() => window.location.reload()}>
            Try Again
          </button>
        </main>
      </>
    );
  }

  // ==================================
  // 10. PRODUCTS PAGE UI
  // ==================================

  return (
    <>
      <Navbar />

      <main className="products-page">
        <section className="products-heading">
          <p>THE GRAMSUPPLY CATALOGUE</p>

          <h1>
            Products for everyday
            <br />
            institutional needs.
          </h1>

          <span>
            Explore supplies for village infrastructure, sanitation,
            technology, furniture and public institutions.
          </span>
        </section>

        {/* SEARCH AND CATEGORY */}

        <div className="products-toolbar">
          <div className="products-search">
            <Search size={20} />

            <input
              type="text"
              placeholder="Search products or categories..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <select
            value={selectedCategory}
            onChange={(e) =>
              handleCategoryChange(e.target.value)
            }
          >
            <option value="All">All Categories</option>

            {categories.map((category) => (
              <option key={category.id} value={category.name}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        {/* SORT AND FILTERS */}

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
                <option key={value} value={value}>
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
              <option value="">Any price</option>

              {PRICE_RANGES.map((r) => (
                <option key={r.key} value={r.key}>
                  {r.label}
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
              <option value="">Any discount</option>

              {[10, 20, 30, 40].map((d) => (
                <option key={d} value={d}>
                  {d}% or more
                </option>
              ))}
            </select>
          </label>
        </div>

        {/* RESULTS */}

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

              <p>Try another search or category.</p>

              <button onClick={clearFilters}>
                Clear Filters
              </button>
            </div>
          )}
        </section>

        {/* LOAD MORE */}

        {visible < sortedProducts.length && (
          <div className="load-more-wrap">
            <button
              className="load-more-btn"
              onClick={() =>
                setVisible((v) => v + PAGE_SIZE)
              }
            >
              Load more ({sortedProducts.length - visible} more)
            </button>
          </div>
        )}
      </main>

      <Footer />
    </>
  );
}

export default Products;

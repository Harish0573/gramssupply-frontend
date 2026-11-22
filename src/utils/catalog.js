// One place that decides what a product looks like everywhere in the site
// (Products list, Product details, Cart, Checkout, Home).
// Backend products are matched to the built-in catalogue by NAME (never by id),
// so the same product always shows the same price, image and details.
import api from "../api/axiosConfig";
import localProducts from "../data/products";

const clean = (s) => String(s || "").trim().toLowerCase();
const toNumber = (v) => Number(String(v ?? "").replace(/[^0-9.]/g, "")) || 0;

const byName = new Map(localProducts.map((p) => [clean(p.name), p]));
const byModel = new Map(localProducts.map((p) => [clean(p.model), p]));

export function normalizeProduct(raw) {
  const local = byName.get(clean(raw.name)) || byModel.get(clean(raw.model)) || null;
  const backendPrice = toNumber(raw.price);
  const price = backendPrice > 0 ? backendPrice : toNumber(local?.priceLabel ?? local?.price);
  return {
    ...(local || {}),
    ...raw,
    id: raw.id,
    category: raw.categoryName || raw.category || local?.category,
    categoryName: raw.categoryName || raw.category || local?.category,
    image: raw.imageUrl || raw.image || local?.image,
    imageUrl: raw.imageUrl || raw.image || local?.image,
    description: raw.description || local?.description,
    price: price > 0 ? price : null,
  };
}

const rows = (d) => (Array.isArray(d) ? d : d?.content || []);

export async function fetchProducts() {
  try {
    const res = await api.get("/products");
    return rows(res.data).filter((p) => p.active !== false).map(normalizeProduct);
  } catch {
    return localProducts.map(normalizeProduct); // backend down -> built-in catalogue
  }
}

export async function fetchProduct(id) {
  try {
    const res = await api.get(`/products/${id}`);
    if (res.data && res.data.id !== undefined) return normalizeProduct(res.data);
  } catch { /* fall through to the list lookup */ }
  const all = await fetchProducts();
  return all.find((p) => String(p.id) === String(id)) || null;
}

export const formatPrice = (n) => `₹${Number(n).toLocaleString("en-IN")}`;

// ==================================
// CART ITEMS
// A cart line saved while the backend was OFF uses the built-in ids (1-9).
// Backend ids can be different, so every line also stores the product's
// model and name, and matching uses those first. The id is used only for
// old lines that have neither.
// ==================================
export function cartEntry(product, quantity = 1) {
  return {
    productId: product.id,
    model: product.model || null,
    name: product.name || null,
    quantity,
  };
}

export function sameCartItem(item, product) {
  if (item.model && product.model) return clean(item.model) === clean(product.model);
  if (item.name && product.name) return clean(item.name) === clean(product.name);
  return String(item.productId) === String(product.id);
}

export function findCartProduct(item, products) {
  if (item.model) {
    const m = products.find((p) => p.model && clean(p.model) === clean(item.model));
    if (m) return m;
  }
  if (item.name) {
    const n = products.find((p) => clean(p.name) === clean(item.name));
    if (n) return n;
  }
  if (item.model || item.name) return null; // saved with details, but not in this catalogue
  return products.find((p) => String(p.id) === String(item.productId)) || null;
}

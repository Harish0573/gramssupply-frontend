import React, { useEffect, useState } from "react";
import { Pencil, Plus, Trash2, X } from "lucide-react";
import api, { errorMessage } from "../api/axiosConfig";

const EMPTY = { id: null, name: "", categoryId: "", price: "", description: "", imageUrl: "" };
const inr = (n) => (Number(n) > 0 ? `₹${Number(n).toLocaleString("en-IN")}` : "Price on request");

// Admin: list, add, edit and remove (hide) products. Changes go to the backend database.
export default function AdminProducts({ onChanged }) {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState(null); // null = form closed
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const [p, c] = await Promise.all([api.get("/products"), api.get("/categories")]);
      setProducts(Array.isArray(p.data) ? p.data : []);
      setCategories(Array.isArray(c.data) ? c.data : []);
      setError("");
    } catch (e) {
      setError(errorMessage(e, "Could not load products. Is the backend running?"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const set = (key) => (e) => setForm({ ...form, [key]: e.target.value });

  const openNew = () => {
    setError("");
    setForm({ ...EMPTY, categoryId: categories[0]?.id ?? "" });
  };

  const openEdit = (p) => {
    setError("");
    setForm({
      id: p.id,
      name: p.name || "",
      categoryId: p.categoryId ?? "",
      price: p.price ?? "",
      description: p.description || "",
      imageUrl: p.imageUrl || "",
    });
  };

  const save = async (e) => {
    e.preventDefault();
    const name = form.name.trim();
    if (name.length < 2) return setError("Enter the product name");
    if (!form.categoryId) return setError("Choose a category");
    const price = form.price === "" ? 0 : Number(form.price);
    if (!Number.isFinite(price) || price < 0) return setError("Enter a valid price (0 means price on request)");

    const body = {
      name,
      categoryId: Number(form.categoryId),
      price,
      description: form.description.trim() || null,
      imageUrl: form.imageUrl.trim() || null,
    };

    setBusy(true);
    setError("");
    try {
      if (form.id) await api.put(`/products/${form.id}`, body);
      else await api.post("/products", body);
      setForm(null);
      await load();
      onChanged?.();
    } catch (err) {
      setError(errorMessage(err, "Could not save the product."));
    } finally {
      setBusy(false);
    }
  };

  const remove = async (p) => {
    if (!window.confirm(`Remove "${p.name}" from the shop? Customers will no longer see it.`)) return;
    try {
      await api.delete(`/products/${p.id}`);
      await load();
      onChanged?.();
    } catch (err) {
      alert(errorMessage(err, "Could not remove the product."));
    }
  };

  return (
    <>
      <div className="table-heading">
        <h2>Products</h2>
        <span>{products.length} active</span>
      </div>

      <div className="ap-toolbar">
        <button type="button" className="ap-add" onClick={openNew}>
          <Plus size={17} /> Add product
        </button>
      </div>

      {form && (
        <form className="ap-form" onSubmit={save}>
          <div className="ap-form-head">
            <h3>{form.id ? "Edit product" : "New product"}</h3>
            <button type="button" className="ap-close" onClick={() => setForm(null)} aria-label="Close">
              <X size={18} />
            </button>
          </div>

          <div className="ap-grid">
            <label>
              <span>Product name *</span>
              <input value={form.name} onChange={set("name")} maxLength={180} placeholder="e.g. Commercial RO Plant" />
            </label>
            <label>
              <span>Category *</span>
              <select value={form.categoryId} onChange={set("categoryId")}>
                <option value="">Choose category</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </label>
            <label>
              <span>Price (₹)</span>
              <input type="number" min="0" step="1" value={form.price} onChange={set("price")} placeholder="0 = price on request" />
            </label>
            <label>
              <span>Image (URL or /products/file.jpg)</span>
              <input value={form.imageUrl} onChange={set("imageUrl")} placeholder="https://... or /products/cctv.jpg" />
            </label>
            <label className="ap-wide">
              <span>Description</span>
              <textarea rows={3} value={form.description} onChange={set("description")} maxLength={2000} />
            </label>
          </div>

          {error && <p className="ap-error" role="alert">{error}</p>}

          <div className="ap-actions">
            <button type="button" className="ap-cancel" onClick={() => setForm(null)}>Cancel</button>
            <button type="submit" className="ap-save" disabled={busy}>
              {busy ? "Saving…" : form.id ? "Save changes" : "Add product"}
            </button>
          </div>
        </form>
      )}

      {error && !form && <p className="admin-warn">{error}</p>}

      {loading ? (
        <p className="ap-muted">Loading products…</p>
      ) : products.length === 0 ? (
        <p className="ap-muted">No products yet. Click "Add product" to create one.</p>
      ) : (
        <div className="table-wrapper">
          <table className="enquiry-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Category</th>
                <th>Price</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.id}>
                  <td><b>{p.name}</b><div><small>ID {p.id}</small></div></td>
                  <td>{p.categoryName || "—"}</td>
                  <td>{inr(p.price)}</td>
                  <td>
                    <div className="ap-row-actions">
                      <button type="button" onClick={() => openEdit(p)} className="ap-edit">
                        <Pencil size={15} /> Edit
                      </button>
                      <button type="button" onClick={() => remove(p)} className="ap-remove">
                        <Trash2 size={15} /> Remove
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
